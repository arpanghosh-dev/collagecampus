import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    createdAt: Date;
    expiresAt: Date;
    deviceInfo?: {
        ip?: string;
        name?: string; // e.g. "Chrome on Windows"
    };
}

const refreshTokenSchema = new Schema<IRefreshToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        token: {
            type: String,
            required: true,
            index: true,
        },
        deviceInfo: {
            ip: String,
            name: String,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

// TTL Index to automatically remove expired tokens after they expire
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);
