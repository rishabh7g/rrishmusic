/**
 * Payment Processing Utilities
 * Comprehensive payment gateway integration with Stripe, PayPal, and other providers
 */

import type { ServiceType } from '@/types';
import type { CustomerInfo, PaymentInfo } from '@/hooks/useBookingSystem';

export interface PaymentGateway {
  name: 'stripe' | 'paypal' | 'square';
  displayName: string;
  isEnabled: boolean;
  supportedMethods: PaymentMethod[];
  currencies: string[];
  fees: {
    percentage: number;
    fixed: number; // in cents
  };
  minAmount: number; // in cents
  maxAmount: number; // in cents
}

export interface PaymentMethod {
  type: 'card' | 'bank_transfer' | 'digital_wallet' | 'cash' | 'check';
  subtype?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'paypal' | 'apple_pay' | 'google_pay';
  displayName: string;
  icon?: string;
  processingTime: string; // e.g., "Instant", "1-3 business days"
  isEnabled: boolean;
}

export interface PaymentRequest {
  amount: number; // in cents
  currency: string;
  description: string;
  customerId?: string;
  customerInfo: CustomerInfo;
  billingAddress?: Address;
  paymentMethod: PaymentMethodDetails;
  serviceType: ServiceType;
  bookingId: string;
  metadata?: Record<string, unknown>;
  captureMethod?: 'automatic' | 'manual';
  setupFutureUsage?: 'off_session' | 'on_session';
}

export interface PaymentMethodDetails {
  type: PaymentMethod['type'];
  subtype?: PaymentMethod['subtype'];
  
  // Card details
  cardToken?: string;
  cardLast4?: string;
  cardExpiryMonth?: number;
  cardExpiryYear?: number;
  cardHolderName?: string;
  
  // Bank transfer details
  accountNumber?: string;
  routingNumber?: string;
  accountType?: 'checking' | 'savings';
  bankName?: string;
  
  // Digital wallet details
  walletProvider?: 'paypal' | 'apple_pay' | 'google_pay';
  walletToken?: string;
  
  // Billing info
  saveForFutureUse?: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentIntentId?: string;
  gatewayResponse?: unknown;
  error?: PaymentError;
  paymentInfo?: PaymentInfo;
  requiresAction?: boolean;
  actionUrl?: string;
  clientSecret?: string;
}

export interface PaymentError {
  code: string;
  message: string;
  details?: string;
  declineCode?: string;
  fraudScore?: number;
  suggestions?: string[];
}

export interface RefundRequest {
  transactionId: string;
  amount: number; // in cents
  currency: string;
  reason: string;
  bookingId: string;
  notifyCustomer?: boolean;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  amount: number;
  error?: PaymentError;
  refundInfo?: {
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
    reason: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface PaymentConfig {
  // Stripe configuration
  stripe: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    apiVersion: string;
  };
  
  // PayPal configuration
  paypal: {
    clientId: string;
    clientSecret: string;
    environment: 'sandbox' | 'production';
  };
  
  // Square configuration
  square: {
    applicationId: string;
    accessToken: string;
    environment: 'sandbox' | 'production';
    locationId: string;
  };
  
  // General settings
  defaultCurrency: string;
  enabledGateways: PaymentGateway['name'][];
  fraudDetection: boolean;
  requireCVV: boolean;
  requireBillingAddress: boolean;
  savePaymentMethods: boolean;
}

export interface RecurringPayment {
  id: string;
  customerId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextPaymentDate: Date;
  status: 'active' | 'paused' | 'cancelled' | 'past_due';
  paymentMethod: PaymentMethodDetails;
  failedAttempts: number;
  maxFailedAttempts: number;
  trialPeriodDays?: number;
  serviceType: ServiceType;
  bookingId: string;
}

/**
 * Payment gateway configurations
 */
export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  {
    name: 'stripe',
    displayName: 'Stripe',
    isEnabled: true,
    supportedMethods: [
      {
        type: 'card',
        subtype: 'visa',
        displayName: 'Visa',
        processingTime: 'Instant',
        isEnabled: true
      },
      {
        type: 'card',
        subtype: 'mastercard',
        displayName: 'Mastercard',
        processingTime: 'Instant',
        isEnabled: true
      },
      {
        type: 'card',
        subtype: 'amex',
        displayName: 'American Express',
        processingTime: 'Instant',
        isEnabled: true
      },
      {
        type: 'digital_wallet',
        subtype: 'apple_pay',
        displayName: 'Apple Pay',
        processingTime: 'Instant',
        isEnabled: true
      },
      {
        type: 'digital_wallet',
        subtype: 'google_pay',
        displayName: 'Google Pay',
        processingTime: 'Instant',
        isEnabled: true
      }
    ],
    currencies: ['USD', 'CAD', 'EUR', 'GBP'],
    fees: { percentage: 2.9, fixed: 30 },
    minAmount: 50, // $0.50
    maxAmount: 99999999 // $999,999.99
  },
  {
    name: 'paypal',
    displayName: 'PayPal',
    isEnabled: true,
    supportedMethods: [
      {
        type: 'digital_wallet',
        subtype: 'paypal',
        displayName: 'PayPal',
        processingTime: 'Instant',
        isEnabled: true
      }
    ],
    currencies: ['USD', 'CAD', 'EUR', 'GBP'],
    fees: { percentage: 3.49, fixed: 49 },
    minAmount: 100, // $1.00
    maxAmount: 1000000000 // $10,000,000.00
  },
  {
    name: 'square',
    displayName: 'Square',
    isEnabled: false,
    supportedMethods: [
      {
        type: 'card',
        displayName: 'Credit/Debit Card',
        processingTime: 'Instant',
        isEnabled: true
      }
    ],
    currencies: ['USD', 'CAD'],
    fees: { percentage: 2.9, fixed: 30 },
    minAmount: 100,
    maxAmount: 50000000
  }
];

/**
 * Main payment processing class
 */
export class PaymentProcessor {
  private config: PaymentConfig;
  private gateways: Map<string, PaymentGateway>;

  constructor(config: PaymentConfig) {
    this.config = config;
    this.gateways = new Map(PAYMENT_GATEWAYS.map(gw => [gw.name, gw]));
  }

  /**
   * Process a payment through the appropriate gateway
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate payment request
      const validationError = this.validatePaymentRequest(request);
      if (validationError) {
        return { success: false, error: validationError };
      }

      // Determine best gateway for this payment
      const gateway = this.selectPaymentGateway(request);
      if (!gateway) {
        return {
          success: false,
          error: {
            code: 'NO_GATEWAY',
            message: 'No suitable payment gateway available',
            suggestions: ['Try a different payment method']
          }
        };
      }

      // Process based on gateway
      switch (gateway.name) {
        case 'stripe':
          return await this.processStripePayment(request);
        case 'paypal':
          return await this.processPayPalPayment(request);
        case 'square':
          return await this.processSquarePayment(request);
        default:
          return {
            success: false,
            error: {
              code: 'UNSUPPORTED_GATEWAY',
              message: 'Payment gateway not supported'
            }
          };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PROCESSING_ERROR',
          message: error instanceof Error ? error.message : 'Payment processing failed'
        }
      };
    }
  }

  /**
   * Process refund
   */
  async processRefund(request: RefundRequest): Promise<RefundResponse> {
    try {
      // In a real implementation, determine gateway from transaction ID
      const gateway = this.gateways.get('stripe'); // Default to Stripe

      if (!gateway) {
        return {
          success: false,
          amount: request.amount,
          error: {
            code: 'NO_GATEWAY',
            message: 'Gateway not available for refund'
          }
        };
      }

      // Simulate refund processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const refundInfo = {
        id: `ref_${Date.now()}`,
        amount: request.amount,
        currency: request.currency,
        status: 'succeeded' as const,
        reason: request.reason,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return {
        success: true,
        refundId: refundInfo.id,
        amount: request.amount,
        refundInfo
      };
    } catch (error) {
      return {
        success: false,
        amount: request.amount,
        error: {
          code: 'REFUND_ERROR',
          message: error instanceof Error ? error.message : 'Refund processing failed'
        }
      };
    }
  }

  /**
   * Create recurring payment subscription
   */
  async createRecurringPayment(
    paymentMethodId: string,
    amount: number,
    frequency: RecurringPayment['frequency'],
    serviceType: ServiceType,
    bookingId: string
  ): Promise<{ success: boolean; subscription?: RecurringPayment; error?: PaymentError }> {
    try {
      // Simulate subscription creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const subscription: RecurringPayment = {
        id: `sub_${Date.now()}`,
        customerId: `cus_${Date.now()}`,
        subscriptionId: `subscription_${Date.now()}`,
        amount,
        currency: this.config.defaultCurrency,
        frequency,
        nextPaymentDate: this.calculateNextPaymentDate(frequency),
        status: 'active',
        paymentMethod: { type: 'card' }, // Would be populated from paymentMethodId
        failedAttempts: 0,
        maxFailedAttempts: 3,
        serviceType,
        bookingId
      };

      return { success: true, subscription };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SUBSCRIPTION_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create subscription'
        }
      };
    }
  }

  /**
   * Get payment methods for a service type
   */
  getAvailablePaymentMethods(serviceType: ServiceType, amount: number): PaymentMethod[] {
    const availableMethods: PaymentMethod[] = [];

    for (const gateway of this.gateways.values()) {
      if (!gateway.isEnabled) continue;
      if (amount < gateway.minAmount || amount > gateway.maxAmount) continue;

      // Add service-specific logic
      if (serviceType === 'teaching' && amount >= 10000) { // $100+
        // For higher amounts, prefer more secure methods
        gateway.supportedMethods
          .filter(method => method.isEnabled && method.type === 'card')
          .forEach(method => availableMethods.push(method));
      } else {
        gateway.supportedMethods
          .filter(method => method.isEnabled)
          .forEach(method => availableMethods.push(method));
      }
    }

    return availableMethods;
  }

  /**
   * Calculate payment processing fees
   */
  calculateFees(amount: number, gateway: PaymentGateway['name']): {
    processingFee: number;
    netAmount: number;
    feePercentage: number;
  } {
    const gatewayConfig = this.gateways.get(gateway);
    if (!gatewayConfig) {
      return { processingFee: 0, netAmount: amount, feePercentage: 0 };
    }

    const processingFee = Math.round((amount * gatewayConfig.fees.percentage / 100) + gatewayConfig.fees.fixed);
    const netAmount = amount - processingFee;

    return {
      processingFee,
      netAmount,
      feePercentage: gatewayConfig.fees.percentage
    };
  }

  /**
   * Validate payment request
   */
  private validatePaymentRequest(request: PaymentRequest): PaymentError | null {
    if (request.amount <= 0) {
      return {
        code: 'INVALID_AMOUNT',
        message: 'Payment amount must be greater than zero'
      };
    }

    if (!request.customerInfo.email) {
      return {
        code: 'MISSING_EMAIL',
        message: 'Customer email is required'
      };
    }

    if (!this.isValidEmail(request.customerInfo.email)) {
      return {
        code: 'INVALID_EMAIL',
        message: 'Customer email format is invalid'
      };
    }

    if (request.paymentMethod.type === 'card' && !request.paymentMethod.cardToken) {
      return {
        code: 'MISSING_CARD_TOKEN',
        message: 'Card token is required for card payments'
      };
    }

    return null;
  }

  /**
   * Select best payment gateway for request
   */
  private selectPaymentGateway(request: PaymentRequest): PaymentGateway | null {
    for (const gatewayName of this.config.enabledGateways) {
      const gateway = this.gateways.get(gatewayName);
      if (!gateway || !gateway.isEnabled) continue;

      // Check amount limits
      if (request.amount < gateway.minAmount || request.amount > gateway.maxAmount) continue;

      // Check currency support
      if (!gateway.currencies.includes(request.currency)) continue;

      // Check payment method support
      const supportsMethod = gateway.supportedMethods.some(method => 
        method.type === request.paymentMethod.type && 
        method.isEnabled &&
        (!request.paymentMethod.subtype || method.subtype === request.paymentMethod.subtype)
      );

      if (supportsMethod) {
        return gateway;
      }
    }

    return null;
  }

  /**
   * Process Stripe payment
   */
  private async processStripePayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate Stripe payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock success/failure
    if (Math.random() > 0.1) { // 90% success rate
      const paymentInfo: PaymentInfo = {
        id: `pi_${Date.now()}`,
        amount: request.amount,
        currency: request.currency,
        method: 'card',
        status: 'completed',
        gateway: 'stripe',
        gatewayTransactionId: `ch_${Date.now()}`,
        processedAt: new Date()
      };

      return {
        success: true,
        transactionId: paymentInfo.gatewayTransactionId,
        paymentIntentId: paymentInfo.id,
        paymentInfo
      };
    } else {
      // Simulate failure
      return {
        success: false,
        error: {
          code: 'CARD_DECLINED',
          message: 'Your card was declined',
          declineCode: 'insufficient_funds',
          suggestions: [
            'Check your card balance',
            'Try a different payment method',
            'Contact your bank'
          ]
        }
      };
    }
  }

  /**
   * Process PayPal payment
   */
  private async processPayPalPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate PayPal payment flow
    await new Promise(resolve => setTimeout(resolve, 1000));

    const paymentInfo: PaymentInfo = {
      id: `paypal_${Date.now()}`,
      amount: request.amount,
      currency: request.currency,
      method: 'paypal',
      status: 'completed',
      gateway: 'paypal',
      gatewayTransactionId: `txn_${Date.now()}`,
      processedAt: new Date()
    };

    return {
      success: true,
      transactionId: paymentInfo.gatewayTransactionId,
      paymentInfo
    };
  }

  /**
   * Process Square payment
   */
  private async processSquarePayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate Square payment processing
    await new Promise(resolve => setTimeout(resolve, 1200));

    const paymentInfo: PaymentInfo = {
      id: `sq_${Date.now()}`,
      amount: request.amount,
      currency: request.currency,
      method: 'card',
      status: 'completed',
      gateway: 'square',
      gatewayTransactionId: `sq_txn_${Date.now()}`,
      processedAt: new Date()
    };

    return {
      success: true,
      transactionId: paymentInfo.gatewayTransactionId,
      paymentInfo
    };
  }

  /**
   * Calculate next payment date for recurring payments
   */
  private calculateNextPaymentDate(frequency: RecurringPayment['frequency']): Date {
    const now = new Date();
    const nextDate = new Date(now);

    switch (frequency) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    return nextDate;
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

/**
 * Default payment configuration
 */
export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  stripe: {
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_...',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_...',
    apiVersion: '2023-10-16'
  },
  paypal: {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || 'paypal_client_id',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'paypal_client_secret',
    environment: 'sandbox'
  },
  square: {
    applicationId: process.env.REACT_APP_SQUARE_APPLICATION_ID || 'square_app_id',
    accessToken: process.env.SQUARE_ACCESS_TOKEN || 'square_access_token',
    environment: 'sandbox',
    locationId: process.env.SQUARE_LOCATION_ID || 'square_location_id'
  },
  defaultCurrency: 'USD',
  enabledGateways: ['stripe', 'paypal'],
  fraudDetection: true,
  requireCVV: true,
  requireBillingAddress: false,
  savePaymentMethods: true
};

/**
 * Create payment processor instance
 */
export function createPaymentProcessor(config?: Partial<PaymentConfig>): PaymentProcessor {
  return new PaymentProcessor({
    ...DEFAULT_PAYMENT_CONFIG,
    ...config
  });
}

/**
 * Format amount for display (in dollars)
 */
export function formatAmount(amountInCents: number, currency: string = 'USD'): string {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(amount);
}

/**
 * Convert amount to cents
 */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert cents to amount
 */
export function fromCents(amountInCents: number): number {
  return amountInCents / 100;
}

export default {
  PaymentProcessor,
  createPaymentProcessor,
  formatAmount,
  toCents,
  fromCents,
  PAYMENT_GATEWAYS,
  DEFAULT_PAYMENT_CONFIG
};