const mongoose = require("mongoose")

// Define the schema for customer data
const customerSchema = new mongoose.Schema({
  // email is a natural PK which can possibly be used instead of _id
  email: {type: String, required: true, unique:true},
  password:{type:String, required:true}, 
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  locationLong: {type: Number, required: true},
  locationLat: {type: Number, required: true}
})

const Customer = mongoose.model("Customer", customerSchema)
module.exports = Customer
