// config/db.ts
import mongoose from 'mongoose';
 
export const connectDB = () => {
  const url = process.env.DB_CONNECTION_STRING!;
  
  try {
    mongoose.connect(url);
  } catch (err: any) {
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