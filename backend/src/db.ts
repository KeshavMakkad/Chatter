import { connect } from "mongoose";
import { config } from "dotenv";
import path from "path";

// Log the path to verify correctness
console.log("Path to .env:", path.resolve(__dirname, "../.env"));

// Specify the path to the .env file one directory above the backend folder
config({ path: path.resolve(__dirname, "../../.env") });

export const startDB = async () => {
    const mongodbUri = process.env.MONGODB_URI;

    if (mongodbUri) {
        try {
            await connect(mongodbUri);
            console.log("DB connection successful");
        } catch (error) {
            console.error("DB connection failed:", error);
        }
    } else {
        console.log("MONGODB_URI is not defined.");
    }
};
