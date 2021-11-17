const Food = require("../models/foods");
const Category = require("../models/categories");
const mongoose = require("mongoose");

const getOneFood = async(req, res, next) => {

    const id = req.params.foodId;
    try {
        const food = await Food.findById(id);
        res.render('foods.ejs', { foods: food });
        //res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

const getAllFoods = async(req, res, next) => {
    try {
        const food = await Food.find({}).populate('categoryId');
        const category = await Category.find({});
        console.log(food);
        res.render('foods.ejs', { foods: food, categories: category });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

const addFood = async(req, res) => {

    if (!req.body) {
        res.status(400).send({ message: "Field Value can not be emtpy!" });
        return;
    }

    const food = new Food({
        foodName: req.body.foodName,
        categoryId: req.body.category,
        price: req.body.price,
        foodImage: req.file.path,
    });

    try {
        await food.save();
        console.log("saved");
        res.redirect('/foods');
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

const deleteFood = async(req, res, next) => {
    const id = req.params.foodId;
    try {
        await Food.deleteOne({ _id: id });
        res.status(200).json({ message: "food deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

const updateFood = async(req, res, next) => {

    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const id = req.params.foodId;
    var foodSearch;
    try {
        foodSearch = await Food.findById(id);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    var filePath;
    if (req.file === undefined) {
        filePath = foodSearch.foodImage;
    } else {
        filePath = req.file.path;
    }

    mongoose.set("useFindAndModify", false);
    Project.findByIdAndUpdate(
        id, {
            foodName: req.body.foodName,
            price: req.body.price,
            foodImage: req.file.path,

        }, { new: true },

    );
};

module.exports = {
    getOneFood,
    getAllFoods,
    addFood,
    deleteFood,
    updateFood,
};