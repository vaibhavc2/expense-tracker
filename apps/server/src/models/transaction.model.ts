import mongoose from "mongoose";
import { IUser } from "./user.model";

enum PaymentType {
  Cash = "cash",
  Credit = "credit",
}

enum Category {
  Savings = "savings",
  Expenses = "expenses",
  Investments = "investments",
}

export interface ITransaction extends mongoose.Document {
  userId: IUser["_id"] | mongoose.Types.ObjectId;
  amount: number;
  description: string;
  paymentType: PaymentType;
  category: Category;
  location?: string;
  date: Date;
}

const transactionSchema = new mongoose.Schema<ITransaction>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  paymentType: {
    type: String,
    required: true,
    enum: Object.values(PaymentType),
  },
  category: {
    type: String,
    required: true,
    enum: Object.values(Category),
  },
  location: { type: String },
  date: { type: Date, default: Date.now },
});

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema,
);

export default Transaction;
