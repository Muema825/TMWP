// src/db/schema/index.ts

// Export all tables
export * from "./users/tables";
export * from "./uploads/tables";
export * from "./mpesa/tables";
export * from "./orders/tables";

// Export all relations
export * from "./users/relations";
export * from "./uploads/relations";
export * from "./mpesa/relations";
export * from "./orders/relations";

// Export all types
export * from "./users/types";
export * from "./uploads/types";
export * from "./mpesa/types";
export * from "./orders/types";

// Re-export commonly used types for convenience
export type {
  User,
  Session,
} from "./users/types";

export type {
  Order,
  OrderWithDetails,
  Product,
  HirePurchaseAgreement,
  HirePurchaseWithPayments,
  InstallmentPayment,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  CreateOrderFormData,
} from "./orders/types";

export type {
  MediaUpload,
} from "./uploads/types";

export type {
  MpesaTransaction,
  MpesaStkPush,
  MpesaCallback,
  MpesaTransactionType,
  MpesaTransactionStatus,
  StkPushRequest,
  InitiatePaymentRequest,
} from "./mpesa/types";