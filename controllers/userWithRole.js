require("dotenv").config();
const express = require("express");
const router = express.Router();
const cron = require("node-cron");
// Auth Middleware
const { authorize, isAdmin, isActive } = require("../middleware/auth");
const {
  createUserWithRole,
  getUserById,
  authenticateUserWithRole,
  updateUserPassword,
  getUserByEmail,
  updateUser,
  deleteUser,
  getAllUsers,
  deactivateUser,
} = require("../services/userWithRole");
const { translateError } = require("../services/mongo_helper");
const {
  userWithRoleSignupValidator,
  validate,
  loginValidator,
  updateUserValidator,
  updatePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../services/validation");
const Product = require("../models/product");
const NotificationSchema = require("../models/NotificationSchema");
const UserWithRole = require("../models/userWithRole");
const Sale = require("../models/sale");
const Purchase = require("../models/Purchase");

// To get an Admin specific details
router.get("/user/:id", isAdmin, isActive, async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const user = await getUserById(id);
  console.log("The User ", user);
  if (user[0] === true) {
    res.json({ user: user[1] });
  } else {
    return res.status(400).json({
      error: "User does not exist",
      actualError: user[1],
      status: "NOT OK",
    });
  }
});

//Delete User
router.delete("/user/:id", isAdmin, isActive, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await deleteUser(id);
    return res
      .status(200)
      .json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

//Get All Users
router.get("/users", isAdmin, isActive, async (req, res) => {
  try {
    const users = await getAllUsers();
    return res
      .status(200)
      .json({ message: "Users retrieved successfully", users });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

//An admin (The Default Admin) must be logged in before any new admin can be created.
router.post(
  "/signup",
  isAdmin,
  isActive,
  userWithRoleSignupValidator(),
  validate,
  async (req, res) => {
    console.log("signing up");
    try {
      console.log("Signup User");
      console.log("The req body ", req.body);

      const { firstname, lastname, username, email, password, role } = req.body;

      let check = await createUserWithRole({
        firstname,
        lastname,
        username,
        email,
        password,
        role,
      });
      console.log(`${role} creation `, check);
      if (check[0] !== false) {
        let admin = check[1];
        console.log(`The ${role} `, admin);
        res.json({ message: `New ${role} Signup successful `, status: "OK" });
      } else {
        return res.status(400).json({
          error: "Something went wrong.",
          actualError: check[1],
          status: "NOT OK",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        error: "Something went wrong",
        actualError: translateError(error),
        status: "NOT OK",
      });
    }
  }
);

router.post("/login", loginValidator, async (req, res) => {
  try {
    const { email, password } = req.body;
    let userExists = await authenticateUserWithRole(email, password);
    console.log("The User Exists ", userExists);

    if (userExists[0] == true) {
      userExists = userExists[1];

      //Create token
      const token = userExists.token;
      //Save token in a cookie and send back to the frontend
      res.cookie("authToken", token, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, //Cookie expires after 24hours of being logged in.. 1000 milliseconds * 60seconds * 60minutes *24 hours
        httpOnly: true,
      });

      const { _id, firstname, lastname, username, email, role } = userExists;

      let user = { _id, firstname, lastname, username, email, role };

      console.log("The logged in user ", user);
      res
        .status(200)
        .json({ message: "User Login successful", status: "OK", user });
    } else {
      return res.status(400).json({
        error: "Something went wrong",
        actualError: userExists[1],
        status: "NOT OK",
      });
    }
  } catch (error) {
    //Catch block isn't needed as the Else block would handle the error if it isn't already handled by our middlewares
    console.log(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
});

// Edit Admin Details
router.put(
  "/editProfile/:id",
  isAdmin,
  isActive,
  updateUserValidator(),
  validate,
  async (req, res) => {
    try {
      console.log("req body ", req.body);
      const { id } = req.params;
      let { firstname, lastname, username, email, role } = req.body;

      let check = await updateUser(id, {
        firstname,
        lastname,
        username,
        email,
        role,
      });
      console.log("User update ", check);
      if (check[0] !== false) {
        let admin = check[1];
        admin.password = undefined;
        admin.token = undefined;
        admin.createdAt = undefined;
        admin.updatedAt = undefined;
        admin.__v = undefined;

        console.log("User to be sent ", admin);
        return res.json({
          message: "User details updated successfully ",
          status: "OK",
          admin,
        });
      } else {
        return res
          .status(400)
          .json({ error: check[2], actualError: check[1], status: "NOT OK" });
      }
    } catch (error) {
      console.log("Error ", error);
      return res.status(400).json({
        error: "Something went wrong",
        actualError: translateError(error),
        status: "NOT OK",
      });
    }
  }
);
// deactivate User
router.put("/deactivate/:id", isAdmin, isActive, async (req, res) => {
  try {
    console.log("req body ", req.body);
    const { id } = req.params;

    let check = await deactivateUser(id, {
      status: "Inactive",
    });
    console.log("User update ", check);
    if (check[0] !== false) {
      let admin = check[1];
      admin.password = undefined;
      admin.token = undefined;
      admin.createdAt = undefined;
      admin.updatedAt = undefined;
      admin.__v = undefined;

      console.log("User to be deactivated ", admin);
      return res.json({
        message: "User deactivated successfully ",
        status: "OK",
        admin,
      });
    } else {
      return res
        .status(400)
        .json({ error: check[2], actualError: check[1], status: "NOT OK" });
    }
  } catch (error) {
    console.log("Error ", error);
    return res.status(400).json({
      error: "Something went wrong",
      actualError: translateError(error),
      status: "NOT OK",
    });
  }
});

router.put(
  "/editProfile/password/:id",
  isAdmin,
  isActive,
  updatePasswordValidator(),
  validate,
  async (req, res) => {
    let { id } = req.params;
    console.log(req.body);

    const { confirmNewPassword } = req.body;

    const tryUpdate = await updateUserPassword(id, confirmNewPassword);
    console.log("Edit User password  ", tryUpdate);
    if (tryUpdate[0] !== false) {
      res.json({ message: "Password updated successfully", status: "OK" });
    } else {
      return res.status(400).json({
        error: tryUpdate[2],
        actualError: tryUpdate[1],
        status: "NOT OK",
      });
    }
  }
);

router.post(
  "/forgotPassword",
  isActive,
  forgotPasswordValidator,
  async (req, res) => {
    console.log(req.body);

    const { email } = req.body;

    const check = await getUserByEmail(email);
    console.log("check ", check);

    if (check[0] === true) {
      const { firstname, _id } = check[1];
      let userId = _id;
      console.log(`{${email} \n${firstname} \n${userId}}`);
      const sendMail = await sendResetPwdMail(email, firstname, userId);
      if (sendMail[0] !== false) {
        res.json({
          message: "A reset password link has been sent to your email",
          status: "OK",
        });
      } else {
        return res.json({
          error: "Something went wrong",
          actualError: "Failed to send reset password link to user's email",
          status: "NOT OK",
        });
      }
    } else {
      return res.status(400).json({
        error: "Something went wrong",
        actualError: check[1],
        status: "NOT OK",
      });
    }
  }
);

// Mock Get request just to test reset password mailing
router.get("/resetPassword/:id", isActive, async (req, res) => {
  let { id } = req.params;

  const admin = await getUserById(id);

  if (admin[0] === true) {
    res.json({
      message:
        "Admin reset password route. To reset password make a PUT request",
      admin,
      status: "OK",
    });
  } else {
    return res
      .status(400)
      .json({ error: "Admin doesn't exist", status: "NOT OK" });
  }
});

//Logout
router.get("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logout Successful" });
});

router.put(
  "/resetPassword/:id",
  isActive,
  resetPasswordValidator(),
  validate,
  async (req, res) => {
    let { id } = req.params;
    console.log("From Reset password ", req.body);

    const { confirmNewPassword } = req.body;

    const tryUpdate = await updateUserPassword(id, confirmNewPassword);
    console.log("Reset user password ", tryUpdate);

    if (tryUpdate[0] === true) {
      res.json({ message: "Password reset successfully", status: "Reset OK" });
    } else {
      return res.status(400).json({
        error: tryUpdate[2],
        actualError: tryUpdate[1],
        status: "NOT OK",
      });
    }
  }
);

//checkstock
router.get("/check-quantity", async (req, res) => {
  const products = await Product.find(); // find all products
  for (let i = 0; i < products.length; i++) {
    if (products[i].unit < 50) {
      // create new notification
      const notification = new NotificationSchema({
        message: `Product ${products[i].name} has low quantity`,
      });
      await notification.save(); // save the notification
    }
  }
  res.send("Checked product quantity");
});

cron.schedule("0 0 * * *", async () => {
  // this runs every day
  const products = await Product.find();
  for (let i = 0; i < products.length; i++) {
    console.log(products[i].unit);
    if (products[i].unit < 50) {
      const notification = new NotificationSchema({
        message: `Product ${products[i].name} has low quantity`,
      });
      await notification.save();
    }
  }
});
router.get("/notifications", isAdmin, isActive, async (req, res) => {
  const notifications = await NotificationSchema.find().sort({ date: -1 });
  res.json(notifications);
});

router.get("/topusers", isAdmin, isActive, async (req, res) => {
  try {
    const sales = await Sale.aggregate([
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $project: {
          _id: 0,
          user: "$_id",
          count: 1,
        },
      },
      {
        $limit: 4,
      },
    ]);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/purchase", isAdmin, isActive, async (req, res) => {
  try {
    const { vendorName, products } = req.body;

    let purchaseTotal = 0;
    let purchaseProducts = [];

    // Iterate through the products and validate them
    for (let i = 0; i < products.length; i++) {
      console.log(products[i].productId);
      const product = await Product.findById(products[i].productId);
      if (!product) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      // Get the quantity and price from the products[i] object
      const { quantity, price } = products[i];

      // Calculate purchase total and create product for purchase
      purchaseTotal += price;
      purchaseProducts.push({
        product: product._id,
        quantity: quantity,
        price: price,
      });
      console.log(purchaseProducts);
      // Update product stock
      // product.quantity -= quantity;
      // await product.save();
    }

    // Create new purchase
    const purchase = new Purchase({
      vendorName,
      products: products.map(({ productId, quantity, price }) => ({
        productId,
        quantity,
        price,
      })),
      total: purchaseTotal,
    });
    await purchase.save();

    res.json(purchase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/purchases", isAdmin, isActive, async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put("/purchase/:id/deliver", isAdmin, isActive, async (req, res) => {
  try {
    // Find the purchase by ID
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Update the purchase status to "Delivered"
    purchase.status = "Delivered";
    await purchase.save();

    // Iterate through the products and update the quantity
    for (let i = 0; i < purchase.products.length; i++) {
      const product = await Product.findById(purchase.products[i].productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Update the product quantity
      product.unit += purchase.products[i].quantity;
      await product.save();
    }

    res.json({ message: "Purchase delivered and product quantities updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Delete purchase
router.delete("/purchase/:id", isAdmin, isActive, async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    await purchase.remove();
    res.json({ message: "Purchase deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/purchase/:id", isAdmin, isActive, async (req, res) => {
  try {
    // Get the purchase id from the url parameters
    const purchaseId = req.params.id;

    // Find the purchase by id
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.json(purchase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
//vendor,product,amount,quantity,status
