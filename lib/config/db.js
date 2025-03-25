import mongoose from "mongoose";

let isConnected = false;

export async function ConnectDB() {
    if (isConnected) {
        console.log("Using cached database connection");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);

        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(" MongoDB Connection Error:", error);
        throw new Error("Database connection failed");
    }
}
