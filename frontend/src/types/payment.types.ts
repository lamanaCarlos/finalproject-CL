export interface CreatePaymentIntentRequest {
  orderId: string;
}

export interface PaymentIntentData {
  orderId: string;
  clientSecret: string;
  providerPaymentId: string;
  paymentStatus: string;
}

