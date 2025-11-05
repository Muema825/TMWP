// src/db/schema/orders/tables.ts

import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { userTable } from "../users/tables";

// Enums
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "installed",
  "completed",
  "cancelled",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "hire_purchase",
  "mpesa",
  "bank_transfer",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "partial",
  "completed",
  "failed",
  "refunded",
]);

export const installmentStatusEnum = pgEnum("installment_status", [
  "pending",
  "paid",
  "overdue",
  "cancelled",
]);

// Products Table
export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  capacity: integer("capacity"), // in liters
  cashPrice: decimal("cash_price", { precision: 10, scale: 2 }).notNull(),
  hirePurchaseDeposit: decimal("hire_purchase_deposit", { precision: 10, scale: 2 }),
  hirePurchaseMonthly: decimal("hire_purchase_monthly", { precision: 10, scale: 2 }),
  hirePurchasePeriod: integer("hire_purchase_period"), // months
  imageUrl: text("image_url"),
  inStock: boolean("in_stock").default(true).notNull(),
  features: text("features").array(), // JSON array of features
  specifications: text("specifications"), // JSON object
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders Table
export const ordersTable = pgTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).unique().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  
  // Customer Information
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  
  // Delivery Address
  county: varchar("county", { length: 100 }).notNull(),
  subCounty: varchar("sub_county", { length: 100 }),
  town: varchar("town", { length: 100 }),
  deliveryAddress: text("delivery_address").notNull(),
  landmarks: text("landmarks"),
  
  // Order Details
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
  orderStatus: orderStatusEnum("order_status").default("pending").notNull(),
  
  // Installation Details
  installationDate: timestamp("installation_date"),
  installationNotes: text("installation_notes"),
  installedBy: text("installed_by"),
  
  // Notes
  notes: text("notes"),
  adminNotes: text("admin_notes"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Order Items Table
export const orderItemsTable = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => productsTable.id),
  
  productName: varchar("product_name", { length: 255 }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Hire Purchase Agreements Table
export const hirePurchaseAgreementsTable = pgTable("hire_purchase_agreements", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .unique()
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  
  // Agreement Details
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }).notNull(),
  remainingAmount: decimal("remaining_amount", { precision: 10, scale: 2 }).notNull(),
  monthlyInstallment: decimal("monthly_installment", { precision: 10, scale: 2 }).notNull(),
  numberOfInstallments: integer("number_of_installments").notNull(),
  installmentsPaid: integer("installments_paid").default(0).notNull(),
  
  // Dates
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  nextPaymentDate: timestamp("next_payment_date"),
  
  // Status
  isActive: boolean("is_active").default(true).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  
  // Notes
  agreementNotes: text("agreement_notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Installment Payments Table
export const installmentPaymentsTable = pgTable("installment_payments", {
  id: text("id").primaryKey(),
  agreementId: text("agreement_id")
    .notNull()
    .references(() => hirePurchaseAgreementsTable.id, { onDelete: "cascade" }),
  
  // Payment Details
  installmentNumber: integer("installment_number").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  
  // Payment Method
  paymentMethod: varchar("payment_method", { length: 50 }),
  transactionReference: varchar("transaction_reference", { length: 100 }),
  
  // Status
  status: installmentStatusEnum("status").default("pending").notNull(),
  
  // Late fees
  lateFee: decimal("late_fee", { precision: 10, scale: 2 }).default("0"),
  
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payment Transactions Table (links orders/installments to M-Pesa transactions)
export const paymentTransactionsTable = pgTable("payment_transactions", {
  id: text("id").primaryKey(),
  
  // Links to orders or installments
  orderId: text("order_id").references(() => ordersTable.id, { onDelete: "set null" }),
  installmentPaymentId: text("installment_payment_id").references(() => installmentPaymentsTable.id, { onDelete: "set null" }),
  
  // M-Pesa Transaction Reference (links to mpesa.mpesa_transactions table)
  mpesaTransactionId: text("mpesa_transaction_id"), // References mpesa_transactions.id
  mpesaReceiptNumber: varchar("mpesa_receipt_number", { length: 100 }),
  
  // Payment Details
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(), // 'mpesa', 'cash', 'bank'
  
  // Status
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Customer Reviews Table
export const reviewsTable = pgTable("reviews", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  productId: text("product_id")
    .notNull()
    .references(() => productsTable.id),
  
  rating: integer("rating").notNull(), // 1-5
  title: varchar("title", { length: 255 }),
  comment: text("comment"),
  
  // Moderation
  isApproved: boolean("is_approved").default(false).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});