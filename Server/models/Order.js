const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  specialNotes: {
    type: String,
    default: "",
  },
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String, // Changed from Number to String
    unique: true,
    sparse: true, // Allows null values during creation, but ensures uniqueness
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true,
  },
  items: [orderItemSchema],
  customerCount: {
    type: Number,
    default: 1,
    min: 1,
  },
  specialRequests: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "preparing", "ready", "served", "paid"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual field to calculate total automatically
orderSchema.virtual("total").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
});

// Ensure virtual fields are included in JSON output
orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

// Generate unique order number and update timestamp before saving
orderSchema.pre("save", async function (next) {
  try {
    if (this.isNew && !this.orderNumber) {
      // Generate unique order number for new orders with retry logic
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        try {
          const lastOrder = await this.constructor.findOne(
            { orderNumber: { $exists: true, $ne: null } },
            {},
            { sort: { orderNumber: -1 } }
          );

          const nextOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1001;

          // Check if this order number already exists
          const existingOrder = await this.constructor.findOne({
            orderNumber: nextOrderNumber,
          });

          if (!existingOrder) {
            this.orderNumber = nextOrderNumber;
            console.log("Generated order number:", this.orderNumber);
            break;
          } else {
            // If it exists, try with a random offset
            this.orderNumber =
              nextOrderNumber + Math.floor(Math.random() * 100) + 1;
            const checkAgain = await this.constructor.findOne({
              orderNumber: this.orderNumber,
            });
            if (!checkAgain) {
              console.log(
                "Generated order number with offset:",
                this.orderNumber
              );
              break;
            }
          }

          attempts++;
        } catch (error) {
          console.error(
            `Order number generation attempt ${attempts + 1} failed:`,
            error
          );
          attempts++;
        }
      }

      // Fallback: use timestamp-based number if all attempts fail
      if (!this.orderNumber) {
        this.orderNumber = Date.now() % 100000; // Use last 5 digits of timestamp
        console.log("Fallback order number generated:", this.orderNumber);
      }
    }

    this.updatedAt = new Date();
    next();
  } catch (error) {
    console.error("Error in pre-save hook:", error);
    // Don't fail the save, just use a timestamp-based fallback
    if (this.isNew && !this.orderNumber) {
      this.orderNumber = Date.now() % 100000;
    }
    next();
  }
});

module.exports = mongoose.model("Order", orderSchema);
