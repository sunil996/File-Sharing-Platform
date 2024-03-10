require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
   
    try {
          await mongoose.connect(process.env.MONGO_CONNECTION_URL);
        console.log('Database connected');
    } catch (error) {
        console.error('Connection error:', error.message);
    }
  
}

module.exports = connectDB;
