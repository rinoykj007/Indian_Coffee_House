const express = require("express");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Table = require("../models/Table");
const { authenticate, authorize } = require("../middleware/auth");
const { paymentValidator } = require("../middleware/validators");
const router = express.Router();

// GET /api/payments/reports/daily - Get daily revenue report for admin dashboard (authenticated staff)
router.get("/reports/daily", authenticate, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const todayPayments = await Payment.find({
      paidAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const todayRevenue = todayPayments.reduce(
      (sum, payment) => sum + payment.totalAmount,
      0
    );
    const totalTransactions = todayPayments.length;

    res.json({
      todayRevenue,
      totalTransactions,
      date: today.toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Payment reports error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payment reports",
    });
  }
});

// GET /api/payments/table/:tableId/bill - Generate bill for a table (authenticated staff)
router.get("/table/:tableId/bill", authenticate, async (req, res) => {
  try {
    const { tableId } = req.params;

    // Find pending order for this table
    const order = await Order.findOne({
      tableId: tableId,
      status: "pending",
    }).populate("tableId", "tableNumber");

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "No pending order found for this table",
      });
    }

    // Calculate bill details
    const itemsCount = order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const subtotal = order.total;
    const totalAmount = subtotal; // No tax

    const billData = {
      orderId: order._id,
      orderNumber: order.orderNumber,
      tableId: order.tableId ? order.tableId._id : order.tableId,
      tableNumber: order.tableId ? order.tableId.tableNumber : "Unknown",
      items: order.items || [],
      itemsCount: itemsCount,
      subtotal: subtotal,
      totalAmount: totalAmount,
      createdAt: order.createdAt,
    };

    console.log("Bill generated for table:", order.tableId ? order.tableId.tableNumber : "Unknown");

    res.json({
      success: true,
      bill: billData,
      message: `Bill generated for Table ${order.tableId ? order.tableId.tableNumber : "Unknown"}`,
    });
  } catch (error) {
    console.error("Error generating bill:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate bill",
    });
  }
});

// POST /api/payments/process - Process payment for an order (authenticated staff)
router.post("/process", authenticate, paymentValidator, async (req, res) => {
  try {
    const {
      orderId,
      tableId,
      paymentMethod,
      discount = 0,
      staffId,
      notes = "",
    } = req.body;

    console.log("Payment process request:", {
      orderId,
      tableId,
      paymentMethod,
      discount,
      staffId,
    });


    // Find the order
    const order = await Order.findById(orderId).populate(
      "tableId",
      "tableNumber"
    );

    if (!order) {
      console.error(`Order not found with ID: ${orderId}`);
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    console.log("Order found for payment:", {
      id: order._id,
      orderNumber: order.orderNumber,
      tableId: order.tableId,
      status: order.status,
    });

    if (order.status === "paid") {
      return res.status(400).json({
        success: false,
        error: "Order is already paid",
      });
    }

    // Calculate payment details
    const itemsCount = order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const subtotal = order.total;
    const totalAmount = subtotal - discount; // No tax

    // Validate discount
    if (discount < 0 || discount > subtotal) {
      return res.status(400).json({
        success: false,
        error: "Invalid discount amount",
      });
    }

    // Create payment record
    const payment = new Payment({
      orderId: order._id,
      tableId: tableId,
      orderNumber: order.orderNumber || Math.floor(Math.random() * 10000), // Fallback if orderNumber is missing
      tableNumber: order.tableId?.tableNumber || 0,
      itemsCount: itemsCount,
      subtotal: subtotal,
      discount: discount,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      paymentStatus: "completed",
      staffId: req.user._id, // Use authenticated user's ID
      notes: notes,
    });

    console.log("Created payment record:", {
      orderId: payment.orderId,
      tableId: payment.tableId,
      totalAmount: payment.totalAmount,
    });

    const savedPayment = await payment.save();

    // Update order status to paid
    order.status = "paid";
    await order.save();
    console.log("Order status updated to paid");

    // Update table status to available if the table still exists
    let updatedTable = null;
    if (tableId) {
      updatedTable = await Table.findByIdAndUpdate(
        tableId,
        { status: "available" },
        { new: true }
      );
      console.log("Table status updated:", updatedTable);
    }

    res.json({
      success: true,
      payment: savedPayment,
      table: updatedTable,
      message: `Payment of €${totalAmount} processed successfully for Table ${
        order.tableId?.tableNumber || "unknown"
      }`,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      error: "Failed to process payment: " + (error.message || "Unknown error"),
    });
  }
});

// GET /api/payments/table/:tableId - Get payment history for a table (authenticated staff)
router.get("/table/:tableId", authenticate, async (req, res) => {
  try {
    const { tableId } = req.params;

    const payments = await Payment.find({ tableId: tableId })
      .populate("orderId", "orderNumber items")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments: payments,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payment history",
    });
  }
});

// GET /api/payments/daily - Get daily payment summary (authenticated staff)
router.get("/daily", authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const payments = await Payment.find({
      paymentStatus: "completed",
      paidAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    const totalRevenue = payments.reduce(
      (sum, payment) => sum + payment.totalAmount,
      0
    );
    const totalOrders = payments.length;
    const totalItems = payments.reduce(
      (sum, payment) => sum + payment.itemsCount,
      0
    );

    const paymentMethods = payments.reduce((acc, payment) => {
      acc[payment.paymentMethod] =
        (acc[payment.paymentMethod] || 0) + payment.totalAmount;
      return acc;
    }, {});

    res.json({
      success: true,
      summary: {
        date: today.toDateString(),
        totalRevenue: totalRevenue,
        totalOrders: totalOrders,
        totalItems: totalItems,
        paymentMethods: paymentMethods,
        payments: payments,
      },
    });
  } catch (error) {
    console.error("Error fetching daily summary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch daily summary",
    });
  }
});

// GET /api/payments/pending-bills - Get all pending bills at once (authenticated staff)
router.get("/pending-bills", authenticate, async (req, res) => {
  try {
    // Find all pending orders
    const pendingOrders = await Order.find({
      status: "pending",
    }).populate("tableId", "tableNumber");

    if (!pendingOrders || pendingOrders.length === 0) {
      return res.json({
        success: true,
        bills: [],
      });
    }

    // Convert orders to bills
    const bills = pendingOrders.map((order) => {
      const itemsCount = (order.items || []).reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );

      return {
        orderId: order._id,
        orderNumber: order.orderNumber,
        tableId: order.tableId ? order.tableId._id : null,
        tableNumber: order.tableId ? order.tableId.tableNumber : "Unknown",
        items: order.items || [],
        itemsCount: itemsCount,
        subtotal: order.total,
        totalAmount: order.total,
        createdAt: order.createdAt,
      };
    });

    res.json({
      success: true,
      bills: bills,
    });
  } catch (error) {
    console.error("Error fetching pending bills:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch pending bills",
    });
  }
});

module.exports = router;
