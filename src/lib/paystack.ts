export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

export interface PaystackConfig {
  email: string;
  amount: number;
  reference: string;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export function generateReference(): string {
  return `BLG-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
