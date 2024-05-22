import mongoose from "mongoose";

const User = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  is_registered: {
    type: Boolean,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: false,
    trim: true,
  },
  picture: {
    type: String,
    required: false,
    trim: true,
  },
  // ... other user properties
});

export default mongoose.models.User || mongoose.model("User", User);
