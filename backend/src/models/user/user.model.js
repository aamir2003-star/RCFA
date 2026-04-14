import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["BDE", "PM", "DEV"],
      required: true,
    },

    avatar: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" }
    },

    coverImage: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" }
    },


    refreshToken: String,
    isOnline: { type: Boolean, default: false },
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;