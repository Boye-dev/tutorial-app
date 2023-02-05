//Load database configuration file and allow us read environment variables
require("dotenv").config(); //Comment this out if it doesn't work for you cos of missing env file.
const { connectToDB } = require("./config/database");

const express = require("express");
const app = express();
const http = require("http");
const PORT = process.env.PORT || process.env.SERVER_PORT || 4000;
const cookieParser = require("cookie-parser");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

// Cors configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    // "https://pnic.up.railway.app",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
// // To allow CORS
app.use(cors(corsOptions));
// Set app proxy
// app.set("trust proxy", 1);

//To allow json requests and decode requests from forms

// Set app proxy
// app.set("trust proxy", 1);

//To allow json requests and decode requests from forms
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
//To allow Cookies
app.use(cookieParser());

// Api Docs
app.get("/api", (req, res) => {
  fs.readFile(path.join(__dirname, "/api/docs/apiDocs.json"), (err, data) => {
    if (err) {
      res.status(400).json({ error: err });
    }
    const docs = JSON.parse(data); //We have to parse the data because it is a buffer, JSON.parse converts into JSON a readable format.

    res.json(docs);
  });
});

//Routes
// app.use("/api", require("./controllers/auth")); //The Social login (Google Auth)
app.use("/api", require("./controllers/userWithRole")); //Admin route
app.use("/api", require("./controllers/product")); //For Products
app.use("/api", require("./controllers/home"));
app.use("/api", require("./controllers/sale"));
// To show public files/Files from uploads folder  and to upload to cloudinary
app.use("/api/uploads", express.static("api/uploads"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static(path.join(__dirname, "tutor-frontend", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "tutor-frontend", "build", "index.html"));
  });
}

//Invalid Route   //NB: using app.use instead of app.get/post handles all wrong requests and throws the message (For our API in dev/prod)
app.use("*", (req, res) => {
  res.status(404).send({ error: "Route does not exist" });
});

// Logging the rejected field from multer error
app.use((error, req, res, next) => {
  console.log("This is the rejected field ->", error);
  // console.log("This is the rejected field ->", error.field);
  res.status(400).json({ error: "Multer Error. Unexpected field -  ", error });
});

//Server and Database setup
const server = http.createServer(app);
// Only start server after connection to database has been established
connectToDB()
  .then(() => {
    //Starting Server/Listening to server

    server.listen(PORT, () => {
      console.log(`Server listening on PORT ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Database connection failed!");
  });

//If any error in starting server
server.on("error", (err) => {
  console.log(`Error Present: ${err}`);
  process.exit(1);
});

// If any unhandledRejection in our process Event
process.on("unhandledRejection", (error) => {
  console.error("UNHANDLED REJECTION! Shutting down...", error);
  process.exit(1);
});
