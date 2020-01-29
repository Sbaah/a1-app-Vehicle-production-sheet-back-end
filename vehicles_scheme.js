//  Sefa Baah - Acheamphour student#: 015381130
// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Entity Schema

var vehicles = new Schema({
    car_Make: String,
    car_Model: String,
    car_Year: Number,
    car_Vin: String,
    car_Msrp: Number,
    car_Photo: String,
    purchase_Date: "",
    purchasers_Name: "",
    purchasers_Email: "",
    price_Paid: ""
});
module.exports = vehicles;