import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  mongoose.set('strictQuery', true)

  if(!process.env.MONGO_URI) {
    return console.log('Please define the MONGO_URI environment variable inside .env.local')
  }

  if(isConnected) {
    return console.log('Already connected.')
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    isConnected = true;
  } catch (error) {
    console.log(error)
  }
}