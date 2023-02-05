// require("dotenv").config();
// const express = require("express");
// const router = express.Router();

// // OAuth2Client Google Authentication
// const { OAuth2Client } = require("google-auth-library");
// const { createUser, getUserByEmail, updateUserById } = require("../services/user");
// const { translateError } = require("../services/mongo_helper");

// const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

// console.log("Google client id from node server ", process.env.REACT_APP_GOOGLE_CLIENT_ID);
// // console.log("The Client ", client);

// router.post("/google-login", async (req, res) => {

// try {

//     console.log("The req body for google login", req.body);

//     // const { token, googleId } = req.body;
//     const { credential } = req.body;
//     const ticket = await client.verifyIdToken({
//         idToken: credential,
//         audience: process.env.CLIENT_ID,
//     });
//     console.log("The ticket ", ticket);

//     let userSocialInfo = ticket.getPayload();

//     console.log("User social info -", userSocialInfo);

//     let firstname = userSocialInfo.given_name;
//     let lastname = userSocialInfo.family_name;
//     let email = userSocialInfo.email;
//     let username = userSocialInfo.name;
//     let googleID = userSocialInfo.sub;
//     let verified = userSocialInfo.email_verified;

//     let userExists = await getUserByEmail(email);
//     console.log("User exists ", userExists);

//     if(userExists[0] == true ) {
//         //The User already has an account
//         userExists = userExists[1];
//         if(userExists.googleID === null || userExists.googleID === undefined) {
//            await updateUserById(userExists._id, {googleID})
//         //    let update = await updateUserById(userExists._id, {googleID})
//         //    console.log("Updated user to include  googleid", update)
//         }

//         // Create token
//         const token = userExists.token;
//         //Save token in a cookie and send back to the frontend
//         res.cookie('authToken', token, {
//             secure: process.env.NODE_ENV === "production",
//             maxAge: 1000*60*60*24,   //Cookie expires after 24hours of being logged in.. 1000 milliseconds * 60seconds * 60minutes *24 hours
//             httpOnly: true,
//             sameSite: false
//         })

//         const { _id, firstname, lastname, username, email, } = userExists
//         //To send back user info to client.
//         let user ={_id, firstname, lastname, username, email}

//         console.log("This user already has an account with this application and signed in with google ", user);
//         return res.status(200).json({message: "User account already exists. User sign in with Google successful", status: "OK", user})

//     } else {
//         // That User has signed up before
//         let newUser = await createUser({firstname, lastname, username, email, googleID, verified })
//         console.log("The new User ", newUser);
//         if(newUser[0] !== false ) {
//             newUser = newUser[1];

//             // Create token to send back to the User
//             const token = newUser.token;
//             //Save token in a cookie and send back to the frontend
//             res.cookie('authToken', token, {
//                 secure: process.env.NODE_ENV === "production",
//                 maxAge: 1000*60*60*24,   //Cookie expires after 24hours of being logged in.. 1000 milliseconds * 60seconds * 60minutes *24 hours
//                 httpOnly: true
//             })

//             // Removing the details we don't want to see
//             newUser.token = undefined;
//             return res.status(200).json({ message: "Google sign in successful", user:newUser, status: "OK" });

//         } else {
//             return res.status(400).json({error: "Google Sign In failed. Something went wrong.", actualError: newUser[1], status: "NOT OK" });

//         }
//     }

// } catch (error) {
//    console.log(error);
//     return res.status(400).json({error: "Something Went wrong", actualError: error, status: "NOT OK", note:"Check your internet connection" });

// }
// });

// module.exports = router;
