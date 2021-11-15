const mongoose = require("mongoose");

const foodSchema = mongoose.Schema({

    foodName: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: `Category` },
    price: { type: Number, required: true },
    foodImage: { type: String, required: true },
});

module.exports = mongoose.model("Food", foodSchema);