import type { AgentPolicy, Invoice, VendorProfile } from "./types";

export const demoPolicy: AgentPolicy = {
  id: "policy_001",
  buyerName: "Kanda Games",
  maxAmount: 100,
  currency: "USDC",
  allowedCategories: ["creative-services", "translation"],
  requireKyc: true,
  milestones: ["draft", "final-delivery"],
  expiresAt: "2026-07-14T23:59:00Z"
};

export const approvedVendor: VendorProfile = {
  id: "vendor_001",
  name: "Tokyo Design Studio",
  wallet: "0x1111111111111111111111111111111111111111",
  kycStatus: "approved"
};

export const missingKycVendor: VendorProfile = {
  id: "vendor_002",
  name: "Unverified Studio",
  wallet: "0x2222222222222222222222222222222222222222",
  kycStatus: "missing"
};

export const approvedInvoice: Invoice = {
  id: "inv_001",
  vendorId: "vendor_001",
  vendorName: "Tokyo Design Studio",
  category: "creative-services",
  service: "Landing page localization",
  amount: 80,
  currency: "USDC",
  milestones: ["draft", "final-delivery"]
};

export const overBudgetInvoice: Invoice = {
  ...approvedInvoice,
  id: "inv_002",
  amount: 180
};
