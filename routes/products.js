const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

//GET /api/products - Retrieve a list of all products, 
//including their manufacturer and contact

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//GET /api/products/:id - Retrieve details of a single product 
//by ID, including its manufacturer and contact

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found'});
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//POST /api/products - Create a new product.

router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message }); 
    }
});

//PUT /api/products/:id - Update a product by ID.

router.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true});
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//DELETE /api/products/:id - Delete a product by ID.

router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found'});
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Summarize the total value of all products in stock
//GET /api/products/total-stock-value


//Summarize the total value of products in stock per manufacturer
//GET /api/products/total-stock-value-by-manufacturer


//Retrieve a list of all products with less than 10 units in stock
//GET /api/products/low-stock

//Retrieve a compact list of products with less than 5 items in stock (including only the manufacturer's and the contact's name, phone and email)
//GET /api/products/critical-stock

//Retrieve a list of all manufacturers the company does business with
//GET /api/manufacturers

module.exports = router