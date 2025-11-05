// src/db/schema/orders/types.ts

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  hirePurchaseAgreementsTable,
  installmentPaymentsTable,
  paymentTransactionsTable,
  orderItemsTable,
  ordersTable,
  productsTable,
  reviewsTable,
} from "./tables";

// Product Types
export type Product = InferSelectModel<typeof productsTable>;
export type NewProduct = InferInsertModel<typeof productsTable>;

// Order Types
export type Order = InferSelectModel<typeof ordersTable>;
export type NewOrder = InferInsertModel<typeof ordersTable>;

// Order Item Types
export type OrderItem = InferSelectModel<typeof orderItemsTable>;
export type NewOrderItem = InferInsertModel<typeof orderItemsTable>;

// Hire Purchase Agreement Types
export type HirePurchaseAgreement = InferSelectModel<typeof hirePurchaseAgreementsTable>;
export type NewHirePurchaseAgreement = InferInsertModel<typeof hirePurchaseAgreementsTable>;

// Installment Payment Types
export type InstallmentPayment = InferSelectModel<typeof installmentPaymentsTable>;
export type NewInstallmentPayment = InferInsertModel<typeof installmentPaymentsTable>;

// Payment Transaction Types
export type PaymentTransaction = InferSelectModel<typeof paymentTransactionsTable>;
export type NewPaymentTransaction = InferInsertModel<typeof paymentTransactionsTable>;

// Review Types
export type Review = InferSelectModel<typeof reviewsTable>;
export type NewReview = InferInsertModel<typeof reviewsTable>;

// Extended types with relations
export type OrderWithItems = Order & {
  items: OrderItem[];
  hirePurchaseAgreement?: HirePurchaseAgreement;
};

export type OrderWithDetails = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
  hirePurchaseAgreement?: HirePurchaseAgreement & {
    installments: InstallmentPayment[];
  };
};

export type HirePurchaseWithPayments = HirePurchaseAgreement & {
  installments: InstallmentPayment[];
  order: Order;
};

// Enums as TypeScript types
export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "processing" 
  | "installed" 
  | "completed" 
  | "cancelled";

export type PaymentMethod = 
  | "cash" 
  | "hire_purchase" 
  | "mpesa" 
  | "bank_transfer";

export type PaymentStatus = 
  | "pending" 
  | "partial" 
  | "completed" 
  | "failed" 
  | "refunded";

export type InstallmentStatus = 
  | "pending" 
  | "paid" 
  | "overdue" 
  | "cancelled";

// Form types for creating orders
export type CreateOrderFormData = {
  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Delivery Address
  county: string;
  subCounty?: string;
  town?: string;
  deliveryAddress: string;
  landmarks?: string;
  
  // Order Details
  items: {
    productId: string;
    quantity: number;
  }[];
  paymentMethod: PaymentMethod;
  notes?: string;
  
  // Hire Purchase (if applicable)
  hirePurchase?: {
    depositAmount: number;
  };
};

// Dashboard statistics types
export type OrderStatistics = {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  revenueThisMonth: number;
};

export type HirePurchaseStatistics = {
  activeAgreements: number;
  totalAmountFinanced: number;
  totalCollected: number;
  overduePayments: number;
};