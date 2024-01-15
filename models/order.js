const mongoose = require("mongoose")

// All possible values for order status
const orderStatus = [
  "outstanding",
  "in progress",
  "fulfilled",
  "picked-up",
  "cancelled"
]

// Define the schema for order item data
const orderItemSchema = new mongoose.Schema({
  snackId: {type: mongoose.Schema.Types.ObjectId, ref: "Snack", required:true},
  quantity: {type: Number, required: true},
})

// Define the schema for order data
const orderSchema = new mongoose.Schema({
    orderStatus: { type: String, required: true, enum: orderStatus,
      default: "outstanding"},
    // An order will support multiple items of different quantities
    items: [orderItemSchema],
    customerId: { type: mongoose.Schema.Types.ObjectId, ref:"Customer", required: true },
    vendorId: {type: mongoose.Schema.Types.ObjectId, ref:"Vendor", required: true },
  },
  {timestamps: true}
)

const OrderItem = mongoose.model("OrderItem", orderItemSchema)
const Order = mongoose.model("Order", orderSchema)

module.exports = OrderItem, Order
