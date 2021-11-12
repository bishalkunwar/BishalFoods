const express = require("express");
const Category = require("../../models/categories");
const mongoose = require("mongoose");
const router = express.Router();

//controller/method to post products at admin dashboard
router.post("/", async(req, res) => {

    if (!req.body) {
        res.status(400).send({ message: "Field Value can not be emtpy!" });
        return;
    }

    const category = new Category({
        category: req.body.category,
    });

    try {
        await category.save();
        res.redirect('/admin/category');
    } catch (err) {
        res.send(500).json({ error: err });
    }

});

//controller to get products by Id specific.
router.get("/:categoryId", async(req, res) => {
    const id = req.params.categoryId;
    try {
        const category = await Category.findById(id);
    } catch (err) {
        res.send(500).json({ error: err });
    }
});

router.get("/", getAllCategories = async(req, res) => {
    try {
        const categories = await Category.find({});
        res.render('category.ejs', { category: categories });
    } catch (err) {
        res.send(500).json({ error: err });
    }
});

router.delete("/:categoryId", deleteCategory = async(req, res) => {
    const id = req.params.categoryid;
    try {
        await Category.deleteOne({ _id: id });
        res.redirect('/category'); //category.ejs
    } catch (err) {
        res.send(500).json({ error: err });
    }
});


router.put("/:categoryId", updateCategory = async(req, res, next) => {

    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const id = req.params.categoryId;
    mongoose.set("useFindAndModify", false);
    Category.findByIdAndUpdate(
        id, {
            category: req.body.category,
        },

        function(err, category) {
            if (err) {
                res.send(500).json({ error: err });
            } else {
                res.status(200).json({
                    message: "category updated successfully",
                    category: category,
                });
            }
        }
    );
});

module.exports = router;