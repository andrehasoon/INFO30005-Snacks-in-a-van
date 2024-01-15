const mongoose = require("mongoose")

// All possible values for status
const vendorStatus = [
  "ready for orders",
  "taking a break",
  "currently unavailable"
]

// Define the schema for vendor data
const vendorSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    vanName: {type: String, required: true,unique:true},
    password:{type:String, required:true}, 
    status: {type: String, required: true, enum: vendorStatus},
    locationDesc: {type: String, required: false},
    locationLong: {type: Number, required: true},
    locationLat: {type: Number, required: true}
})

const Vendor = mongoose.model("Vendor", vendorSchema)

module.exports = Vendor
