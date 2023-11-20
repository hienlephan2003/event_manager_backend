import mongoose, { Model, Document } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String, required: true },
    fullName: String,
    phoneNumber: { type: String, required: true, unique: true },
    imageUrl: String,
    dateOfBirth: Date,
    role: {
      type: String,
      enum: ["admin", "user", "officer"],
      required: true,
      default: "user",
    },
    accountStatus: {
      type: String,
      enum: ["verified", "new", "ban"],
    },
  },
  { timestamps: true }
);

UserSchema.set("toObject", {
  transform: function (doc, ret, options) {
    delete ret.password; // Exclude 'password' field
    return ret;
  },
});

interface UserDocument extends Document {
  email: string;
  password: string;
  fullName?: string;
  phoneNumber: string;
  imageUrl?: string;
  dateOfBirth?: Date;
  role: "admin" | "user" | "officer";
  accountStatus?: "verified" | "new" | "ban";
  createdAt: Date;
  updatedAt: Date;
}
const User: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  UserSchema
);

export { User, UserDocument };
