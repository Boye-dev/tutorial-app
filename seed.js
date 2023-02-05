//SEED FILE TO CREATE DEFAULT ADMIN USER
require("dotenv").config(); //Comment this out if it doesn't work for you cos of missing env file.
const {
  createUserWithRole,
  getAdminByEmail,
} = require("./services/userWithRole");
const { MONGODB_URI } = process.env;
// Mongoose
const mongoose = require("mongoose");
// mongoose.set("bufferCommands", true);  // - So our code can run after initialization.. Instead of setting it to false we set it to true. But by default it is true.

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) console.log("Error connecting to database: ", err);
    else {
      console.log(`Successfully connected to MongoDB @ ${MONGODB_URI}`);
    }
  }
);

const main = async () => {
  try {
    let defaultAdmin = {
      firstname: "Default",
      lastname: "Admin",
      username: "Default Admin",
      email: "juicejolly@gmail.com",
      password: "Password@123",
      role: "Admin",
    };
    // let defaultAdmin = {
    //   firstname: process.env.defaultAdminFirstname,
    //   lastname: process.env.defaultAdminLastname,
    //   username: process.env.defaultAdminUsername,
    //   email: process.env.defaultAdminEmail,
    //   password: process.env.defaultAdminPassword,
    // };

    // getAdminByEmail
    let dAdmin = await createUserWithRole(defaultAdmin);
    console.log("Default Admin Created successfully. ", dAdmin);
    console.log(
      "Default Admin successfully created. Run 'npm run dev' or 'npm start' or 'npm run start' to run the main application server"
    );
    process.exit(1);
    // let defaultAdminExists = await getAdminByEmail(defaultAdmin.email);
    // if (defaultAdminExists[0] !== false) {
    //   console.log("Default Admin Already Exists", defaultAdminExists[0]);
    //   console.log(
    //     "Run 'npm run dev' or 'npm start' or 'npm run start' to run the main application server"
    //   );
    //   console.error("Connection Closed");
    //   //Close the connection
    //   process.exit(1);
    // } else {
    //   let dAdmin = await createUserWithRole(defaultAdmin);
    //   console.log("Default Admin Created successfully. ", dAdmin);
    //   console.log(
    //     "Default Admin successfully created. Run 'npm run dev' or 'npm start' or 'npm run start' to run the main application server"
    //   );
    //   process.exit(1);
    // }
  } catch (error) {
    console.log("ERROR FROM SEEDING ", error);
  }
};

main();
