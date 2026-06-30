export type KycStatus = "approved" | "pending" | "missing" | "rejected";

export type AgentPolicy = {
  id: string;
  buyerName: string;
  maxAmount: number;
  currency: string;
  allowedCategories: string[];
  requireKyc: boolean;
  milestones: string[];
  expiresAt: string;
};

export type Invoice = {
  id: string;
  vendorId: string;
  vendorName: string;
  category: string;
  service: string;
  amount: number;
  currency: string;
  milestones: string[];
};

export type VendorProfile = {
  id: string;
  name: string;
  wallet: string;
  kycStatus: KycStatus;
};

export type PaymentIntent = {
  id: string;
  policyId: string;
  invoiceId: string;
  vendorWallet: string;
  amount: number;
  currency: string;
  milestones: string[];
};

export type PaymentEvaluation = {
  status: "allowed" | "blocked";
  reasons: string[];
  paymentIntent: PaymentIntent;
};

export type PaymentEvidenceBundle = {
  id: string;
  createdAt: string;
  adapterMode: "local-policy-engine";
  chain: "HashKey Chain Testnet";
  policySnapshot: Pick<AgentPolicy, "id" | "buyerName" | "maxAmount" | "currency" | "allowedCategories" | "requireKyc" | "milestones" | "expiresAt">;
  invoiceSnapshot: Pick<Invoice, "id" | "vendorId" | "vendorName" | "category" | "service" | "amount" | "currency" | "milestones">;
  vendorSnapshot: Pick<VendorProfile, "id" | "name" | "wallet" | "kycStatus">;
  reasons: string[];
  receipt: {
    status: "prepared" | "blocked";
    network: "HashKey Chain Testnet";
    adapterMode: "hashkey-testnet-adapter";
    onchainStatus: "ready_for_signature" | "blocked_before_signature";
    paymentIntentId: string;
    txHash: string | null;
    explorerUrl: string | null;
    escrowContract: string | null;
  };
};
