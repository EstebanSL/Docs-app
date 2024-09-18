// config/db.ts
const mongoose = require('mongoose');
 
export const connectDB = () => {
  const url = process.env.DB_CONNECTION_STRING;
  
  try {
    mongoose.connect(url);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }

  const dbConnection = mongoose.connection;

  dbConnection.once("open", () => {
    console.log(`Database connected: ${url}`);
  });
 
  dbConnection.on("error", (err) => {
    console.error(`Connection error: ${err}`);
  });
}