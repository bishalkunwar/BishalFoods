const express = require("express");
const Product = require("../../models/products");
const mongoose = require("mongoose");
const uploadMulter = require("../middlewares/multer");
const router = express.Router();


//controller/method to post products at admin dashboard
router.post("/", uploadMulter.single("productImage"), addProduct = async(req, res) => {

    if (!req.body) {
        res.status(400).send({ message: "Field Value can not be emtpy!" });
        return;
    }

    const product = new Product({
        productName: req.body.productName,
        category: req.body.category,
        price: req.body.price,
        productImage: req.file.path,
    });

    try {
        await product.save();
        console.log("saved");
        res.redirect('/products');
    } catch (err) {
        res.send(500).json({ error: err });
    }

});

//controller to get products by Id specific.
router.get("/:producctId", getOneProduct = async(req, res) => { //productId is the value passed from front form.
    const id = req.params.productId;
    try {
        const product = await Product.findById(id);
    } catch (err) {
        res.send(500).json({ error: err });
    }
});

router.get("/", getAllProducts = async(req, res) => {
    try {
        const products = await Product.find({});
        res.render('admin/Education.ejs', { product: products });
    } catch (err) {
        res.send(500).json({ error: err });
    }
});

router.delete("/:productId", deleteProduct = async(req, res) => {
    const id = req.params.productid;
    try {
        await Product.deleteOne({ _id: id });
        res.redirect('/products'); //products.ejs.
    } catch (err) {
        res.send(500).json({ error: err });
    }
});


router.put("/:productId", uploadMulter.single("productImage"), updateProduct = async(req, res, next) => {

    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const id = req.params.productId;
    mongoose.set("useFindAndModify", false);
    Product.findByIdAndUpdate(
        id, {
            productName: req.body.productName,
            category: req.body.category,
            price: req.body.price,
            productImage: req.file.path,
        },

        function(err, education) {
            if (err) {
                res.send(500).json({ error: err });
            } else {
                res.status(200).json({
                    message: "Product updated successfully",
                    Product: product,
                });
            }
        }
    );
});

module.exports = router;