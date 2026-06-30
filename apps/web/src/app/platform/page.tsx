import { ProductFrame } from "../components/ProductFrame";
import { hashkeyProof, shortenAddress } from "../hashkeyProof";

const modules = [
  {
    title: "Policy Engine",
    status: "live" as const,
    desc: "Budget, asset, vendor category, proof requirement, and milestone constraints before a wallet prompt.",
    flow: "Invoice → Policy checks → allowed | blocked",
    hashkey: "Runs before any on-chain interaction. Results feed into the evidence bundle for anchoring.",
  },
  {
    title: "KYC Adapter",
    status: "live" as const,
    desc: "A narrow adapter interface for HashKey-style identity, allowlists, and future HSP signals.",
    flow: "Vendor wallet → SBT read → kycStatus → policy gate",
    hashkey: "Reads HashKey identity SBT. Currently mocked for testnet; real adapter pending HSP integration.",
  },
  {
    title: "Escrow Controller",
    status: "stub" as const,
    desc: "Human-signed funding and release checkpoints with agent-prepared payloads.",
    flow: "Allowed intent → escrow lock → milestone proof → buyer release signature",
    hashkey: "Designed for HashKey testnet escrow contract. Currently simulated in the UI milestone tracker.",
  },
  {
    title: "Receipt Ledger",
    status: "live" as const,
    desc: "Explorer links, adapter modes, policy snapshots, and reviewer-ready evidence bundles.",
    flow: "Evidence bundle → PaymentEvidenceRegistry → tx hash → explorer URL",
    hashkey: `PaymentEvidenceRegistry is deployed at ${shortenAddress(hashkeyProof.contractAddress)} with deploy tx ${shortenAddress(hashkeyProof.deployTxHash)}.`,
  },
];

export default function PlatformPage() {
  return (
    <ProductFrame>
      <section className="content-hero compact">
        <p className="eyebrow">Product architecture</p>
        <h1>Platform</h1>
        <p>
          AgentPay Passport is a control plane for AI prepared payments. The product narrows the problem to policy,
          KYC, escrow, receipt, and reviewable evidence.
        </p>
      </section>
      <section className="module-grid-v2">
        {modules.map((m) => (
          <article key={m.title} className="module-card-v2">
            <div className="module-card-head">
              <h2>{m.title}</h2>
              <span className={`status-badge status-${m.status === "live" ? "ok" : "active"}`}>
                {m.status === "live" ? "live" : "stub"}
              </span>
            </div>
            <p>{m.desc}</p>
            <div className="module-data-flow">
              <span>Data flow</span>
              <code>{m.flow}</code>
            </div>
            <div className="module-hashkey-point">
              <span>HashKey integration</span>
              <span>{m.hashkey}</span>
            </div>
          </article>
        ))}
      </section>
    </ProductFrame>
  );
}
