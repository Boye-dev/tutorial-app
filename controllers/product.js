/* PRODUCT CONTROLLER FILE */
require("dotenv").config();
const express = require("express");
const Sale = require("../models/sale");
const Product = require("../models/product");
const router = express.Router();
// Auth Middleware
const {
  isAdmin,
  isAdminOrStockManager,
  isCashier,
  isActive,
} = require("../middleware/auth");
const { translateError } = require("../services/mongo_helper");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getRecordHistory,
  // inputSale,
} = require("../services/product");
const { getUserById } = require("../services/userWithRole");
const {
  upload,
  uploadProductPicToCloudinary,
  updateProductPicture,
} = require("../services/upload");
const {
  validate,
  updateProductValidator,
  createProductValidator,
} = require("../services/validation");
const NotificationSchema = require("../models/NotificationSchema");

/* Create new Product */
//Multer upload method which helps parse our route as a multipart formdata and to upload multiple single images
let uploadProductImagesMiddleware = upload.fields([
  { name: "mainImage", maxCount: 1 },
]);
router.post(
  "/addProduct",
  isAdminOrStockManager,
  isActive,
  uploadProductImagesMiddleware,
  createProductValidator(),
  validate,
  async (req, res) => {
    try {
      console.log("Req Body ", req.body);
      console.log("req files ", req.files);

      let files = req.files;
      console.log("Req Files from create product ", files);

      //Get Current User
      console.log("REq user from products ", req.user);
      const userId = req.user.id;
      let user = await getUserById(userId);
      console.log("USERRR ", user);
      let userFullName = `${user[1].firstname} ${user[1].lastname}`;
      console.log(userFullName);

      let { name, description, price, category, unit } = req.body;

      let productObj = { name, description, price, category, unit };

      // Check if images on the files property are existent
      let mainImage = files.mainImage ? files.mainImage[0].path : undefined;

      console.log(`Main Image Path ${mainImage}`);

      // To use Cloudinary
      let result1 = null;

      mainImage != undefined
        ? (result1 = await uploadProductPicToCloudinary(mainImage))
        : (result1 = undefined);

      console.log(
        "The results from uploading the product images to cloudinary",
        result1
      );

      productObj.mainImage = result1 && result1.url;

      // To save the public Ids of each of the image which we can later use for updating and deleting images from cloudinary
      productObj.mainImagePublicCloudinaryId = result1 && result1.publicId;

      // To use local file path on disk storage
      // productObj.mainImage = mainImage;

      console.log("The Product Object ", productObj);

      const check = await createProduct(productObj, user);
      console.log("The Product from DB", check);

      if (check[0] == true) {
        if (check[1].mainImage != undefined) {
          return res.status(201).json({
            message: "New Product added successfully. All pictures uploaded.",
            status: "OK",
            product: check[1],
          });
        }
      } else {
        return res.status(422).json({
          error: "Something went wrong.",
          actualError: check[1],
          status: "NOT OK",
        });
      }
    } catch (error) {
      //Try-catch isn't needed - Error(s) are handled by validation middleware and by our if else block above.. Catch statement would be useful if there is an exception, but our service methods already handle exceptions.
      console.log(error);
      // return res.status(400).json({error: "Something Went wrong", actualError:translateError(error) });
      return res.status(500).json({
        error: "Something Went wrong",
        actualError: translateError(error),
      });
    }
  }
);

/* Edit a Product */
router.put(
  "/editProduct/:id",
  isAdminOrStockManager,
  isActive,
  uploadProductImagesMiddleware,
  createProductValidator(),
  validate,
  async (req, res) => {
    try {
      //Get Current User
      console.log("REq user from products ", req.user);
      const userId = req.user.id;
      let user = await getUserById(userId);
      console.log("USERRR ", user);
      let userFullName = `${user[1].firstname} ${user[1].lastname}`;
      console.log(userFullName);

      const { id } = req.params;
      let foundProduct = await getProductById(id);

      if (foundProduct[0] !== false) {
        console.log("Req Body from EDIT PRODUCT route ", req.body);
        console.log("req files ", req.files);

        let files = req.files;
        console.log("Req Files from create product ", files);

        let { name, description, price, category, unit } = req.body;

        let productObj = { name, description, price, category, unit };

        // To Update Product's picture ... We first find the products product images public ids if there are any.
        console.log("Found Product -- ", foundProduct[1]);

        let foundProductMainImagePublicId =
          foundProduct[1].mainImagePublicCloudinaryId !== undefined
            ? foundProduct[1].mainImagePublicCloudinaryId
            : "not_found";

        // Check if images on the files property are existent
        let mainImage = files.mainImage ? files.mainImage[0].path : undefined;

        // To use Cloudinary
        let result1 = null;

        mainImage != undefined
          ? (result1 = await updateProductPicture(
              foundProductMainImagePublicId,
              mainImage
            ))
          : (result1 = undefined);

        console.log(
          "The results from updating the product images to cloudinary (Deleting the old images and uploading the new ones)",
          result1
        );

        productObj.mainImage = result1 && result1.url;

        // To save the public Ids of each of the image which we can later use for updating and deleting images from cloudinary
        productObj.mainImagePublicCloudinaryId = result1 && result1.publicId;

        // To use local file path on disk storage
        // productObj.mainImage = mainImage;
        // productObj.otherImg1 = otherImg1;
        // productObj.otherImg2 = otherImg2;
        // productObj.otherImg3 = otherImg3;

        console.log("The Product Object ", productObj);

        const check = await updateProduct(id, productObj, user);
        //NB: We wont have any issue even if we have no pictures because the pictures used would still be the ones created Initially.
        console.log("The Updated Product from DB", check);
        if (check[0] !== false) {
          let updatedProduct = check[1];
          res.status(201).json({
            message: "Product updated successfully.",
            status: "OK",
            product: updatedProduct,
          });
        } else {
          return res
            .status(400)
            .json({ error: check[2], actualError: check[1], status: "NOT OK" });
        }
      } else {
        return res.status(422).json({
          error: "Something went wrong.",
          actualError: foundProduct[1],
          status: "NOT OK",
        });
      }
    } catch (error) {
      console.log(error);
      // return res.status(400).json({error: "Something Went wrong", actualError:translateError(error), status: "NOT OK" });
      return res.status(500).json({
        error: "Something Went wrong",
        actualError: translateError(error),
        status: "NOT OK",
      });
    }
  }
);

/* Delete a Product */
router.delete(
  "/deleteProduct/:id",
  isAdminOrStockManager,
  isActive,
  async (req, res) => {
    const { id } = req.params;
    console.log("Delete Product route");

    const delProduct = await deleteProduct(id);
    console.log("Deleted Product ", delProduct);

    if (delProduct[0] == true) {
      res
        .status(200)
        .json({ message: "Product deleted successfully.", status: "OK" });
    } else {
      res.status(400).json({
        error: "Something went wrong. ",
        actualError: delProduct[1],
        status: "NOT OK",
      });
    }
  }
);

router.get("/product/history/:duration", isActive, getRecordHistory);
router.get("/related-analysis", isAdmin, isActive, async (req, res) => {
  try {
    // Find all products in the database
    const products = await Product.find();

    // Create a map to store the analysis data
    const analysis = new Map();

    // Iterate through the products and group them by category
    products.forEach((product) => {
      if (analysis.has(product.category)) {
        analysis.get(product.category).push(product);
      } else {
        analysis.set(product.category, [product]);
      }
    });

    // Find all sale records in the database
    const sales = await Sale.aggregate([
      {
        $group: {
          _id: "$product",
          quantitySold: { $sum: "$quantitySold" },
        },
      },
    ]);

    // Create an object to store the total sale of each product
    const productSales = {};

    // Iterate through the sales and add the quantity sold to the productSales object
    sales.forEach((sale) => {
      productSales[sale._id] = sale.quantitySold;
    });
    // iterate through the analysis and add the total sale for each product
    for (let [category, products] of analysis) {
      console.log(products, "jh");
      for (let i = 0; i < products.length; i++) {
        products[i].sales = productSales[products[i]._id] || 0;
      }
    }

    // Return the analysis data to the client
    res.json({
      success: true,
      data: Array.from(analysis),
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

router.post("/input-sale/:productId", isCashier, isActive, async (req, res) => {
  try {
    //Get Current User
    console.log("REq user from products ", req.user);
    const userId = req.user.id;
    let user = await getUserById(userId);
    console.log("USERRR ", user);
    let userFullName = `${user[1].firstname} ${user[1].lastname}`;
    console.log(userFullName);

    const { productId } = req.params;

    const { quantitySold } = req.body;

    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    if (product[1].unit < Number(quantitySold)) {
      return res.status(400).json({
        error: "Not enough stock",
      });
    }

    const total = Number(quantitySold) * product[1].price;
    // Update product stock
    product[1].sales += Number(quantitySold);
    product[1].unit -= Number(quantitySold);

    if (product[1].unit < 50) {
      const notification = new NotificationSchema({
        message: `Product ${product[1].name} has low quantity`,
      });
      await notification.save();
    }
    await product[1].save();

    console.log(product[1]);
    // Create sale
    const sale = new Sale({
      product: product[1],
      quantitySold,
      total,
      user: user[1],
    });
    await sale.save();

    res.status(201).json({
      message: "Sale input successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error occured while inputting sale",
    });
  }
});

module.exports = router;
