/* General/Home route*/
require("dotenv").config();
const express = require("express");
const router = express.Router();
const { isAdmin, authorize, isActive } = require("../middleware/auth");

const { getProductById, getAllProducts } = require("../services/product");

//To get a specific product
router.get("/product/:id", isActive, async (req, res) => {
  const { id } = req.params;
  const product = await getProductById(id);
  console.log("The specific product", product);
  if (product[0] !== false) {
    res.json({ product: product[1] });
  } else {
    return res.status(400).json({
      error: "Product does not exist",
      actualError: product[1],
      status: "NOT OK",
    });
  }
});

//To get all products
router.get("/products", isActive, async (req, res) => {
  try {
    const products = await getAllProducts();
    console.log("All Products", products);
    res.json({ products });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
      actualError: error,
      status: "NOT OK",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logout Successful" });
});

module.exports = router;
