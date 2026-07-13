import mongoose from "mongoose";

// Exits the process if the initial connection fails, rather than running
// half-broken. If the connection drops later (network blip, DB restart),
// mongoose retries automatically - we just log it so it's visible.
export const connectDB = async (uri: string): Promise<void> => {
  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected - mongoose will attempt to reconnect");
  });

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
