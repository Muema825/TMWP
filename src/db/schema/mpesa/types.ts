// src/db/schema/mpesa/types.ts

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  mpesaCallbacksTable,
  mpesaConfigTable,
  mpesaReconciliationTable,
  mpesaStkPushTable,
  mpesaTransactionsTable,
} from "./tables";

// M-Pesa Transaction Types
export type MpesaTransaction = InferSelectModel<typeof mpesaTransactionsTable>;
export type NewMpesaTransaction = InferInsertModel<typeof mpesaTransactionsTable>;

// M-Pesa STK Push Types
export type MpesaStkPush = InferSelectModel<typeof mpesaStkPushTable>;
export type NewMpesaStkPush = InferInsertModel<typeof mpesaStkPushTable>;

// M-Pesa Callback Types
export type MpesaCallback = InferSelectModel<typeof mpesaCallbacksTable>;
export type NewMpesaCallback = InferInsertModel<typeof mpesaCallbacksTable>;

// M-Pesa Config Types
export type MpesaConfig = InferSelectModel<typeof mpesaConfigTable>;
export type NewMpesaConfig = InferInsertModel<typeof mpesaConfigTable>;

// M-Pesa Reconciliation Types
export type MpesaReconciliation = InferSelectModel<typeof mpesaReconciliationTable>;
export type NewMpesaReconciliation = InferInsertModel<typeof mpesaReconciliationTable>;

// Enum Types
export type MpesaTransactionType =
  | "stk_push"
  | "c2b"
  | "b2c"
  | "deposit"
  | "installment"
  | "cash_payment";

export type MpesaTransactionStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "timeout";

// STK Push Request Type
export type StkPushRequest = {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc?: string;
};

// STK Push Response Type
export type StkPushResponse = {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
};

// M-Pesa Callback Data Type
export type MpesaCallbackData = {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
};

// Processed Callback Type
export type ProcessedCallback = {
  merchantRequestId: string;
  checkoutRequestId: string;
  resultCode: number;
  resultDesc: string;
  amount?: number;
  mpesaReceiptNumber?: string;
  transactionDate?: Date;
  phoneNumber?: string;
};

// Payment Initiation Types
export type InitiatePaymentRequest = {
  userId?: string;
  phoneNumber: string;
  amount: number;
  transactionType: MpesaTransactionType;
  accountReference: string;
  description?: string;
};

export type InitiatePaymentResponse = {
  success: boolean;
  message: string;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  error?: string;
};

// Payment Verification Type
export type VerifyPaymentRequest = {
  checkoutRequestId: string;
};

export type VerifyPaymentResponse = {
  success: boolean;
  status: MpesaTransactionStatus;
  transaction?: MpesaTransaction;
  error?: string;
};

// Reconciliation Summary Type
export type ReconciliationSummary = {
  date: Date;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalAmount: number;
  pendingTransactions: number;
  discrepancies: string[];
};

// Dashboard Statistics Type
export type MpesaStatistics = {
  today: {
    transactions: number;
    amount: number;
    successful: number;
    failed: number;
  };
  thisWeek: {
    transactions: number;
    amount: number;
  };
  thisMonth: {
    transactions: number;
    amount: number;
  };
  recentTransactions: MpesaTransaction[];
};

// Payment Link Type (for generating payment requests)
export type PaymentLinkRequest = {
  orderId: string;
  amount: number;
  phoneNumber: string;
  description: string;
};

export type PaymentLinkResponse = {
  success: boolean;
  paymentLink?: string;
  checkoutRequestId?: string;
  expiresAt?: Date;
  error?: string;
};