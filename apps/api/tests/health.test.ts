import { describe, expect, it } from "vitest";
import { app, createApp } from "../src/app";

describe("health route", () => {
  it("returns the AgentPay API service status", async () => {
    const response = await app.request("/health");
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      service: "agentpay-api"
    });
  });
});

describe("payment evaluation route", () => {
  it("returns a policy decision and evidence bundle for a structured invoice", async () => {
    const testApp = createApp();

    const response = await testApp.request("/payments/evaluate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        policy: {
          id: "policy_001",
          buyerName: "Kanda Games",
          maxAmount: 100,
          currency: "USDC",
          allowedCategories: ["creative-services"],
          requireKyc: true,
          milestones: ["draft", "final-delivery"],
          expiresAt: "2026-07-14T23:59:00Z"
        },
        invoice: {
          id: "inv_001",
          vendorId: "vendor_001",
          vendorName: "Tokyo Design Studio",
          category: "creative-services",
          service: "Landing page localization",
          amount: 80,
          currency: "USDC",
          milestones: ["draft", "final-delivery"]
        },
        vendor: {
          id: "vendor_001",
          name: "Tokyo Design Studio",
          wallet: "0x1111111111111111111111111111111111111111",
          kycStatus: "approved"
        }
      })
    });

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.evaluation.status).toBe("allowed");
    expect(body.evidence).toMatchObject({
      id: "evidence_intent_inv_001",
      adapterMode: "local-policy-engine",
      chain: "HashKey Chain Testnet",
      policySnapshot: { id: "policy_001", maxAmount: 100, currency: "USDC" },
      invoiceSnapshot: { id: "inv_001", amount: 80, currency: "USDC" },
      vendorSnapshot: {
        id: "vendor_001",
        wallet: "0x1111111111111111111111111111111111111111",
        kycStatus: "approved"
      },
      receipt: {
        status: "prepared",
        network: "HashKey Chain Testnet",
        adapterMode: "hashkey-testnet-adapter",
        onchainStatus: "ready_for_signature",
        paymentIntentId: "intent_inv_001",
        txHash: null,
        explorerUrl: null,
        escrowContract: null
      }
    });
    expect(body.evidence.reasons).toContain("Vendor KYC approved");
    expect(body.evidence.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
