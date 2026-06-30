import {
  buildPaymentEvidenceBundle,
  evaluatePaymentIntent,
  type AgentPolicy,
  type Invoice,
  type VendorProfile
} from "@agentpay/shared";
import { NextResponse } from "next/server";

type EvaluatePaymentPayload = {
  policy: AgentPolicy;
  invoice: Invoice;
  vendor: VendorProfile;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as EvaluatePaymentPayload | null;
  if (!isEvaluatePaymentPayload(payload)) {
    return NextResponse.json({ ok: false, error: "INVALID_PAYMENT_PAYLOAD" }, { status: 400 });
  }

  const evaluation = evaluatePaymentIntent(payload);
  const evidence = buildPaymentEvidenceBundle({ ...payload, evaluation });

  return NextResponse.json({
    ok: true,
    evaluation,
    evidence
  });
}

function isEvaluatePaymentPayload(value: EvaluatePaymentPayload | null): value is EvaluatePaymentPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  return isPolicy(value.policy) && isInvoice(value.invoice) && isVendor(value.vendor);
}

function isPolicy(value: AgentPolicy | undefined): value is AgentPolicy {
  return Boolean(
    value &&
      typeof value.id === "string" &&
      typeof value.buyerName === "string" &&
      typeof value.maxAmount === "number" &&
      typeof value.currency === "string" &&
      Array.isArray(value.allowedCategories) &&
      typeof value.requireKyc === "boolean" &&
      Array.isArray(value.milestones) &&
      typeof value.expiresAt === "string"
  );
}

function isInvoice(value: Invoice | undefined): value is Invoice {
  return Boolean(
    value &&
      typeof value.id === "string" &&
      typeof value.vendorId === "string" &&
      typeof value.vendorName === "string" &&
      typeof value.category === "string" &&
      typeof value.service === "string" &&
      typeof value.amount === "number" &&
      typeof value.currency === "string" &&
      Array.isArray(value.milestones)
  );
}

function isVendor(value: VendorProfile | undefined): value is VendorProfile {
  return Boolean(
    value &&
      typeof value.id === "string" &&
      typeof value.name === "string" &&
      typeof value.wallet === "string" &&
      ["approved", "pending", "missing", "rejected"].includes(value.kycStatus)
  );
}
