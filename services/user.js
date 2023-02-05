require('dotenv').config();
const User = require("../models/user");
const { translateError } = require("./mongo_helper");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


/* Create new User */
const createUser = async({ firstname, lastname, username, email, googleID, verified}) => {
    
    try {
        
        let user = new User({
            firstname,
            lastname,
            username,
            email,
            googleID,
            verified
        })

        console.log("The User ", user);
        //Create a  token 
        const token = jwt.sign({ id: user._id, role:user.role }, process.env.JWT_SECRET);
        
        user.token = token;

        if( await user.save()) {
            return [true, user]
        }

    } catch (error) {
        console.log(error);
        return [false, translateError(error)];
    }
}

/* Authenticate User with email and password */
// const authenticateUser = async(email, password) => {
//     const user = await User.findOne({ email})
  
//     if(user && (await bcrypt.compare(password, user.password))) {
//       return [true, user];
//     } else {
//       return [false, "Incorrect email/password"]
//     }
//   }

/* Return user with specified id */
const getUserById = async (id) => {
    try {
        const user = await User.findById(id);
        if(user !== null) {
            return [true, user];
        }
        else {
            return [false, "User doesn't exist. It is null and/or has been deleted."];
        }
    } catch (error) {
        console.log(translateError(error));
        return [false, translateError(error)];
    }
}

/* Return user with specified iemail*/
const getUserByEmail = async (email) => {
    const user = await User.findOne({email});

    if(user!==null) {
        return [true, user]
    }
    else {
        return [false, "User with that email doesn't exist"]
    }
}


const generateVerificationToken = (id) => {
    console.log("The user id passed into the jwt generate method", id)
    const verificationToken = jwt.sign({id:id}, process.env.USER_VERIFICATION_TOKEN_SECRET, {expiresIn: "24h"});
    console.log("Generated verification token ", verificationToken);
    return verificationToken
}

const decodeToken = (token) => {
    try {
        const payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET)
        return [true, payload]
    } catch (error) {
        return [false, error]
    }
}


const updateUserById = async (id, fields) => await User.findByIdAndUpdate(id, fields, { new: true})

const deleteUserById = async(id) => await User.findByIdAndDelete(id);



module.exports = {
    createUser,
    getUserById,
    getUserByEmail,
    generateVerificationToken,
    decodeToken,
    updateUserById,
    deleteUserById
 
}


