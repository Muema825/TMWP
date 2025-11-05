// src/db/schema/users/relations.ts

import { relations } from "drizzle-orm";

import { uploadsTable } from "../uploads/tables";
import { mpesaTransactionsTable } from "../mpesa/tables";
import { 
  ordersTable, 
  hirePurchaseAgreementsTable, 
  reviewsTable 
} from "../orders/tables";
import { accountTable, sessionTable, userTable } from "./tables";

export const userRelations = relations(userTable, ({ many }) => ({
  // Auth relations
  accounts: many(accountTable),
  sessions: many(sessionTable),
  
  // Media relations
  uploads: many(uploadsTable),
  
  // M-Pesa/Payment relations
  mpesaTransactions: many(mpesaTransactionsTable),
  
  // Order relations
  orders: many(ordersTable),
  hirePurchaseAgreements: many(hirePurchaseAgreementsTable),
  reviews: many(reviewsTable),
}));

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const accountRelations = relations(accountTable, ({ one }) => ({
  user: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}));