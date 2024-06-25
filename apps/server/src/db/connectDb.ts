import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const { connection } = await mongoose.connect(
      process.env.MONGO_URI as string,
    );
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Connected to MongoDB at: http://${connection.host + ":" + connection.port}`,
      );
    } else {
      console.log(`Connected to MongoDB at: https://${connection.host}`);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB!\nError: ${error}`);
  }
};
