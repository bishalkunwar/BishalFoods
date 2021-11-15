const express = require("express");

const CategoryController = require("../controllers/categories");

const router = express.Router();

router.post("/", CategoryController.addCategory); //checkAuth, if jwt implemented. // /educations.
router.get("/:categoryId", CategoryController.getOneCategory);
router.get("/", CategoryController.getAllCategories);
router.delete("/:categoryId", CategoryController.deleteCategory);
router.put("/:categoryId", CategoryController.updateCategory);

module.exports = router;