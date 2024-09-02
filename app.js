const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


const app = express();


app.use(express.json());

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
})
.then(() => {
    console.log('Connected to MongoDB database');
  }).catch(err => {
    console.error('Error connecting to MongoDB', err);
  });


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
