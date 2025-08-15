const express = require('express');
const Order = require('../../Server/models/Order');
const router = express.Router();

// Simple in-memory orders storage for testing
let orders = [];
let orderIdCounter = 1;

// GET /api/orders - Get all orders for admin dashboard
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(20);
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});

// GET /api/orders/stats/summary - Get order statistics for admin dashboard
router.get('/stats/summary', async (req, res) => {
  try {
    const activeOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const totalOrders = await Order.countDocuments({});

    res.json({
      activeOrders,
      completedOrders,
      totalOrders,
    });
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order statistics',
    });
  }
});

// GET /api/orders/table/:tableId - Get existing order for a table
router.get('/table/:tableId', async (req, res) => {
  try {
    const { tableId } = req.params;
    
    // Find pending order for this table from MongoDB
    const existingOrder = await Order.findOne({ 
      tableId: tableId, 
      status: 'pending' 
    }).populate('items.menuItemId', 'name price');
    
    res.json({
      success: true,
      order: existingOrder // Will be null if not found, which is fine
    });
  } catch (error) {
    console.error('Error fetching table order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch table order'
    });
  }
});

// POST /api/orders - Create or update order using MongoDB
router.post("/", async (req, res) => {
  try {
    const { tableId, items, customerCount, specialRequests, isUpdate } = req.body;
    
    console.log("=== ORDER SUBMISSION DEBUG ===");
    console.log("Full request body:", req.body);
    console.log("Parsed data:", { tableId, items: items?.length, customerCount, specialRequests, isUpdate });
    
    if (!tableId || !items || items.length === 0) {
      console.log("Validation failed:", { tableId, items: items?.length });
      return res.status(400).json({
        success: false,
        error: "Table ID and items are required",
        received: { tableId, itemsCount: items?.length }
      });
    }
    
    // Validate each item structure
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.menuItemId || !item.quantity || !item.price || !item.name) {
        console.log(`Invalid item at index ${i}:`, item);
        return res.status(400).json({
          success: false,
          error: `Invalid item structure at index ${i}. Required: menuItemId, quantity, price, name`,
          invalidItem: item
        });
      }
    }

    if (isUpdate) {
      // Find and update existing order for this table
      const existingOrder = await Order.findOne({ 
        tableId: tableId, 
        status: 'pending' 
      });
      
      if (existingOrder) {
        // Handle both new items and quantity updates for existing items
        const newItems = [];
        let updatedItemsCount = 0;
        
        items.forEach(newItem => {
          const existingItem = existingOrder.items.find(existingItem => 
            existingItem.menuItemId.toString() === newItem.menuItemId.toString()
          );
          
          if (existingItem) {
            // Item already exists - increase quantity
            existingItem.quantity += newItem.quantity;
            updatedItemsCount++;
            console.log(`Updated ${newItem.name}: quantity increased to ${existingItem.quantity}`);
          } else {
            // New item - add to list
            newItems.push(newItem);
          }
        });
        
        console.log('Existing items count:', existingOrder.items.length);
        console.log('New items to add:', newItems.length);
        console.log('Items with updated quantities:', updatedItemsCount);
        console.log('New items:', newItems.map(item => item.name));
        
        if (newItems.length > 0) {
          existingOrder.items.push(...newItems);
        }
        
        if (specialRequests) {
          existingOrder.specialRequests = existingOrder.specialRequests 
            ? `${existingOrder.specialRequests}; ${specialRequests}`
            : specialRequests;
        }
        
        const updatedOrder = await existingOrder.save();
        
        console.log('Order updated:', updatedOrder);
        
        // Create appropriate success message
        let message = `Order updated! Total: ₹${updatedOrder.total}`;
        if (newItems.length > 0 && updatedItemsCount > 0) {
          message = `${newItems.length} new items added, ${updatedItemsCount} items updated! Total: ₹${updatedOrder.total}`;
        } else if (newItems.length > 0) {
          message = `${newItems.length} new items added! Total: ₹${updatedOrder.total}`;
        } else if (updatedItemsCount > 0) {
          message = `${updatedItemsCount} items updated! Total: ₹${updatedOrder.total}`;
        }
        
        res.json({
          success: true,
          order: updatedOrder,
          message: message
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'No existing order found for this table'
        });
      }
    } else {
      // Create new order
      const newOrder = new Order({
        tableId,
        items,
        customerCount: customerCount || 1,
        specialRequests: specialRequests || '',
        status: 'pending'
      });

      const savedOrder = await newOrder.save();
      
      console.log('New order created:', savedOrder);

      res.json({
        success: true,
        order: savedOrder,
        message: `Order created! Total: ₹${savedOrder.total}`
      });
    }
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create order"
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
