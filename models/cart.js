//Cart Schema/Model.

const mongoose = require('mongoose');

let ItemSchema = new mongoose.Schema({

    foodId: { type: mongoose.Schema.Types.ObjectId, ref: `Food` },
    quantity: { type: Number, required: true, min: [1, 'Quantity can not be less then 1.'] },
    price: { type: Number, required: true },
    total: { type: Number, required: true, }
}, {
    timestamps: true
});

const CartSchema = new mongoose.Schema({

    items: [ItemSchema],
    subTotal: { default: 0, type: Number }
}, {
    timestamps: true
});


module.exports = mongoose.model('Cart', CartSchema);