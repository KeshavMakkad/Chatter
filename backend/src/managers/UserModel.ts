import mongoose, { Schema, Document } from "mongoose";
import { User } from "./UserManager";

interface IUserDocument extends Document {
    user: User;
}

const userSchema = new Schema<IUserDocument>({
    user: {
        type: Schema.Types.Mixed,
        required: true,
        unique: true,
    },
});

const UserModel = mongoose.model<IUserDocument>("User", userSchema);

export { UserModel };
