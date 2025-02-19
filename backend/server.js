require('dotenv').config()

const express = require('express');
const { connectDatabase } = require('./database');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/chimsales';
const app = express();

connectDatabase(MONGODB_URL)
  .then(()=> {console.log('MongoDB connected successfully')})
  .error((error)=>{console.error(`Error connecting to Database: ${error}`)});

app.use(cookieParser());


app.listen(PORT, ()=> {console.log(`Express server started successfully on PORT: ${PORT}`)});