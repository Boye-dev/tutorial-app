require("dotenv").config();
const Product = require("../models/product");
const { translateError } = require("./mongo_helper");
const { deleteFromCloudinary } = require("./upload");

/* Create new Product */
const createProduct = async (
  {
    name,
    price,
    unit,
    category,
    description,
    mainImage,
    mainImagePublicCloudinaryId,
  },
  user
) => {
  try {
    console.log(user);
    let newProduct = new Product({
      name,
      description,
      price,
      unit,
      category,
      mainImage,
      mainImagePublicCloudinaryId,
      createdBy: user[1],
      updatedBy: user[1],
    });

    console.log("The New Product", newProduct);

    if (await newProduct.save()) {
      return [true, newProduct];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

/* Return product with specified id */
const getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    if (product !== null) {
      return [true, product];
    } else {
      return [
        false,
        "Product doesn't exist. It is null and/or has been deleted.",
      ];
    }
  } catch (error) {
    console.log(translateError(error));
    return [false, translateError(error)];
  }
};

/* Return all Products */
const getAllProducts = async () => {
  try {
    const products = await Product.find({}).sort({ _id: -1 }); //Return all products in descending order (Most recent)
    return products;
  } catch (error) {
    console.log(error);
    return translateError(error);
  }
};

/* Return Products By Category*/
const findProductsByCategory = async (category) => {
  const products = await Product.find({ category });

  if (products) {
    return [true, products];
  } else {
    return [false, "Product with that category doesn't exist"];
  }
};

/* Update/Edit Product */
const updateProduct = async (id, fields, user) => {
  fields = { ...fields, updatedBy: user[1] };
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: fields },
      {
        new: true,
      }
    );
    if (updatedProduct !== null) {
      return [true, updatedProduct];
    } else {
      return [
        false,
        "Product doesn't exist. It is null and/or has been deleted.",
        "Something went wrong.",
      ];
    }
  } catch (error) {
    return [false, translateError(error), "Something went wrong."];
  }
};

/* Delete Product */
const deleteProduct = async (id) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (deletedProduct) {
      return [true, deletedProduct];
    } else {
      return [
        false,
        "Product doesn't exist. It is null and/or has been deleted.",
      ];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

//Get recorder History Test
const getRecordHistory = async (req, res, next) => {
  try {
    const { duration } = req.params;

    let filter = {};
    switch (duration) {
      case "daily":
        filter = {
          $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
        };
        break;
      case "weekly":
        filter = {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        };
        break;
      case "monthly":
        filter = {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        };
        break;
      case "yearly":
        filter = {
          $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        };
        break;
    }
    const records = await Product.find({ createdAt: filter });
    res.status(200).json({
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error occured while fetching record history",
    });
  }
};

//Fuzzy Searching
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const searchProductByNameOrCategory = async (searchedItem) => {
  try {
    const regex = new RegExp(escapeRegex(searchedItem), "gi");
    return await Product.find({
      $or: [{ name: regex }, { category: regex }],
    });
  } catch (error) {
    console.log(error);
  }
};

const lowStock = async () => {
  try {
    return Product.aggregate([
      {
        $match: {
          quantity: {
            $lt: 5, //Return all products with quantities less than 5
          },
        },
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  getRecordHistory,
  deleteProduct,
  findProductsByCategory,
  // inputSale,
  searchProductByNameOrCategory,
  lowStock,
};
