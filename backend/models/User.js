import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false // Made optional for OAuth users
    },
    authMethod: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("User", UserModel);
