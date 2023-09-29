import mongoose from "mongoose";

let isConnected = false;

const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL not found");
  }
  try {
    if (isConnected) {
      console.log("Connection already established to MongoDB");
    } else {
      await mongoose.connect(process.env.MONGO_URL);
      isConnected = true;
      console.log("Connected to MongoDB");
    }
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

export default connectToDB;
