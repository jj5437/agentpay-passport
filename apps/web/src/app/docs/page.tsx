import { ProductFrame } from "../components/ProductFrame";
import { hashkeyProof } from "../hashkeyProof";

export default function DocsPage() {
  return (
    <ProductFrame>
      <section className="content-hero compact">
        <p className="eyebrow">Builder docs</p>
        <h1>Documentation</h1>
        <p>
          A compact implementation guide for reviewers and developers who want to understand the AgentPay control
          flow without reading the entire codebase.
        </p>
      </section>
      <section className="docs-layout">
        <aside>
          <a href="#flow">Payment flow</a>
          <a href="#intent">Payment Intent Card</a>
          <a href="#evaluate">POST /payments/evaluate</a>
          <a href="#policy">Policy evaluation</a>
          <a href="#evidence">Evidence bundle</a>
          <a href="#sequence">Sequence diagram</a>
        </aside>
        <article>
          <h2 id="flow">Payment Flow</h2>
          <p>
            The control plane has five states: <strong>invoice parsed</strong> → <strong>policy evaluated</strong> →
            <strong> KYC verified</strong> → <strong>escrow locked</strong> → <strong>receipt on-chain</strong>.
            The agent operates up to the policy gate. After that, only a human buyer can advance the state.
          </p>

          <h2 id="intent">Payment Intent Card</h2>
          <p>
            The agent reads a structured invoice, produces a payment intent, and stops before execution until the buyer
            signs.
          </p>
          <pre>{`// Payment Intent — produced by the agent
{
  "id": "intent_inv_001",
  "policyId": "pol_buyer_01",
  "invoiceId": "inv_001",
  "vendorWallet": "0x1111111111111111111111111111111111111111",
  "amount": 80,
  "currency": "USDC",
  "milestones": ["draft", "final-delivery"]
}`}</pre>

          <h2 id="evaluate">POST /payments/evaluate</h2>
          <p>Send a policy, invoice, and vendor object. Receive a deterministic evaluation and an exportable evidence bundle.</p>

          <div className="docs-label-tag">Request</div>
          <pre>{`POST /payments/evaluate
Content-Type: application/json

{
  "policy": {
    "id": "pol_buyer_01",
    "buyerName": "Acme Corp",
    "maxAmount": 100,
    "currency": "USDC",
    "allowedCategories": ["creative-services", "dev-tools"],
    "requireKyc": true,
    "milestones": ["draft", "final-delivery"],
    "expiresAt": "2026-07-01T00:00:00Z"
  },
  "invoice": {
    "id": "inv_001",
    "vendorId": "v_tokyo_01",
    "vendorName": "Tokyo Design Studio",
    "category": "creative-services",
    "service": "Brand identity refresh",
    "amount": 80,
    "currency": "USDC",
    "milestones": ["draft", "final-delivery"]
  },
  "vendor": {
    "id": "v_tokyo_01",
    "name": "Tokyo Design Studio",
    "wallet": "0x1111111111111111111111111111111111111111",
    "kycStatus": "approved"
  }
}`}</pre>

          <div className="docs-label-tag">Response — allowed</div>
          <pre>{`{
  "ok": true,
  "evaluation": {
    "status": "allowed",
    "reasons": ["Vendor KYC approved"],
    "paymentIntent": {
      "id": "intent_inv_001",
      "policyId": "pol_buyer_01",
      "invoiceId": "inv_001",
      "vendorWallet": "0x1111111111111111111111111111111111111111",
      "amount": 80,
      "currency": "USDC",
      "milestones": ["draft", "final-delivery"]
    }
  },
  "evidence": {
    "id": "evidence_intent_inv_001",
    "createdAt": "2026-06-19T08:31:00.000Z",
    "adapterMode": "local-policy-engine",
    "chain": "HashKey Chain Testnet",
    "receipt": {
      "status": "prepared",
      "network": "HashKey Chain Testnet",
      "adapterMode": "hashkey-testnet-adapter",
      "onchainStatus": "ready_for_signature",
      "paymentIntentId": "intent_inv_001",
      "txHash": null,
      "explorerUrl": null,
      "escrowContract": null
    }
  }
}`}</pre>

          <div className="docs-label-tag">Response — blocked (over budget)</div>
          <pre>{`{
  "ok": true,
  "evaluation": {
    "status": "blocked",
    "reasons": [
      "Invoice amount 250 USDC exceeds policy limit 100 USDC"
    ],
    "paymentIntent": { ... }
  },
  "evidence": {
    "receipt": {
      "status": "blocked",
      "onchainStatus": "blocked_before_signature",
      "txHash": null
    }
  }
}`}</pre>

          <h2 id="policy">Policy evaluation</h2>
          <p>
            Policy checks run before wallet signing. The result is deterministic and testable.
            The engine evaluates five constraints in order:
          </p>
          <div className="docs-policy-checks">
            <span><strong>1.</strong> Amount ≤ policy maxAmount</span>
            <span><strong>2.</strong> Invoice currency == policy currency</span>
            <span><strong>3.</strong> Invoice category ∈ policy allowedCategories</span>
            <span><strong>4.</strong> All milestones ∈ policy milestones</span>
            <span><strong>5.</strong> Vendor KYC approved (if policy.requireKyc)</span>
          </div>

          <h2 id="evidence">Evidence Bundle</h2>
          <p>
            Every accepted intent keeps policy, KYC, escrow, and receipt state in one reviewer-friendly object.
            The bundle is exportable as a JSON file and is designed for on-chain anchoring via the PaymentEvidenceRegistry contract.
          </p>
          <div className="docs-label-tag">HashKey deployment proof</div>
          <pre>{`Network: ${hashkeyProof.network}
Chain ID: ${hashkeyProof.chainId}
Contract: ${hashkeyProof.contractAddress}
Deploy tx: ${hashkeyProof.deployTxHash}
Explorer: ${hashkeyProof.deployExplorerUrl}
Block: ${hashkeyProof.blockNumber}`}</pre>
          <pre>{`// Evidence Bundle — fields
{
  "id": "evidence_intent_inv_001",
  "createdAt": "...",
  "adapterMode": "local-policy-engine",
  "chain": "HashKey Chain Testnet",
  "policySnapshot": { ... },
  "invoiceSnapshot": { ... },
  "vendorSnapshot": { ... },
  "reasons": [...],
  "receipt": {
    "status": "prepared",
    "network": "HashKey Chain Testnet",
    "adapterMode": "hashkey-testnet-adapter",
    "onchainStatus": "ready_for_signature",
    "txHash": null,
    "explorerUrl": null,
    "escrowContract": null
  }
}`}</pre>

          <h2 id="sequence">Sequence Diagram</h2>
          <p>The full payment authorization sequence from invoice submission to receipt anchoring:</p>
          <pre className="docs-ascii">{`Invoice ──► Agent ──► Policy Engine ──► Evidence Bundle
                       │
                       ├─ amount check
                       ├─ currency check
                       ├─ category check
                       ├─ milestone check
                       └─ KYC check (HashKey SBT)
                                     │
                                     ▼
                               Escrow Locked
                                     │
                                     ▼
                          Buyer signs release
                                     │
                                     ▼
                       PaymentEvidenceRegistry
                         (on-chain anchoring)`}</pre>
        </article>
      </section>
    </ProductFrame>
  );
}
