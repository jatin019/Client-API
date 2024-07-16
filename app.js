require("dotenv").config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const port = process.env.PORT || 3001;

// Debug statement to print the MongoDB URL
console.log('MongoDB URL:', process.env.MONGO_URL);

// API security
//app.use(helmet());

// Handle CORS error
app.use(cors());

// MongoDB connection setup
console.log('MongoDB URL:', process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected successfully");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// Logger
app.use(morgan('tiny'));

// Set body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load routers
const userRouter = require('./src/routers/user.router');
const ticketRouter = require('./src/routers/ticket.router'); // Assuming this router exists

// Use Routers
app.use('/v1/user', userRouter);
app.use('/v1/ticket', ticketRouter);

// Error handler
const handleError = require("./src/utils/errorHandler");

app.use((req, res, next) => {
    const error = new Error("Resources not found!");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    handleError(error, res);
});

app.listen(port, () => {
    console.log(`API is ready on http://localhost:${port}`);
});
