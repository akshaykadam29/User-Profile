const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/users');

const app = express();

// Database connection
mongoose.connect('mongodb+srv://akshay:' + process.env.MONGO_ATLAS_PW  + '@cluster0.mabdu.mongodb.net/user-profile?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to Database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// images folder permission
app.use('/images', express.static(path.join('backend/images')));

// Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});


app.use('/api/users', userRoutes);


module.exports = app;
