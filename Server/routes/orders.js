const express = require("express");
const Order = require("../../Server/models/Order");
const router = express.Router();

// Simple in-memory orders storage for testing
let orders = [];
let orderIdCounter = 1;

// GET /api/orders - Get all orders for admin dashboard
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(20);
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
});

// GET /api/orders/stats/summary - Get order statistics for admin dashboard
router.get("/stats/summary", async (req, res) => {
  try {
    const activeOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const totalOrders = await Order.countDocuments({});

    res.json({
      activeOrders,
      completedOrders,
      totalOrders,
    });
  } catch (error) {
    console.error("Order stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch order statistics",
    });
  }
});

// GET /api/orders/table/:tableId - Get existing order for a table
router.get("/table/:tableId", async (req, res) => {
  try {
    const { tableId } = req.params;

    // Find pending order for this table from MongoDB
    const existingOrder = await Order.findOne({
      tableId: tableId,
      status: "pending",
    }).populate("items.menuItemId", "name price");

    res.json({
      success: true,
      order: existingOrder, // Will be null if not found, which is fine
    });
  } catch (error) {
    console.error("Error fetching table order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch table order",
    });
  }
});

// POST /api/orders - Create or update order using MongoDB
router.post("/", async (req, res) => {
  try {
    console.log(
      "Order API called with data:",
      JSON.stringify(req.body, null, 2)
    );

    const {
      tableId,
      items,
      customerCount,
      specialRequests,
      orderId,
      isUpdate,
    } = req.body;

    // Validate required fields
    if (!tableId) {
      return res.status(400).json({
        success: false,
        error: "Table ID is required",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "At least one item is required",
      });
    }

    // Handle updates to existing orders
    if (isUpdate && orderId) {
      try {
        // Find the existing order
        const existingOrder = await Order.findById(orderId);

        if (!existingOrder) {
          return res.status(404).json({
            success: false,
            error: "Order not found for update",
          });
        }

        console.log("Found existing order to update:", existingOrder._id);

        // Create a map of existing items for easier lookup
        const existingItems = {};
        existingOrder.items.forEach((item) => {
          // Convert ObjectId to string for comparison
          const key = String(item.menuItemId);
          existingItems[key] = item;
        });

        console.log("Processing updated items...");
        const updatedItems = [...existingOrder.items]; // Start with existing items

        // Process each new item
        for (const newItem of items) {
          const menuItemId = String(newItem.menuItemId);

          // Find the existing item by menuItemId
          const existingItemIndex = updatedItems.findIndex(
            (item) => String(item.menuItemId) === menuItemId
          );

          if (existingItemIndex >= 0) {
            // Update existing item quantity
            console.log(
              `Updating item ${newItem.name}: old quantity=${updatedItems[existingItemIndex].quantity}, adding ${newItem.quantity}`
            );
            updatedItems[existingItemIndex].quantity += parseInt(
              newItem.quantity || 0
            );
          } else {
            // Add as new item
            console.log(
              `Adding new item ${newItem.name}, quantity=${newItem.quantity}`
            );
            updatedItems.push({
              menuItemId: menuItemId,
              quantity: parseInt(newItem.quantity || 0),
              price: parseFloat(newItem.price || 0),
              name: newItem.name,
            });
          }
        }

        // Calculate new total
        const total = updatedItems.reduce(
          (sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity),
          0
        );

        console.log(`New order total: ${total}`);

        // Update the order in database
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          {
            items: updatedItems,
            total: total,
            updatedAt: new Date(),
          },
          { new: true }
        );

        console.log("Order updated successfully");

        return res.json({
          success: true,
          order: updatedOrder,
          message: "Order updated successfully",
        });
      } catch (updateError) {
        console.error("Error updating order:", updateError);
        return res.status(500).json({
          success: false,
          error: `Error updating order: ${updateError.message}`,
        });
      }
    }
    // New order creation
    else {
      try {
        // Format items for saving
        const formattedItems = items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: parseInt(item.quantity || 1),
          price: parseFloat(item.price || 0),
          name: item.name || "Unknown Item",
        }));

        // Calculate order total
        const orderTotal = formattedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Generate order number
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");

        // Find last order for today to generate sequence
        const lastOrder = await Order.findOne({
          orderNumber: { $regex: new RegExp(`^${dateStr}-`) },
        }).sort({ createdAt: -1 });

        let sequence = 1;
        if (lastOrder && lastOrder.orderNumber) {
          const parts = lastOrder.orderNumber.split("-");
          if (parts.length === 2) {
            const lastSequence = parseInt(parts[1]);
            if (!isNaN(lastSequence)) {
              sequence = lastSequence + 1;
            }
          }
        }

        const orderNumber = `${dateStr}-${sequence
          .toString()
          .padStart(3, "0")}`;

        // Create the new order
        const newOrder = new Order({
          tableId,
          orderNumber,
          items: formattedItems,
          total: orderTotal,
          customerCount: parseInt(customerCount || 1),
          specialRequests: specialRequests || "",
          status: "pending",
        });

        const savedOrder = await newOrder.save();
        console.log("New order created successfully:", savedOrder._id);

        return res.status(201).json({
          success: true,
          order: savedOrder,
          message: "Order created successfully",
        });
      } catch (createError) {
        console.error("Error creating order:", createError);
        return res.status(500).json({
          success: false,
          error: `Error creating order: ${createError.message}`,
        });
      }
    }
  } catch (error) {
    console.error("Order processing error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create order",
    });
  }
});

// GET /api/orders - Get all orders
router.get("/", (req, res) => {
  try {
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Orders fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
});

module.exports = router;
