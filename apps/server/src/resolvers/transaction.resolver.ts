import { Transaction } from "@/models";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  UserContext,
} from "@/types/global";

const transactionResolver = {
  Query: {
    transactions: async (
      parent: unknown,
      data: unknown,
      context: UserContext,
    ) => {
      try {
        if (!context.isAuthenticated()) {
          throw new Error("You are not authenticated.");
        }

        const userId = context.getUser()?._id;

        const transactions = await Transaction.find({ userId });

        return transactions;
      } catch (error) {
        // console.error("Error getting transactions: ", error);

        if (error instanceof Error) {
          throw new Error(
            error.message ||
              "Something went wrong getting the transactions. Please try again.",
          );
        } else {
          throw new Error(
            "An unknown error occurred getting the transactions. Please try again.",
          );
        }
      }
    },

    transaction: async (
      parent: unknown,
      { transactionId }: { transactionId: string },
    ) => {
      try {
        const transaction = await Transaction.findById(transactionId);

        return transaction;
      } catch (error) {
        // console.error("Error getting transaction by ID: ", error);
        throw new Error(
          "An error occurred getting the transaction by ID. Please try again.",
        );
      }
    },
  },

  Mutation: {
    createTransaction: async (
      parent: unknown,
      { input }: { input: Omit<CreateTransactionInput, "userId"> },
      context: UserContext,
    ) => {
      try {
        const newTransaction = await new Transaction({
          ...input,
          userId: context.getUser()?._id,
        }).save();

        return newTransaction;
      } catch (error) {
        // console.error("Error creating transaction: ", error);
        throw new Error(
          "An error occurred creating the transaction. Please try again.",
        );
      }
    },

    updateTransaction: async (
      parent: unknown,
      { input }: { input: UpdateTransactionInput },
    ) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          { _id: input.transactionId },
          input,
          { new: true },
        );

        return updatedTransaction;
      } catch (error) {
        // console.error("Error updating transaction: ", error);
        throw new Error(
          "An error occurred updating the transaction. Please try again.",
        );
      }
    },

    deleteTransaction: async (
      parent: unknown,
      { transactionId }: { transactionId: string },
    ) => {
      try {
        await Transaction.findByIdAndDelete(transactionId);

        return { message: "Transaction deleted successfully." };
      } catch (error) {
        // console.error("Error deleting transaction: ", error);
        throw new Error(
          "An error occurred deleting the transaction. Please try again.",
        );
      }
    },
  },
};

export default transactionResolver;
