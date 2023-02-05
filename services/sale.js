require("dotenv").config();
const Sale = require("../models/sale");
const { translateError } = require("./mongo_helper");

/* Return sale with specified id */
const getSaleById = async (id) => {
  try {
    const user = await Sale.findById(id);
    if (user !== null) {
      return [true, user];
    } else {
      return [false, "Sale doesn't exist. It is null and/or has been deleted."];
    }
  } catch (error) {
    console.log(translateError(error));
    return [false, translateError(error)];
  }
};

//Get All Sales
const getAllSales = async () => {
  try {
    const sales = await Sale.find({});
    if (!sales) {
      throw new Error("Sales not found");
    }
    return sales;
  } catch (error) {
    throw error;
  }
};

//Delete sale
const deleteSale = async (id) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(id);
    if (deletedSale) {
      return [true, deletedSale];
    } else {
      return [false, "Sale doesn't exist. It is null and/or has been deleted."];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

/* Get the current url */
//NB: NODE_ENV specifies the environment in which an application is running

module.exports = {
  getSaleById,
  deleteSale,
  getAllSales,
};
