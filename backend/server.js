const express = require('express');
const { connectDatabase } = require('./database');
const cookieParser = require('cookie-parser');

const PORT = 8000;
const MONGODB_URL = 'mongodb://127.0.0.1:27017/chimsales'
const app = express();

connectDatabase(MONGOURL)
  .then(()=> {console.log('MongoDB connected successfully')})
  .error((error)=>{console.error(`Error connecting to Database: ${error}`)});

app.use(cookieParser());


app.listen(PORT, ()=> {console.log(`Express server started successfully on PORT: ${PORT}`)});