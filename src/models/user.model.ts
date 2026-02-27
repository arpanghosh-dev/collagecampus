import mongoose, { Schema, Document } from "mongoose";

export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
)

export default mongoose.model<IUser>("User", userSchema);