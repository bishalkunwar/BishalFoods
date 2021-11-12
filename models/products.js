const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    category: {
        category: mongoose.Schema.Types.ObjectId,
        ref: "categories"
    },
    price: {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("Products", ProductSchema);