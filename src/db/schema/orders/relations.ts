// src/db/schema/orders/relations.ts

import { relations } from "drizzle-orm";
import { userTable } from "../users/tables";
import {
  hirePurchaseAgreementsTable,
  installmentPaymentsTable,
  paymentTransactionsTable,
  orderItemsTable,
  ordersTable,
  productsTable,
  reviewsTable,
} from "./tables";

// Product Relations
export const productsRelations = relations(productsTable, ({ many }) => ({
  orderItems: many(orderItemsTable),
  reviews: many(reviewsTable),
}));

// Order Relations
export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [ordersTable.userId],
    references: [userTable.id],
  }),
  items: many(orderItemsTable),
  hirePurchaseAgreement: one(hirePurchaseAgreementsTable),
  paymentTransactions: many(paymentTransactionsTable),
  reviews: many(reviewsTable),
}));

// Order Items Relations
export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
  product: one(productsTable, {
    fields: [orderItemsTable.productId],
    references: [productsTable.id],
  }),
}));

// Hire Purchase Agreement Relations
export const hirePurchaseAgreementsRelations = relations(
  hirePurchaseAgreementsTable,
  ({ one, many }) => ({
    order: one(ordersTable, {
      fields: [hirePurchaseAgreementsTable.orderId],
      references: [ordersTable.id],
    }),
    user: one(userTable, {
      fields: [hirePurchaseAgreementsTable.userId],
      references: [userTable.id],
    }),
    installments: many(installmentPaymentsTable),
  }),
);

// Installment Payments Relations
export const installmentPaymentsRelations = relations(
  installmentPaymentsTable,
  ({ one, many }) => ({
    agreement: one(hirePurchaseAgreementsTable, {
      fields: [installmentPaymentsTable.agreementId],
      references: [hirePurchaseAgreementsTable.id],
    }),
    paymentTransactions: many(paymentTransactionsTable),
  }),
);

// Payment Transactions Relations
export const paymentTransactionsRelations = relations(
  paymentTransactionsTable,
  ({ one }) => ({
    order: one(ordersTable, {
      fields: [paymentTransactionsTable.orderId],
      references: [ordersTable.id],
    }),
    installmentPayment: one(installmentPaymentsTable, {
      fields: [paymentTransactionsTable.installmentPaymentId],
      references: [installmentPaymentsTable.id],
    }),
  }),
);

// Reviews Relations
export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [reviewsTable.orderId],
    references: [ordersTable.id],
  }),
  user: one(userTable, {
    fields: [reviewsTable.userId],
    references: [userTable.id],
  }),
  product: one(productsTable, {
    fields: [reviewsTable.productId],
    references: [productsTable.id],
  }),
}));

// Update User Relations to include orders
export const userOrdersRelations = relations(userTable, ({ many }) => ({
  orders: many(ordersTable),
  hirePurchaseAgreements: many(hirePurchaseAgreementsTable),
  reviews: many(reviewsTable),
}));