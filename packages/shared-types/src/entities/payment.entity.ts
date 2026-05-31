import type {
  PaymentMethod,
  PaymentStatus,
  TransactionType,
  TransactionStatus,
} from '../enums';

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  orderCode: string;
  amount: number;
  coinAmount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  payosPaymentId: string | null;
  payosCheckoutUrl: string | null;
  payosTransactionId: string | null;
  description: string | null;
  metadata: Record<string, unknown>;
  callbackData: Record<string, unknown> | null;
  paidAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRefund {
  id: string;
  paymentId: string;
  userId: string;
  amount: number;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  refundTransactionId: string | null;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Coin Types
export interface CoinWallet {
  id: string;
  userId: string;
  balance: number;
  lifetimeEarnings: number;
  lifetimeSpent: number;
  lastUpdatedAt: Date;
  createdAt: Date;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: TransactionStatus;
  referenceId: string | null;
  referenceType: 'payment' | 'video_unlock' | 'referral' | 'promotion' | null;
  description: string | null;
  expiresAt: Date | null;
  createdAt: Date;
}

export interface CoinPackage {
  id: string;
  name: string;
  description: string | null;
  coinAmount: number;
  price: number;
  bonusCoinAmount: number;
  bonusPercentage: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoinReward {
  id: string;
  type: 'pioneer' | 'referral' | 'promotion' | 'achievement';
  name: string;
  description: string;
  coinAmount: number;
  isActive: boolean;
  maxClaims: number | null;
  currentClaims: number;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
