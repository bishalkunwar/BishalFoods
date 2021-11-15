const express = require("express");

const FoodController = require("../controllers/foods");
const uploadMulter = require("../middleware/multer");
const router = express.Router();

router.post(
    "/",
    uploadMulter.single("foodImage"), FoodController.addFood);


router.get("/:foodId", FoodController.getOneFood);
router.get("/", FoodController.getAllFoods);
router.delete("/:foodId", FoodController.deleteFood);
router.put(
    "/:foodId",
    uploadMulter.single("foodImage"),
    FoodController.updateFood);

module.exports = router;