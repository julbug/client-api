const handleError = (error, res) => {
    console.log(error);
    res.status(error.status || 500)
    res.json({
        messgae: error.message,
    });
};

module.exports = handleError;