const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String
});

const manufacturerSchema = new mongoose.Schema({
    name: String,
    country: String,
    website: String,
    description: String,
    address: String,
    contact: contactSchema
});

const productSchema = new mongoose.Schema({
    name: String,
    sku: String,
    description: String,
    price: Number,
    category: String,
    manufacturer: manufacturerSchema,
    amountInStock: Number
});




const Product = mongoose.model('Product', productSchema);

module.exports = Product;