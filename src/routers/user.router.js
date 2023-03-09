const express = require("express");
const { route }= require ("./ticket.router.js");
const router = express.Router();

const{insertUser, getUserByEmail} = require("../model/user/User.model");
const{hashPassword, comparePassword} = require("../helpers/bcrypt.helper");
const {json} = require("body-parser");


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

    if(!email || !password){
       return res.json({status:"error", message:"Invalid Form Submission"});
    }

     const user = await getUserByEmail(email);
     
     const passFromDb = user && user._id ? user.password : null;

     if(!passFromDb)
     return res.json({status:"error", message:"Invalid email or password"});

     const result = await comparePassword(password, passFromDb)
    
    res.json({status:"success", message:"Login Successful!"});
})

module.exports = router;