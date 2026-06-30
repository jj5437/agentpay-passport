"use client";

import {
  approvedInvoice,
  approvedVendor,
  demoPolicy,
  overBudgetInvoice,
  type AgentPolicy,
  type Invoice,
  type PaymentEvaluation,
  type PaymentEvidenceBundle,
  type VendorProfile
} from "@agentpay/shared";
import { useEffect, useMemo, useState } from "react";
import { hashkeyProof, shortenAddress } from "../hashkeyProof";

type Scenario = "allowed" | "blocked";

type EvaluationResponse = {
  ok: boolean;
  evaluation: PaymentEvaluation;
  evidence: PaymentEvidenceBundle;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8787";

export function LiveEvaluationPanel() {
  const [scenario, setScenario] = useState<Scenario>("allowed");
  const [result, setResult] = useState<EvaluationResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const payload = useMemo(() => buildScenarioPayload(scenario), [scenario]);

  useEffect(() => {
    let isCurrent = true;

    async function evaluateScenario() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`${apiBaseUrl}/payments/evaluate`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error("Payment evaluation failed");
        }

        const body = (await response.json()) as EvaluationResponse;
        if (isCurrent) {
          setResult(body);
        }
      } catch {
        if (isCurrent) {
          setResult(null);
          setError("Live evaluation API is unavailable. Start the API server and retry.");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void evaluateScenario();

    return () => {
      isCurrent = false;
    };
  }, [payload]);

  const evidenceJson = result ? JSON.stringify(result.evidence, null, 2) : "";
  const evidenceHref = result
    ? `data:application/json;charset=utf-8,${encodeURIComponent(evidenceJson)}`
    : undefined;

  return (
    <section id="payment" className="workspace-card live-evaluation-card">
      <div className="live-panel-head">
        <div>
          <p className="eyebrow">API driven review</p>
          <h1>Live Payment Evaluation</h1>
          <p>
            The workspace now calls the policy API and renders the reviewer-ready evidence bundle returned by the
            backend.
          </p>
        </div>
        <div className="scenario-toggle" aria-label="Demo scenario">
          <button
            type="button"
            className={scenario === "allowed" ? "active" : ""}
            onClick={() => setScenario("allowed")}
          >
            Allowed scenario
          </button>
          <button
            type="button"
            className={scenario === "blocked" ? "active" : ""}
            onClick={() => setScenario("blocked")}
          >
            Blocked scenario
          </button>
        </div>
      </div>

      <div className="live-evaluation-grid">
        <article className="intent-card primary-intent">
          <div className="panel-heading">
            <span>Payment Intent</span>
            <strong>{isLoading ? "loading" : result?.evaluation.status ?? "offline"}</strong>
          </div>
          <div className="policy-grid">
            <span>
              Vendor
              <strong>{payload.vendor.name}</strong>
            </span>
            <span>
              Amount
              <strong>
                {payload.invoice.amount} {payload.invoice.currency}
              </strong>
            </span>
            <span>
              KYC
              <strong>{payload.vendor.kycStatus}</strong>
            </span>
            <span>
              Receipt
              <strong>{result?.evidence.receipt.status ?? "pending"}</strong>
            </span>
          </div>
        </article>

        <article className="reasoning-panel">
          <div className="panel-heading">
            <span>Agent Reasoning</span>
            <strong>{result?.evidence.adapterMode ?? "waiting"}</strong>
          </div>
          {isLoading ? <p className="panel-note">Requesting payment evaluation from the API.</p> : null}
          {error ? <p className="panel-error">{error}</p> : null}
          {result ? (
            <ol>
              {result.evidence.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ol>
          ) : null}
        </article>

        <article id="evidence" className="evidence-panel">
          <div className="panel-heading">
            <span>Evidence Bundle</span>
            <strong>{result?.evidence.chain ?? "HashKey ready"}</strong>
          </div>
          <code>{result?.evidence.id ?? "Waiting for API response"}</code>
          <p>
            Captures policy, invoice, vendor KYC, receipt status, and adapter mode before any wallet signature is
            requested.
          </p>
          {result ? (
            <div className="receipt-grid" aria-label="HashKey receipt adapter state">
              <span>
                Network
                <strong>{result.evidence.receipt.network}</strong>
              </span>
              <span>
                Adapter
                <strong>{result.evidence.receipt.adapterMode}</strong>
              </span>
              <span>
                On-chain status
                <strong>{result.evidence.receipt.onchainStatus}</strong>
              </span>
              <span>
                Registry
                <strong>{shortenAddress(hashkeyProof.contractAddress)}</strong>
              </span>
              <span>
                Deploy tx
                <strong>{shortenAddress(hashkeyProof.deployTxHash)}</strong>
              </span>
            </div>
          ) : null}
          {result ? (
            <a className="secondary-cta evidence-download" href={evidenceHref} download={`${result.evidence.id}.json`}>
              Export evidence JSON
            </a>
          ) : null}
        </article>
      </div>
    </section>
  );
}

function buildScenarioPayload(scenario: Scenario): {
  policy: AgentPolicy;
  invoice: Invoice;
  vendor: VendorProfile;
} {
  return {
    policy: demoPolicy,
    invoice: scenario === "allowed" ? approvedInvoice : overBudgetInvoice,
    vendor: approvedVendor
  };
}
