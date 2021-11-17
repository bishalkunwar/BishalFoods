const express = require("express");
const CartController = require("../controllers/cart");
const router = express.Router();

router.post("/", CartController.addCart);
router.get("/", CartController.getCart);
router.delete("/empty-cart", CartController.emptyCart);

module.exports = router;