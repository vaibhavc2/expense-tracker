import mongoose from "mongoose";

enum Gender {
  Male = "male",
  Female = "female",
}

export interface IUser extends mongoose.Document {
  _id: string;
  username: string;
  name: string;
  password: string;
  gender: Gender;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true, enum: Object.values(Gender) },
    profilePicture: { type: String },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
