/* PRODUCT CONTROLLER FILE */
require("dotenv").config();
const express = require("express");
const Sale = require("../models/sale");
const Product = require("../models/product");
const router = express.Router();
// Auth Middleware
const { isAdminOrStockManager, isActive } = require("../middleware/auth");

const { deleteProduct } = require("../services/product");

const { getSaleById, getAllSales, deleteSale } = require("../services/sale");

//get sale by id
router.get("/sale/:id", isAdminOrStockManager, isActive, async (req, res) => {
  const { id } = req.params;
  const sale = await getSaleById(id);
  console.log("The specific sale", sale);
  if (sale[0] !== false) {
    res.json({ sale: sale[1] });
  } else {
    return res.status(400).json({
      error: "Sale does not exist",
      actualError: sale[1],
      status: "NOT OK",
    });
  }
});

//To get all sales
router.get("/sales", isAdminOrStockManager, isActive, async (req, res) => {
  try {
    const sales = await getAllSales();
    console.log("All Sales", sales);
    res.json({ sales });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
      actualError: error,
      status: "NOT OK",
    });
  }
});

/* Delete a Product */
router.delete(
  "/deleteSale/:id",
  isAdminOrStockManager,
  isActive,
  async (req, res) => {
    const { id } = req.params;
    console.log("Delete Sale route");

    const delSale = await deleteSale(id);
    console.log("Deleted Sale ", delSale);

    if (delSale[0] == true) {
      res
        .status(200)
        .json({ message: "Sale deleted successfully.", status: "OK" });
    } else {
      res.status(400).json({
        error: "Something went wrong. ",
        actualError: delSale[1],
        status: "NOT OK",
      });
    }
  }
);

module.exports = router;
