// const cartRepository = require('./repository')
// const productRepository = require('../Product/repository');


const Cart = require("../models/cart");
const Food = require("../models/foods");
const mongoose = require("mongoose");

const addCart = async(req, res) => {

    const foodId = req.params.foodId;
    const quantity = Number.parseInt(req.body.quantity);

    try {
        const cart = await Cart.find({}).populate({ path: "items.foodId", select: "foodName categoryId price foodImage " });
        const foodDetails = await Food.findById(foodId)
        if (!foodDetails) {
            return res.status(500).json({
                type: "Not Found",
                msg: "Invalid request at first"
            })
        }
        //--If Cart Exists ----
        if (cart) {
            //---- check if index exists ----
            const indexFound = cart.items.findIndex(item => item.foodId.id == foodId);
            //------this removes an item from the the cart if the quantity is set to zero,We can use this method to remove an item from the list  -------
            if (indexFound !== -1 && quantity <= 0) {
                cart.items.splice(indexFound, 1);
                if (cart.items.length == 0) {
                    cart.subTotal = 0;
                } else {
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                }
            }
            //----------check if product exist,just add the previous quantity with the new quantity and update the total price-------
            else if (indexFound !== -1) {
                cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
                cart.items[indexFound].total = cart.items[indexFound].quantity * foodDetails.price;
                cart.items[indexFound].price = foodDetails.price
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            //----Check if Quantity is Greater than 0 then add item to items Array ----
            else if (quantity > 0) {
                cart.items.push({
                    foodId: foodId,
                    quantity: quantity,
                    price: foodDetails.price,
                    total: parseInt(foodDetails.price * quantity)
                })
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            //----if quantity of price is 0 throw the error -------
            else {
                return res.status(400).json({
                    type: "Invalid",
                    msg: "Invalid request at 2"
                })
            }
            const data = await cart.save();
            res.status(200).json({
                type: "success",
                mgs: "Process Successful",
                data: data
            })
        }

        //------------ if there is no user with a cart...it creates a new cart and then adds the item to the cart that has been created------------
        else {
            const cartData = {
                    items: [{
                        foodId: foodId,
                        quantity: quantity,
                        total: parseInt(foodDetails.price * quantity),
                        price: foodDetails.price
                    }],
                    subTotal: parseInt(foodDetails.price * quantity)
                }
                // cart = await cartRepository.addItem(cartData)
            const data = await cart.save(cartData);
            res.json(data);
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
            err: err
        })
    }
};


const getCart = async(req, res) => {
    try {
        const cart = await Cart.find({}).populate({ path: "items.foodId", select: "foodName categoryId price foodImage " });
        if (!cart) {
            return res.status(400).json({
                type: "Invalid",
                msg: "Cart Not Found",
            })
        }
        res.status(200).json({
            status: true,
            data: cart
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
            err: err
        })
    }
};


const emptyCart = async(req, res) => {
    try {
        const cart = await Cart.find({}).populate({ path: "items.foodId", select: "foodName categoryId price foodImage " });
        cart.items = [];
        cart.subTotal = 0
        let data = await cart.save();
        res.status(200).json({
            type: "success",
            mgs: "Cart Has been emptied",
            data: data
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            type: "Invalid",
            msg: "Something Went Wrong",
            err: err
        })
    }
};


module.exports = {
    addCart,
    getCart,
    emptyCart,

};