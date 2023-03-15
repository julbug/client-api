const express = require("express");
const { route } = require ("./ticket.router.js");
const router = express.Router();

const{insertUser, getUserByEmail} = require("../model/user/User.model");
const{hashPassword, comparePassword} = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT} = require("../helpers/jwt.helper")
const {json} = require("body-parser");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper.js");


router.all("/", (req, res, next) => {
    // res.json({ message: "return from user router" });
    next();
});

//Create new user route
router.post('/', async (req, res)=>{
    const {name, company, address, phone, email, password} =req.body;

    try{
        //hash password
        const hashedPass = await hashPassword(password)


        const newUserObj = {
            name,
            company,
            address,
            phone,
            email,
            password: hashedPass,
        };

        const result = await insertUser(newUserObj)
        console.log(result);

    res.json({message: "New user created", result});

    } catch (error){
        console.log(error);
        res.json({statux: "error", message: error.message});  
    }
});

//User sign in Router
router.post("/login", async (req, res)=> {
    console.log(req.body);

    const{email, password} = req.body;


    //get email and password from request
    //if email OR password are not there, invalid submission
    if(!email || !password){
       return res.json({status:"error", message:"Invalid Form Submission"});
    }

    //get user from email address provided
     const user = await getUserByEmail(email);
     
     //if there is an email address, then there is a password inside the email
     const passFromDb = user && user._id ? user.password : null;

     //if we don't haven a password in the database, invalid 
     if(!passFromDb)
     return res.json({status:"error", message:"Invalid email or password"});

     //if there is a password, compare the password we have with the hashed password in the database
     const result = await comparePassword(password, passFromDb);

     //if the passwords don't match, invalid
     if(!result){
        res.json({status:"error", message:"Invalid email or password"});
     }
    //if the password matches, then create the AccesssJWT and RefreshJWT
     const accessJWT = await createAccessJWT(user.email, `${user._id}`);
     const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

     res.json({
        status:"success",
        message:"Login Successful!",
        accessJWT,
        refreshJWT,
    });
});

module.exports = router;