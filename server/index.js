const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
const app = express();

require('dotenv').config();
const auth = require('./auth');

const originURL = process.env.ORIGIN_URL;

const corsOptions = {
    origin:originURL,
    optionsSuccessStatus: 200
}

app.use(volleyball);
app.use(cors(corsOptions));
app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        message:`Hello. WORKLDS`
    });
});

app.use('/auth', auth);

function notFound(req,res,next) {
    res.status(404);
    const error = new Error("Not Found - "+req.originalUrl);
    next(error);
}

function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message:err.message,
        stack:err.stack
    });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT;

app.listen(port, () => {
    console.log("Listening on port ",port);
});