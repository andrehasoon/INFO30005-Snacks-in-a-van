const mongoose = require("mongoose")

// Define the schema for snack data
// While the list of snacks is static, this schema is used in orderItems schema
const snackSchema = new mongoose.Schema({
  name: {type: String, required: true},
  price: {type: Number, required: true},
  imageId: {type: Number, required: true},
  description: {type: String, required: true},
  calories: {type: Number, required: true},
  fat: {type: Number, required: true},
  protein: {type: Number, required: true}
})

const Snack = mongoose.model("Snack", snackSchema)

module.exports = Snack
