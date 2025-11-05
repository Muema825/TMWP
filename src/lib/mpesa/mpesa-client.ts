// src/lib/mpesa/mpesa-client.ts

import type {
    InitiatePaymentRequest,
    InitiatePaymentResponse,
    MpesaCallbackData,
    ProcessedCallback,
    StkPushRequest,
    StkPushResponse,
  } from "~/db/schema/mpesa/types";
  
  /**
   * M-Pesa Daraja API Client for The MaM Water Project
   * 
   * Handles STK Push payments, callbacks, and transaction verification
   */
  export class MpesaClient {
    private consumerKey: string;
    private consumerSecret: string;
    private businessShortCode: string;
    private passkey: string;
    private environment: "sandbox" | "production";
    private baseUrl: string;
  
    constructor() {
      this.consumerKey = process.env.MPESA_CONSUMER_KEY!;
      this.consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
      this.businessShortCode = process.env.MPESA_BUSINESS_SHORT_CODE!;
      this.passkey = process.env.MPESA_PASSKEY!;
      this.environment = (process.env.MPESA_ENVIRONMENT as "sandbox" | "production") || "sandbox";
      
      this.baseUrl = this.environment === "production"
        ? "https://api.safaricom.co.ke"
        : "https://sandbox.safaricom.co.ke";
    }
  
    /**
     * Generate OAuth access token
     */
    private async getAccessToken(): Promise<string> {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString("base64");
      
      const response = await fetch(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to get M-Pesa access token");
      }
  
      const data = await response.json();
      return data.access_token;
    }
  
    /**
     * Generate password for STK Push
     */
    private generatePassword(): { password: string; timestamp: string } {
      const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, 14);
      
      const password = Buffer.from(
        `${this.businessShortCode}${this.passkey}${timestamp}`
      ).toString("base64");
  
      return { password, timestamp };
    }
  
    /**
     * Format phone number to M-Pesa format (254XXXXXXXXX)
     */
    private formatPhoneNumber(phone: string): string {
      // Remove any spaces, dashes, or plus signs
      let formatted = phone.replace(/[\s\-+]/g, "");
      
      // If starts with 0, replace with 254
      if (formatted.startsWith("0")) {
        formatted = "254" + formatted.slice(1);
      }
      
      // If doesn't start with 254, add it
      if (!formatted.startsWith("254")) {
        formatted = "254" + formatted;
      }
      
      return formatted;
    }
  
    /**
     * Initiate STK Push payment request
     */
    async initiateSTKPush(request: StkPushRequest): Promise<StkPushResponse> {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();
      const phoneNumber = this.formatPhoneNumber(request.phoneNumber);
      
      const payload = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(request.amount), // M-Pesa requires integer
        PartyA: phoneNumber,
        PartyB: this.businessShortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: process.env.MPESA_CALLBACK_URL!,
        AccountReference: request.accountReference,
        TransactionDesc: request.transactionDesc || "Payment",
      };
  
      const response = await fetch(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`M-Pesa STK Push failed: ${error}`);
      }
  
      return await response.json();
    }
  
    /**
     * Query STK Push transaction status
     */
    async querySTKPushStatus(checkoutRequestId: string): Promise<any> {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();
  
      const payload = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      };
  
      const response = await fetch(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to query M-Pesa transaction status");
      }
  
      return await response.json();
    }
  
    /**
     * Process M-Pesa callback data
     */
    processCallback(callbackData: MpesaCallbackData): ProcessedCallback {
      const callback = callbackData.Body.stkCallback;
      
      const processed: ProcessedCallback = {
        merchantRequestId: callback.MerchantRequestID,
        checkoutRequestId: callback.CheckoutRequestID,
        resultCode: callback.ResultCode,
        resultDesc: callback.ResultDesc,
      };
  
      // If payment was successful, extract metadata
      if (callback.ResultCode === 0 && callback.CallbackMetadata) {
        const metadata = callback.CallbackMetadata.Item;
        
        processed.amount = Number(metadata.find(item => item.Name === "Amount")?.Value) || 0;
        processed.mpesaReceiptNumber = String(metadata.find(item => item.Name === "MpesaReceiptNumber")?.Value) || "";
        processed.phoneNumber = String(metadata.find(item => item.Name === "PhoneNumber")?.Value) || "";
        
        const transDateValue = metadata.find(item => item.Name === "TransactionDate")?.Value;
        if (transDateValue) {
          // M-Pesa date format: YYYYMMDDHHmmss
          const dateStr = String(transDateValue);
          const year = dateStr.substring(0, 4);
          const month = dateStr.substring(4, 6);
          const day = dateStr.substring(6, 8);
          const hour = dateStr.substring(8, 10);
          const minute = dateStr.substring(10, 12);
          const second = dateStr.substring(12, 14);
          
          processed.transactionDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}+03:00`);
        }
      }
  
      return processed;
    }
  
    /**
     * Validate callback authenticity (optional but recommended)
     */
    validateCallback(callbackData: any): boolean {
      // Add validation logic here if needed
      // For now, basic validation
      return (
        callbackData?.Body?.stkCallback?.MerchantRequestID &&
        callbackData?.Body?.stkCallback?.CheckoutRequestID &&
        typeof callbackData?.Body?.stkCallback?.ResultCode === "number"
      );
    }
  }
  
  // Export singleton instance
  export const mpesaClient = new MpesaClient();
  
  /**
   * Helper function to initiate payment with better error handling
   */
  export async function initiatePayment(
    request: InitiatePaymentRequest
  ): Promise<InitiatePaymentResponse> {
    try {
      const stkRequest: StkPushRequest = {
        phoneNumber: request.phoneNumber,
        amount: request.amount,
        accountReference: request.accountReference,
        transactionDesc: request.description || `MaM Water - ${request.transactionType}`,
      };
  
      const response = await mpesaClient.initiateSTKPush(stkRequest);
  
      // Check if STK Push was successful
      if (response.ResponseCode === "0") {
        return {
          success: true,
          message: response.CustomerMessage,
          checkoutRequestId: response.CheckoutRequestID,
          merchantRequestId: response.MerchantRequestID,
        };
      } else {
        return {
          success: false,
          message: response.ResponseDescription,
          error: response.ResponseDescription,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to initiate payment",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
  
  /**
   * Format amount for display (KES format)
   */
  export function formatMpesaAmount(amount: number | string): string {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(num);
  }
  
  /**
   * Get transaction status message
   */
  export function getTransactionStatusMessage(resultCode: number): string {
    const statusMessages: Record<number, string> = {
      0: "Payment successful",
      1: "Insufficient funds",
      1032: "Payment cancelled by user",
      1037: "Payment timeout - no response from user",
      2001: "Invalid transaction",
    };
  
    return statusMessages[resultCode] || `Transaction failed (Code: ${resultCode})`;
  }