// src/db/schema/mpesa/tables.ts

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
  
  // M-Pesa Transaction Type Enum
  export const mpesaTransactionTypeEnum = pgEnum("mpesa_transaction_type", [
    "stk_push",        // Customer-initiated payment via STK Push
    "c2b",             // Customer to Business payment
    "b2c",             // Business to Customer (refunds)
    "deposit",         // Hire purchase deposit
    "installment",     // Monthly installment payment
    "cash_payment",    // Full cash payment
  ]);
  
  // M-Pesa Transaction Status Enum
  export const mpesaTransactionStatusEnum = pgEnum("mpesa_transaction_status", [
    "pending",         // Transaction initiated, awaiting callback
    "processing",      // Payment being processed
    "completed",       // Payment successful
    "failed",          // Payment failed
    "cancelled",       // Payment cancelled
    "timeout",         // Request timed out
  ]);
  
  // M-Pesa Transactions Table - Main payment tracking
  export const mpesaTransactionsTable = pgTable("mpesa_transactions", {
    id: text("id").primaryKey(),
    
    // User/Customer Info
    userId: text("user_id").references(() => userTable.id, { onDelete: "set null" }),
    phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
    
    // Transaction Details
    transactionType: mpesaTransactionTypeEnum("transaction_type").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    accountReference: varchar("account_reference", { length: 100 }), // Order number or agreement ID
    transactionDesc: text("transaction_desc"),
    
    // M-Pesa Specific Fields
    merchantRequestId: varchar("merchant_request_id", { length: 100 }),
    checkoutRequestId: varchar("checkout_request_id", { length: 100 }).unique(),
    mpesaReceiptNumber: varchar("mpesa_receipt_number", { length: 100 }).unique(),
    
    // Response Data
    resultCode: integer("result_code"),
    resultDesc: text("result_desc"),
    
    // Status
    status: mpesaTransactionStatusEnum("status").default("pending").notNull(),
    
    // Timestamps
    transactionDate: timestamp("transaction_date"),
    callbackReceivedAt: timestamp("callback_received_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    
    // Raw Data Storage (for debugging and audit)
    requestPayload: text("request_payload"), // JSON string of STK push request
    callbackPayload: text("callback_payload"), // JSON string of M-Pesa callback
    
    // Additional Info
    notes: text("notes"),
  });
  
  // M-Pesa STK Push Requests - Track all STK push attempts
  export const mpesaStkPushTable = pgTable("mpesa_stk_push", {
    id: text("id").primaryKey(),
    
    // Request Details
    phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    accountReference: varchar("account_reference", { length: 100 }).notNull(),
    transactionDesc: varchar("transaction_desc", { length: 255 }),
    
    // M-Pesa Response
    merchantRequestId: varchar("merchant_request_id", { length: 100 }),
    checkoutRequestId: varchar("checkout_request_id", { length: 100 }).unique(),
    responseCode: varchar("response_code", { length: 10 }),
    responseDescription: text("response_description"),
    customerMessage: text("customer_message"),
    
    // Status
    isSuccessful: boolean("is_successful").default(false),
    isPending: boolean("is_pending").default(true),
    
    // Timestamps
    requestedAt: timestamp("requested_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
    
    // Raw Request/Response
    requestData: text("request_data"),
    responseData: text("response_data"),
    
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });
  
  // M-Pesa Callbacks - Store all callback data for audit trail
  export const mpesaCallbacksTable = pgTable("mpesa_callbacks", {
    id: text("id").primaryKey(),
    
    // Callback Type
    callbackType: varchar("callback_type", { length: 50 }).notNull(), // STK_CALLBACK, C2B_CONFIRMATION, etc.
    
    // M-Pesa References
    merchantRequestId: varchar("merchant_request_id", { length: 100 }),
    checkoutRequestId: varchar("checkout_request_id", { length: 100 }),
    
    // Result
    resultCode: integer("result_code"),
    resultDesc: text("result_desc"),
    
    // Payment Details (if successful)
    amount: decimal("amount", { precision: 10, scale: 2 }),
    mpesaReceiptNumber: varchar("mpesa_receipt_number", { length: 100 }),
    transactionDate: timestamp("transaction_date"),
    phoneNumber: varchar("phone_number", { length: 20 }),
    
    // Processing Status
    isProcessed: boolean("is_processed").default(false),
    processedAt: timestamp("processed_at"),
    processingError: text("processing_error"),
    
    // Raw Callback Data
    rawPayload: text("raw_payload").notNull(), // Full JSON callback
    
    // Metadata
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
  
  // M-Pesa Configuration - Store API credentials and settings
  export const mpesaConfigTable = pgTable("mpesa_config", {
    id: text("id").primaryKey(),
    
    // Environment
    environment: varchar("environment", { length: 20 }).notNull(), // 'sandbox' or 'production'
    
    // Credentials (encrypted in production)
    consumerKey: text("consumer_key").notNull(),
    consumerSecret: text("consumer_secret").notNull(),
    
    // Business Details
    businessShortCode: varchar("business_shortcode", { length: 20 }).notNull(),
    passkey: text("passkey").notNull(),
    
    // Callback URLs
    callbackUrl: text("callback_url").notNull(),
    timeoutUrl: text("timeout_url"),
    resultUrl: text("result_url"),
    
    // Settings
    isActive: boolean("is_active").default(true).notNull(),
    
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    
    // Notes
    notes: text("notes"),
  });
  
  // M-Pesa Reconciliation - Daily reconciliation tracking
  export const mpesaReconciliationTable = pgTable("mpesa_reconciliation", {
    id: text("id").primaryKey(),
    
    // Reconciliation Period
    reconciliationDate: timestamp("reconciliation_date").notNull(),
    
    // Summary
    totalTransactions: integer("total_transactions").default(0).notNull(),
    successfulTransactions: integer("successful_transactions").default(0).notNull(),
    failedTransactions: integer("failed_transactions").default(0).notNull(),
    totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).default("0").notNull(),
    
    // Status
    isReconciled: boolean("is_reconciled").default(false).notNull(),
    reconciledBy: text("reconciled_by"),
    
    // Discrepancies
    hasDiscrepancies: boolean("has_discrepancies").default(false).notNull(),
    discrepancyNotes: text("discrepancy_notes"),
    
    // Timestamps
    reconciledAt: timestamp("reconciled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });