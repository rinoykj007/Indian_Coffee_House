const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true,
    sparse: true, // Allow creation without initial value, pre-save hook will set it
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true,
  },
  orderNumber: {
    type: String, // Changed from Number to String to match the format "20250828-003"
    required: true,
  },
  tableNumber: {
    type: Number,
    required: true,
  },
  itemsCount: {
    type: Number,
    required: true,
    min: 1,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "upi", "online"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  paidAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  notes: {
    type: String,
    default: "",
  },
});

// Generate unique payment ID before saving
paymentSchema.pre("save", async function (next) {
  try {
    if (this.isNew && !this.paymentId) {
      // Generate payment ID: PAY-YYYYMMDD-XXXX
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

      // Find the last payment for today
      const lastPayment = await this.constructor.findOne(
        { paymentId: { $regex: `^PAY-${dateStr}-` } },
        {},
        { sort: { createdAt: -1 } }
      );

      let sequence = 1;
      if (lastPayment && lastPayment.paymentId) {
        const parts = lastPayment.paymentId.split("-");
        if (parts.length === 3) {
          const lastSequence = parseInt(parts[2]);
          if (!isNaN(lastSequence)) {
            sequence = lastSequence + 1;
          }
        }
      }

      this.paymentId = `PAY-${dateStr}-${sequence.toString().padStart(4, "0")}`;
      console.log("Generated payment ID:", this.paymentId);
    }

    // Update paidAt timestamp when payment is completed
    if (this.paymentStatus === "completed" && !this.paidAt) {
      this.paidAt = new Date();
    }

    next();
  } catch (error) {
    console.error("Error in payment pre-save hook:", error);
    // Don't fail the save, just generate a simple ID
    if (this.isNew && !this.paymentId) {
      this.paymentId = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    next();
  }
});

// Update paidAt when payment status changes to completed
paymentSchema.pre("save", function (next) {
  if (
    this.isModified("paymentStatus") &&
    this.paymentStatus === "completed" &&
    !this.paidAt
  ) {
    this.paidAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
