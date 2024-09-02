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
//DELETE /api/products/:id - Delete a product by ID.

module.exports = router