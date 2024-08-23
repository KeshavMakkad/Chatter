import { connect } from "mongoose";
import { config } from "dotenv";

config();

console.log("MONGODB_URI:", process.env.MONGODB_URI); // Add this line

export const startDB = async () => {
    const mongodbUri = process.env.MONGODB_URI;

    if (mongodbUri) {
        await connect(mongodbUri);
        console.log("DB connection successful");
    } else {
        // throw new Error("MONGODB_URI is not defined.");
        console.log(mongodbUri);
    }
};
