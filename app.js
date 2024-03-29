require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
// const port = process.env.PORT || 3001;
const port = process.env.PORT ;

//API security
// app.use(helmet());

//handle CORS error
app.use(cors());

console.log(process.env.PORT)
//MongoDB Connection Setup
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
});

if(process.env.NODE_ENV !== "production"){
    const mDB = mongoose.connection;
    mDB.on("open", ()=>{
    console.log("MongoDB is connected")
})
mDB.on("error", (error)=>{
    console.log(error)
})
//Logger
app.use(morgan("tiny"));
}

//Set body bodyParser

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Load Routers
const userRouter = require("./src/routers/user.router");
const ticketRouter = require("./src/routers/ticket.router");
const tokensRouter = require("./src/routers/tokens.router");


//Use Routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);
app.use("/v1/tokens", tokensRouter);



//Error Handler
const handleError = require("./src/utils/errorHandler");

app.use("*", (req, res, next) => {
    const error = new Error ("Resources not found!")
    error.status = 404
    next(error)
});

app.use((error, req, res, next)=>{
    handleError(error, res);
})

app.listen(port, ()=>{
    console.log(`API is ready on http://localhost:${port}`)
});