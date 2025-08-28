const express = require("express");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Table = require("../models/Table");
const router = express.Router();

// GET /api/payments/reports/daily - Get daily revenue report for admin dashboard
router.get("/reports/daily", async (req, res) => {
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

// GET /api/payments/table/:tableId/bill - Generate bill for a table
router.get("/table/:tableId/bill", async (req, res) => {
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
      tableId: order.tableId._id,
      tableNumber: order.tableId.tableNumber,
      items: order.items,
      itemsCount: itemsCount,
      subtotal: subtotal,
      totalAmount: totalAmount,
      createdAt: order.createdAt,
    };

    console.log("Bill generated for table:", order.tableId.tableNumber);

    res.json({
      success: true,
      bill: billData,
      message: `Bill generated for Table ${order.tableId.tableNumber}`,
    });
  } catch (error) {
    console.error("Error generating bill:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate bill",
    });
  }
});

// POST /api/payments/process - Process payment for an order
router.post("/process", async (req, res) => {
  try {
    const {
      orderId,
      tableId,
      paymentMethod,
      discount = 0,
      staffId,
      notes = "",
    } = req.body;

    if (!orderId || !tableId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: "Order ID, Table ID, and Payment Method are required",
      });
    }

    // Find the order
    const order = await Order.findById(orderId).populate(
      "tableId",
      "tableNumber"
    );

    if (!order) {
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

    // Create payment record
    const payment = new Payment({
      orderId: order._id,
      tableId: order.tableId._id,
      orderNumber: order.orderNumber || Math.floor(Math.random() * 10000), // Fallback if orderNumber is missing
      tableNumber: order.tableId.tableNumber,
      itemsCount: itemsCount,
      subtotal: subtotal,
      discount: discount,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      paymentStatus: "completed",
      staffId: staffId,
      notes: notes,
    });

    const savedPayment = await payment.save();

    // Update order status to paid
    order.status = "paid";
    await order.save();

    // Update table status to available
    const updatedTable = await Table.findByIdAndUpdate(
      tableId,
      { status: "available" },
      { new: true }
    );
    console.log("Table status updated:", updatedTable);

    res.json({
      success: true,
      payment: savedPayment,
      table: updatedTable, // Add this line
      message: `Payment of ₹${totalAmount} processed successfully for Table ${order.tableId.tableNumber}`,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process payment",
    });
  }
});

// GET /api/payments/table/:tableId - Get payment history for a table
router.get("/table/:tableId", async (req, res) => {
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

// GET /api/payments/daily - Get daily payment summary
router.get("/daily", async (req, res) => {
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

module.exports = router;
