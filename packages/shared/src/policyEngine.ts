import type { AgentPolicy, Invoice, PaymentEvaluation, PaymentEvidenceBundle, PaymentIntent, VendorProfile } from "./types";

type EvaluateInput = {
  policy: AgentPolicy;
  invoice: Invoice;
  vendor: VendorProfile;
};

export function evaluatePaymentIntent({ policy, invoice, vendor }: EvaluateInput): PaymentEvaluation {
  const blockers: string[] = [];
  const reasons: string[] = [];

  if (invoice.amount > policy.maxAmount) {
    blockers.push(
      `Invoice amount ${invoice.amount} ${invoice.currency} exceeds policy limit ${policy.maxAmount} ${policy.currency}`
    );
  }

  if (invoice.currency !== policy.currency) {
    blockers.push(`Invoice currency ${invoice.currency} does not match policy currency ${policy.currency}`);
  }

  if (!policy.allowedCategories.includes(invoice.category)) {
    blockers.push(`Invoice category ${invoice.category} is not allowed by policy`);
  }

  const disallowedMilestone = invoice.milestones.find((milestone) => !policy.milestones.includes(milestone));
  if (disallowedMilestone) {
    blockers.push(`Invoice milestone ${disallowedMilestone} is not allowed by policy`);
  }

  if (policy.requireKyc && vendor.kycStatus !== "approved") {
    blockers.push(`Vendor KYC status is ${vendor.kycStatus}`);
  }

  if (policy.requireKyc && vendor.kycStatus === "approved") {
    reasons.push("Vendor KYC approved");
  }

  const paymentIntent: PaymentIntent = {
    id: `intent_${invoice.id}`,
    policyId: policy.id,
    invoiceId: invoice.id,
    vendorWallet: vendor.wallet,
    amount: invoice.amount,
    currency: invoice.currency,
    milestones: invoice.milestones
  };

  return {
    status: blockers.length > 0 ? "blocked" : "allowed",
    reasons: [...reasons, ...blockers],
    paymentIntent
  };
}

export function buildPaymentEvidenceBundle({
  evaluation,
  policy,
  invoice,
  vendor,
  createdAt = new Date().toISOString()
}: EvaluateInput & { evaluation: PaymentEvaluation; createdAt?: string }): PaymentEvidenceBundle {
  return {
    id: `evidence_${evaluation.paymentIntent.id}`,
    createdAt,
    adapterMode: "local-policy-engine",
    chain: "HashKey Chain Testnet",
    policySnapshot: {
      id: policy.id,
      buyerName: policy.buyerName,
      maxAmount: policy.maxAmount,
      currency: policy.currency,
      allowedCategories: policy.allowedCategories,
      requireKyc: policy.requireKyc,
      milestones: policy.milestones,
      expiresAt: policy.expiresAt
    },
    invoiceSnapshot: {
      id: invoice.id,
      vendorId: invoice.vendorId,
      vendorName: invoice.vendorName,
      category: invoice.category,
      service: invoice.service,
      amount: invoice.amount,
      currency: invoice.currency,
      milestones: invoice.milestones
    },
    vendorSnapshot: {
      id: vendor.id,
      name: vendor.name,
      wallet: vendor.wallet,
      kycStatus: vendor.kycStatus
    },
    reasons: evaluation.reasons,
    receipt: {
      status: evaluation.status === "allowed" ? "prepared" : "blocked",
      network: "HashKey Chain Testnet",
      adapterMode: "hashkey-testnet-adapter",
      onchainStatus: evaluation.status === "allowed" ? "ready_for_signature" : "blocked_before_signature",
      paymentIntentId: evaluation.paymentIntent.id,
      txHash: null,
      explorerUrl: null,
      escrowContract: null
    }
  };
}
