import { describe, expect, it } from "vitest";
import { approvedInvoice, approvedVendor, demoPolicy, missingKycVendor, overBudgetInvoice } from "../src/demoData";
import { buildPaymentEvidenceBundle, evaluatePaymentIntent } from "../src/policyEngine";

describe("evaluatePaymentIntent", () => {
  it("allows a vendor invoice that satisfies policy, KYC, and milestone requirements", () => {
    const result = evaluatePaymentIntent({
      policy: demoPolicy,
      invoice: approvedInvoice,
      vendor: approvedVendor
    });

    expect(result.status).toBe("allowed");
    expect(result.paymentIntent).toMatchObject({
      id: "intent_inv_001",
      amount: 80,
      currency: "USDC",
      vendorWallet: approvedVendor.wallet
    });
  });

  it("blocks invoices above the buyer policy limit", () => {
    const result = evaluatePaymentIntent({
      policy: demoPolicy,
      invoice: overBudgetInvoice,
      vendor: approvedVendor
    });

    expect(result.status).toBe("blocked");
    expect(result.reasons.join(" ")).toContain("exceeds policy limit");
  });

  it("blocks vendors without approved KYC when the policy requires it", () => {
    const result = evaluatePaymentIntent({
      policy: demoPolicy,
      invoice: approvedInvoice,
      vendor: missingKycVendor
    });

    expect(result.status).toBe("blocked");
    expect(result.reasons.join(" ")).toContain("Vendor KYC status is missing");
  });

  it("builds a HashKey testnet-ready receipt placeholder for allowed payment intents", () => {
    const evaluation = evaluatePaymentIntent({
      policy: demoPolicy,
      invoice: approvedInvoice,
      vendor: approvedVendor
    });

    const evidence = buildPaymentEvidenceBundle({
      policy: demoPolicy,
      invoice: approvedInvoice,
      vendor: approvedVendor,
      evaluation,
      createdAt: "2026-06-19T12:00:00.000Z"
    });

    expect(evidence.receipt).toMatchObject({
      status: "prepared",
      network: "HashKey Chain Testnet",
      adapterMode: "hashkey-testnet-adapter",
      onchainStatus: "ready_for_signature",
      paymentIntentId: "intent_inv_001",
      txHash: null,
      explorerUrl: null,
      escrowContract: null
    });
  });
});
