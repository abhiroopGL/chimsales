require('dotenv').config()

const express = require('express');
const cors = require('cors');
const { connectDatabase } = require('./database');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user_routes');
// const {checkForAuthentication} = require("./middlewares/auth");

const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/chimsales';
const app = express();

connectDatabase(MONGODB_URL)
    .then(()=> {console.log('MongoDB connected successfully')})
    .catch((error)=>{console.error(`Error connecting to Database: ${error}`)});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
// app.use(checkForAuthentication);

app.use("/api/auth", userRouter);


app.listen(PORT, ()=> {console.log(`Express server started successfully on PORT: ${PORT}`)});