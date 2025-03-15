const mongoose = require('mongoose');
require("dotenv").config();
const connectDB = async()=>{
try{
    const conn = await mongoose.connect(process.env.MONGO_URI);
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined. Check your .env file.");
      }
    console.log(`mongo connected:${conn.connection.host}`)
}
catch(err){
    console.log('error in mongodb connection:',err);
    process.exit(1);
}
}


module.exports = connectDB;
