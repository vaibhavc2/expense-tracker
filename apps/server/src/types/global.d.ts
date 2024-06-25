import { ITransaction, IUser } from "@/models";
import { Request as ExpressRequest } from "express";
import { PassportContext } from "graphql-passport";

// PassportContext<IUser, ExpressRequest> is a generic type that takes two arguments: IUser and ExpressRequest. This type is used to define the AppContext interface.
// The AppContext interface is used to define the context parameter in the resolvers. The context parameter is used to access the user object in the resolvers.

export interface UserContext extends PassportContext<IUser, ExpressRequest> {}
export interface TransactionContext
  extends PassportContext<ITransaction, ExpressRequest> {}

/* ******************************************************************** */

// User interfaces and types
interface SignUpInput {
  username: string;
  name: string;
  password: string;
  gender: string;
}

interface LoginInput {
  username: string;
  password: string;
}

interface LogoutResponse {
  message: string;
}

/* ******************************************************************** */

// Transaction interfaces and types
interface CreateTransactionInput {
  userId: string;
  description: string;
  paymentType: string;
  category: string;
  amount: number;
  location?: string;
  date: string;
}

interface UpdateTransactionInput {
  transactionId: string;
  description?: string;
  paymentType?: string;
  category?: string;
  amount?: number;
  location?: string;
  date?: string;
}

interface DeleteTransactionResponse {
  message: string;
}
