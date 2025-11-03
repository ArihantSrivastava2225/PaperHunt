import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    bookmark: {
        type: String,
        required: true,
    },
    doi: {
        type: String,
        required: true,
    },
    pdfLink: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    papers: [paperSchema],
}, { 
    timestamps: true ,
})

const User = mongoose.model("User", userSchema);

export default User;