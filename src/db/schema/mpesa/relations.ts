// src/db/schema/mpesa/relations.ts

import { relations } from "drizzle-orm";
import { userTable } from "../users/tables";
import {
  mpesaCallbacksTable,
  mpesaConfigTable,
  mpesaReconciliationTable,
  mpesaStkPushTable,
  mpesaTransactionsTable,
} from "./tables";

// M-Pesa Transactions Relations
export const mpesaTransactionsRelations = relations(
  mpesaTransactionsTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [mpesaTransactionsTable.userId],
      references: [userTable.id],
    }),
  }),
);

// User Relations - Add M-Pesa transactions
export const extendUserMpesaRelations = relations(userTable, ({ many }) => ({
  mpesaTransactions: many(mpesaTransactionsTable),
}));

// M-Pesa STK Push Relations
export const mpesaStkPushRelations = relations(mpesaStkPushTable, ({ one }) => ({
  transaction: one(mpesaTransactionsTable, {
    fields: [mpesaStkPushTable.checkoutRequestId],
    references: [mpesaTransactionsTable.checkoutRequestId],
  }),
}));

// M-Pesa Callbacks Relations
export const mpesaCallbacksRelations = relations(
  mpesaCallbacksTable,
  ({ one }) => ({
    transaction: one(mpesaTransactionsTable, {
      fields: [mpesaCallbacksTable.checkoutRequestId],
      references: [mpesaTransactionsTable.checkoutRequestId],
    }),
  }),
);

// Note: mpesaConfigTable and mpesaReconciliationTable don't have direct relations
// as they are standalone configuration and reporting tables