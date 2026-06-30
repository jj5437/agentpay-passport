"use client";

import { approvedInvoice, approvedVendor, demoPolicy } from "@agentpay/shared";
import { useState } from "react";
import { LiveEvaluationPanel } from "../components/LiveEvaluationPanel";
import { ProductFrame } from "../components/ProductFrame";
import { hashkeyProof, shortenAddress } from "../hashkeyProof";

type WorkspaceTab = "payment" | "kyc" | "escrow" | "receipts" | "evidence";

const tabs: Array<{ id: WorkspaceTab; label: string; kicker: string }> = [
  { id: "payment", label: "Payment Control", kicker: "API review" },
  { id: "kyc", label: "Vendor KYC", kicker: "Trust layer" },
  { id: "escrow", label: "Escrow", kicker: "Milestones" },
  { id: "receipts", label: "Receipts", kicker: "Ledger" },
  { id: "evidence", label: "Evidence", kicker: "HashKey proof" }
];

const milestones = [
  { label: "Invoice submitted", status: "complete" as const, detail: "Tokyo Design Studio - USDC 80" },
  { label: "Policy gate passed", status: "complete" as const, detail: "Amount, category, KYC all approved" },
  { label: "Evidence prepared", status: "active" as const, detail: "Registry deployed - recordEvidence pending" },
  { label: "Buyer wallet signature", status: "pending" as const, detail: "Required before any on-chain payment write" },
  { label: "Escrow funding", status: "pending" as const, detail: "Future milestone contract integration" }
];

const receipts = [
  {
    id: "deploy_001",
    vendor: "AgentPay Passport",
    amount: "Registry",
    status: "on-chain",
    network: "HashKey Testnet",
    txHash: shortenAddress(hashkeyProof.deployTxHash)
  },
  {
    id: "rcpt_001",
    vendor: "Tokyo Design Studio",
    amount: "80 USDC",
    status: "prepared",
    network: "HashKey Testnet",
    txHash: "recordEvidence ready"
  },
  { id: "rcpt_003", vendor: "Kyoto AI Studio", amount: "45 USDC", status: "blocked", network: "-", txHash: "-" }
];

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("payment");

  return (
    <ProductFrame>
      <main className="workspace-shell">
        <section className="workspace-overview" aria-label="Command center overview">
          <div>
            <p className="eyebrow">Command center</p>
            <h1>Payment review workspace</h1>
            <p>
              Evaluate an agent-prepared invoice, verify policy and KYC state, then export the evidence bundle for
              HashKey testnet anchoring.
            </p>
          </div>
          <div className="workspace-summary-grid">
            <span>
              Current intent
              <strong>
                {approvedInvoice.amount} {approvedInvoice.currency}
              </strong>
            </span>
            <span>
              Policy cap
              <strong>
                {demoPolicy.maxAmount} {demoPolicy.currency}
              </strong>
            </span>
            <span>
              Vendor KYC
              <strong>{approvedVendor.kycStatus}</strong>
            </span>
            <span>
              Registry
              <strong>{shortenAddress(hashkeyProof.contractAddress)}</strong>
            </span>
          </div>
        </section>

        <nav className="workspace-tabs" aria-label="Workspace sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? "workspace-tab active" : "workspace-tab"}
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
            >
              <span>{tab.kicker}</span>
              <strong>{tab.label}</strong>
            </button>
          ))}
        </nav>

        <section className="workspace-tab-panel" aria-live="polite">
          {activeTab === "payment" ? <LiveEvaluationPanel /> : null}
          {activeTab === "kyc" ? <KycPanel /> : null}
          {activeTab === "escrow" ? <EscrowPanel /> : null}
          {activeTab === "receipts" ? <ReceiptsPanel /> : null}
          {activeTab === "evidence" ? <EvidencePanel /> : null}
        </section>
      </main>
    </ProductFrame>
  );
}

function KycPanel() {
  return (
    <section id="kyc" className="workspace-card kyc-detail-card">
      <div className="kyc-detail-head">
        <div>
          <p className="eyebrow">Vendor trust layer</p>
          <h2>Vendor KYC</h2>
        </div>
        <span className="status-badge status-ok">approved</span>
      </div>
      <div className="kyc-detail-grid">
        <div className="kyc-detail-row">
          <span>Vendor</span>
          <strong>{approvedVendor.name}</strong>
        </div>
        <div className="kyc-detail-row">
          <span>Wallet</span>
          <strong className="mono">{approvedVendor.wallet}</strong>
        </div>
        <div className="kyc-detail-row">
          <span>KYC Status</span>
          <strong>{approvedVendor.kycStatus}</strong>
        </div>
        <div className="kyc-detail-row">
          <span>SBT Source</span>
          <strong>HashKey Identity Adapter</strong>
        </div>
        <div className="kyc-detail-row">
          <span>Policy Limit</span>
          <strong>
            {demoPolicy.maxAmount} {demoPolicy.currency}
          </strong>
        </div>
        <div className="kyc-detail-row">
          <span>Last Verified</span>
          <strong>2026-06-18</strong>
        </div>
      </div>
      <p className="kyc-detail-note">
        The current demo uses a deterministic vendor trust state in the policy engine. The HashKey identity SBT adapter
        is the intended production source before escrow funding.
      </p>
    </section>
  );
}

function EscrowPanel() {
  return (
    <section id="escrow" className="workspace-card escrow-detail-card">
      <div className="escrow-detail-head">
        <div>
          <p className="eyebrow">Milestone escrow</p>
          <h2>Escrow Controller</h2>
        </div>
        <span className="status-badge status-active">in progress</span>
      </div>
      <p className="escrow-detail-sub">
        USDC 80 is policy-approved and evidence-ready. No escrow is funded until the buyer signs a future HashKey wallet
        transaction.
      </p>
      <div className="milestone-track">
        {milestones.map((m) => (
          <div key={m.label} className={`milestone-row milestone-${m.status}`}>
            <div className="milestone-dot-col">
              <span className={`milestone-dot dot-${m.status}`} />
              {m.status !== "pending" && <span className="milestone-line" />}
            </div>
            <div className="milestone-body">
              <span className="milestone-label">{m.label}</span>
              <span className="milestone-detail">{m.detail}</span>
            </div>
            <span className={`milestone-tag tag-${m.status}`}>
              {m.status === "complete" ? "Done" : m.status === "active" ? "Now" : "Next"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReceiptsPanel() {
  return (
    <section id="receipts" className="workspace-card receipts-detail-card">
      <div className="receipts-detail-head">
        <div>
          <p className="eyebrow">Payment receipts</p>
          <h2>Receipt Ledger</h2>
        </div>
        <span className="receipts-count">{receipts.length} records</span>
      </div>
      <div className="receipts-table">
        <div className="receipts-thead">
          <span>ID</span>
          <span>Vendor</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Network</span>
          <span>Tx Hash</span>
        </div>
        {receipts.map((r) => (
          <div key={r.id} className="receipts-row">
            <span className="receipt-id">{r.id}</span>
            <span>{r.vendor}</span>
            <span className="receipt-amount">{r.amount}</span>
            <span>
              <span className={`status-pill pill-${r.status === "on-chain" ? "ok" : r.status === "blocked" ? "blocked" : "pending"}`}>
                {r.status}
              </span>
            </span>
            <span className="receipt-network">{r.network}</span>
            <span className="receipt-tx mono">{r.txHash}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function EvidencePanel() {
  return (
    <div className="workspace-evidence-grid">
      <section className="workspace-card onchain-proof-card" aria-label="HashKey deployment proof">
        <div>
          <p className="eyebrow">HashKey proof</p>
          <h2>Registry deployed</h2>
          <p>PaymentEvidenceRegistry is live on HashKey Chain Testnet.</p>
        </div>
        <div className="onchain-proof-grid">
          <span>
            Contract
            <strong>{hashkeyProof.contractAddress}</strong>
          </span>
          <span>
            Deploy tx
            <strong>{hashkeyProof.deployTxHash}</strong>
          </span>
          <span>
            Block
            <strong>{hashkeyProof.blockNumber}</strong>
          </span>
          <span>
            Chain ID
            <strong>{hashkeyProof.chainId}</strong>
          </span>
        </div>
        <a className="secondary-cta evidence-download" href={hashkeyProof.deployExplorerUrl} target="_blank" rel="noreferrer">
          View deployment on explorer
        </a>
      </section>

      <section className="workspace-card review-next-card">
        <div className="panel-heading">
          <span>Next reviewer action</span>
          <strong>human-sign</strong>
        </div>
        <p>Allowed intents stop before execution. The buyer still signs the wallet transaction.</p>
        <div className="review-checklist">
          <span className="review-check done">Policy gate passed</span>
          <span className="review-check done">Vendor KYC approved</span>
          <span className="review-check active">Evidence ready to export</span>
          <span className="review-check">recordEvidence pending</span>
        </div>
      </section>
    </div>
  );
}
