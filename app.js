const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

//API security
app.use(helmet());

//handle CORS error
app.use(cors());

//Logger
app.use(morgan("tiny"));


//Set body bodyParser

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



const port = process.env.PORT || 3001;

//Load Routers
const userRouter = requires("./src/routers/user.router.js")
const ticketRouter = requires("./src/routers/ticket.router.js")


//Use Routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);



//Error Handler
const handleError = require("./src/utils/errorHandler")

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