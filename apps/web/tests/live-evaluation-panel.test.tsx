import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AppPage from "../src/app/app/page";

const allowedResponse = {
  ok: true,
  evaluation: {
    status: "allowed",
    reasons: ["Vendor KYC approved"],
    paymentIntent: {
      id: "intent_inv_001",
      policyId: "policy_001",
      invoiceId: "inv_001",
      vendorWallet: "0x1111111111111111111111111111111111111111",
      amount: 80,
      currency: "USDC",
      milestones: ["draft", "final-delivery"]
    }
  },
  evidence: {
    id: "evidence_intent_inv_001",
    createdAt: "2026-06-19T12:00:00.000Z",
    adapterMode: "local-policy-engine",
    chain: "HashKey Chain Testnet",
    policySnapshot: { id: "policy_001", maxAmount: 100, currency: "USDC" },
    invoiceSnapshot: { id: "inv_001", amount: 80, currency: "USDC" },
    vendorSnapshot: { id: "vendor_001", kycStatus: "approved" },
    reasons: ["Vendor KYC approved"],
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
  }
};

const blockedResponse = {
  ok: true,
  evaluation: {
    status: "blocked",
    reasons: ["Invoice amount 180 USDC exceeds policy limit 100 USDC"],
    paymentIntent: {
      id: "intent_inv_002",
      policyId: "policy_001",
      invoiceId: "inv_002",
      vendorWallet: "0x1111111111111111111111111111111111111111",
      amount: 180,
      currency: "USDC",
      milestones: ["draft", "final-delivery"]
    }
  },
  evidence: {
    id: "evidence_intent_inv_002",
    createdAt: "2026-06-19T12:00:01.000Z",
    adapterMode: "local-policy-engine",
    chain: "HashKey Chain Testnet",
    policySnapshot: { id: "policy_001", maxAmount: 100, currency: "USDC" },
    invoiceSnapshot: { id: "inv_002", amount: 180, currency: "USDC" },
    vendorSnapshot: { id: "vendor_001", kycStatus: "approved" },
    reasons: ["Invoice amount 180 USDC exceeds policy limit 100 USDC"],
    receipt: {
      status: "blocked",
      network: "HashKey Chain Testnet",
      adapterMode: "hashkey-testnet-adapter",
      onchainStatus: "blocked_before_signature",
      paymentIntentId: "intent_inv_002",
      txHash: null,
      explorerUrl: null,
      escrowContract: null
    }
  }
};

describe("live evaluation panel", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response(JSON.stringify(allowedResponse), { status: 200 }))
        .mockResolvedValueOnce(new Response(JSON.stringify(blockedResponse), { status: 200 }))
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("loads a live policy evaluation and can switch to a blocked scenario", async () => {
    render(<AppPage />);

    expect(screen.getByRole("heading", { name: "Live Payment Evaluation" })).toBeInTheDocument();
    expect(await screen.findByText("evidence_intent_inv_001")).toBeInTheDocument();
    expect(screen.getAllByText("prepared").length).toBeGreaterThan(0);
    expect(screen.getByText("hashkey-testnet-adapter")).toBeInTheDocument();
    expect(screen.getByText("ready_for_signature")).toBeInTheDocument();
    expect(screen.getAllByText("Vendor KYC approved").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Blocked scenario" }));

    expect(await screen.findByText("evidence_intent_inv_002")).toBeInTheDocument();
    expect(screen.getAllByText("blocked").length).toBeGreaterThan(0);
    expect(screen.getByText("blocked_before_signature")).toBeInTheDocument();
    expect(screen.getByText(/exceeds policy limit/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});
