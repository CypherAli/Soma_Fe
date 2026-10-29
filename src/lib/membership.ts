import { authRequest } from "./auth";
export const MEMBERSHIP_CHANGED_EVENT = "soma-membership-changed";

export type Membership = {
  plan: "free" | "pro"; limit: number; used: number; remaining: number;
  month: string; resetsAt: string; premiumUntil: string | null;
  price: number; paymentEnabled: boolean;
  sandbox?: boolean;
};
export type PremiumOrder = {
  id: string; code: string; amount: number; status: "pending" | "paid";
  createdAt: string; paidAt: string | null;
  bank: string; account: string; holder: string; qrUrl: string | null;
  sandbox?: boolean;
  checkout?: { url: string; fields: Record<string, string | number> } | null;
  description?: string; transferContent?: string; checkoutUrl?: string;
};
export const getMembership = (signal?: AbortSignal) => authRequest<Membership>("/membership", { signal });
export const createPremiumOrder = () => authRequest<PremiumOrder>("/membership/checkout", { method: "POST" });
export const getPremiumOrder = (id: string, signal?: AbortSignal) => authRequest<PremiumOrder>(`/membership/orders/${encodeURIComponent(id)}`, { signal });
export const simulatePremiumOrder = (id: string) => authRequest<{success:boolean}>(`/membership/orders/${encodeURIComponent(id)}/simulate`, {method:"POST"});
