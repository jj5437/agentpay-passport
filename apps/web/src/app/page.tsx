import { approvedInvoice, approvedVendor, demoPolicy, evaluatePaymentIntent } from "@agentpay/shared";
import { hashkeyProof, shortenAddress } from "./hashkeyProof";

const evaluation = evaluatePaymentIntent({
  policy: demoPolicy,
  invoice: approvedInvoice,
  vendor: approvedVendor,
});

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="mark" aria-hidden="true" />
          AgentPay Passport
        </a>
        <nav aria-label="Primary navigation">
          <a href="/platform">Platform</a>
          <a href="/docs">Docs</a>
          <a href="/resources">Resources</a>
          <a href="/faq">FAQ</a>
          <a className="nav-cta" href="/login">
            Login
          </a>
        </nav>
      </header>

      <section className="hero-command">
        <div className="hero-copy">
          <p className="eyebrow">HashKey-native PayFi control</p>
          <h1>
            Regulated
            <br />
            Command Center
          </h1>
          <p className="hero-text">
            Let AI agents prepare payments while businesses keep policy, KYC, escrow, and
            receipts under control on HashKey Chain.
          </p>
          <div className="cta-row">
            <a className="primary-cta" href="/register">
              Create account
            </a>
            <a className="secondary-cta" href="/app">
              Open live demo
            </a>
            <a className="secondary-cta" href={hashkeyProof.deployExplorerUrl} target="_blank" rel="noreferrer">
              Verify on explorer
            </a>
          </div>
          <div className="hero-metrics" aria-label="Demo evidence summary">
            <span>
              <strong>USDC 80</strong>
              Intent amount
            </span>
            <span>
              <strong>5 checks</strong>
              Policy gates
            </span>
            <span>
              <strong>Block {hashkeyProof.blockNumber}</strong>
              HashKey deployed
            </span>
          </div>
        </div>

        <aside className="command-console" aria-label="Regulated Command Center">
          <div className="console-rail" aria-label="Workspace navigation">
            <span className="rail-brand">AP</span>
            <a className="rail-item active" href="/app#payment">
              <span>Payment Control</span>
              <span>3</span>
            </a>
            <a className="rail-item" href="/app#kyc">
              <span>Vendor KYC</span>
              <span>2</span>
            </a>
            <a className="rail-item" href="/app#escrow">
              <span>Escrow</span>
              <span>1</span>
            </a>
            <a className="rail-item" href="/app#receipts">
              <span>Receipts</span>
              <span>8</span>
            </a>
            <a className="rail-item" href="/app#evidence">
              <span>Evidence</span>
              <span>Live</span>
            </a>
          </div>

          <div className="console-main">
            <div className="console-topline">
              <span>Payment Intent Review</span>
              <strong>{evaluation.status === "allowed" ? "Allowed" : "Blocked"}</strong>
            </div>

            <div className="invoice">
              <div className="invoice-head">
                <div>
                  <span className="label">Vendor</span>
                  <div className="vendor">{approvedVendor.name}</div>
                </div>
                <div className="amount">
                  {approvedInvoice.amount} {approvedInvoice.currency}
                </div>
              </div>
              <div className="grid2">
                <div className="field">
                  <span className="label">Service</span>
                  <span className="value">{approvedInvoice.service}</span>
                </div>
                <div className="field">
                  <span className="label">Category</span>
                  <span className="value">Creative services</span>
                </div>
                <div className="field">
                  <span className="label">KYC Gate</span>
                  <span className="value">Approved SBT read</span>
                </div>
                <div className="field">
                  <span className="label">Policy Limit</span>
                  <span className="value">
                    {demoPolicy.maxAmount} {demoPolicy.currency}
                  </span>
                </div>
              </div>
            </div>

            <div className="timeline">
              <div className="step">
                <span className="dot ok" />
                <span>Agent parsed invoice card</span>
                <span className="status">Done</span>
              </div>
              <div className="step">
                <span className="dot ok" />
                <span>KYC and category policy passed</span>
                <span className="status">Done</span>
              </div>
              <div className="step">
                <span className="dot warn" />
                <span>Buyer final signature required</span>
                <span className="status">Ready</span>
              </div>
              <div className="step">
                <span className="dot" />
                <span>Escrow release after proof</span>
                <span className="status">Next</span>
              </div>
            </div>
          </div>

          <div className="console-side">
            <section>
              <div className="panel-heading">
                <span>Agent Reasoning</span>
                <strong>{evaluation.status}</strong>
              </div>
              <div className="agentlog" style={{ marginTop: 14 }}>
                <div className="logline">
                  <strong>Invoice Card</strong>
                  <span>Amount and service match the buyer policy.</span>
                </div>
                <div className="logline">
                  <strong>KYC Check</strong>
                  <span>
                    Vendor wallet maps to approved status ({approvedVendor.kycStatus}).
                  </span>
                </div>
                <div className="logline">
                  <strong>Risk</strong>
                  <span>
                    Payment of {approvedInvoice.amount} {approvedInvoice.currency} is below
                    the {demoPolicy.maxAmount} {demoPolicy.currency} limit. Final write stays
                    human-signed.
                  </span>
                </div>
                <div className="logline">
                  <strong>Receipt</strong>
                  <span>Escrow address and tx hash will enter evidence bundle.</span>
                </div>
              </div>
            </section>

            <section className="evidence-panel">
              <div className="panel-heading">
                <span>Evidence Bundle</span>
                <strong>exportable</strong>
              </div>
              <code>intent_{approvedInvoice.id}</code>
              <p>
                Policy snapshot, KYC state, escrow state, and receipt metadata stay bundled
                for judges.
              </p>
            </section>
          </div>
        </aside>
      </section>

      <section className="judge-proof-strip" aria-label="HashKey on-chain proof">
        <div>
          <p className="eyebrow">Live HashKey proof</p>
          <h2>Deployed contract, public explorer link, reviewer-ready evidence path.</h2>
        </div>
        <dl>
          <div>
            <dt>Network</dt>
            <dd>{hashkeyProof.network}</dd>
          </div>
          <div>
            <dt>Contract</dt>
            <dd>{shortenAddress(hashkeyProof.contractAddress)}</dd>
          </div>
          <div>
            <dt>Deploy tx</dt>
            <dd>{shortenAddress(hashkeyProof.deployTxHash)}</dd>
          </div>
          <div>
            <dt>Block</dt>
            <dd>{hashkeyProof.blockNumber}</dd>
          </div>
        </dl>
        <a className="primary-cta" href={hashkeyProof.deployExplorerUrl} target="_blank" rel="noreferrer">
          Open HashKey explorer
        </a>
      </section>

      <section className="pipeline-section" aria-label="Payment authorization pipeline">
        <div className="pipeline-head">
          <p className="eyebrow">How it works</p>
          <h2>Regulated Payment Pipeline</h2>
          <p className="pipeline-sub">
            Five controlled steps between an AI agent preparing a payment and funds reaching the vendor.
            The agent never holds the keys — humans stay in control at every gate.
          </p>
        </div>
        <div className="pipeline-flow">
          {[
            { step: "01", title: "Invoice Parsed", desc: "Agent reads a structured invoice card and extracts vendor, amount, currency, and milestones." },
            { step: "02", title: "Policy Gate", desc: "Budget, category, currency, and milestone checks run deterministically before any wallet prompt." },
            { step: "03", title: "KYC Verified", desc: "Vendor trust status is read from the HashKey identity SBT adapter — no trust assumptions." },
            { step: "04", title: "Escrow Locked", desc: "Funds are locked in milestone escrow on HashKey testnet. No release without buyer signature." },
            { step: "05", title: "Receipt On-chain", desc: "Evidence bundle captures policy snapshot, KYC state, tx hash, and adapter mode for auditors." },
          ].map((item) => (
            <div key={item.step} className="pipeline-step">
              <span className="pipeline-step-num">{item.step}</span>
              <div className="pipeline-step-body">
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="hashkey-section" aria-label="Why HashKey Chain">
        <div className="hashkey-grid">
          <div className="hashkey-copy">
            <p className="eyebrow">Why HashKey Chain</p>
            <h2>Built for Regulated PayFi</h2>
            <p>
              AI agent payments need more than a smart contract — they need an identity layer,
              a compliance boundary, and an institutional-grade chain. HashKey Chain provides all three.
            </p>
            <div className="hashkey-points">
              <div className="hashkey-point">
                <span className="hk-dot hk-dot-green" />
                <div>
                  <strong>KYC-native identity</strong>
                  <span>Vendor SBT reads replace manual KYC checks. Policy gates query on-chain trust, not spreadsheets.</span>
                </div>
              </div>
              <div className="hashkey-point">
                <span className="hk-dot hk-dot-blue" />
                <div>
                  <strong>Institutional compliance</strong>
                  <span>HashKey's licensed positioning means evidence bundles map to real audit requirements.</span>
                </div>
              </div>
              <div className="hashkey-point">
                <span className="hk-dot hk-dot-accent" />
                <div>
                  <strong>PayFi infrastructure</strong>
                  <span>USDC settlement on HashKey testnet with escrow contracts designed for agent-prepared payments.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hashkey-visual">
            <div className="hashkey-card-stack">
              <div className="hk-card hk-card-1">
                <span>HashKey Chain Testnet</span>
                <strong>PaymentEvidenceRegistry</strong>
                <code>{shortenAddress(hashkeyProof.contractAddress)}</code>
              </div>
              <div className="hk-card hk-card-2">
                <span>Deploy proof</span>
                <strong>Explorer verified</strong>
                <code>{shortenAddress(hashkeyProof.deployTxHash)}</code>
              </div>
              <div className="hk-card hk-card-3">
                <span>Evidence write</span>
                <strong>recordEvidence ready</strong>
                <code>{hashkeyProof.evidenceRecordStatus}</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="comparison-section" aria-label="Product comparison">
        <div className="comparison-head">
          <p className="eyebrow">Positioning</p>
          <h2>AgentPay vs. Standard Agent Payments</h2>
          <p>Most agent payment prototypes let the agent execute directly. AgentPay Passport keeps the business in control.</p>
        </div>
        <div className="comparison-table">
          <div className="comparison-header">
            <span></span>
            <span className="col-us">AgentPay Passport</span>
            <span className="col-them">Standard Agent Pay</span>
          </div>
          {[
            ["Who signs the transaction", "Human buyer — always", "Agent wallet"],
            ["Policy enforcement", "Deterministic gate before wallet prompt", "Post-hoc or none"],
            ["KYC integration", "HashKey SBT adapter — on-chain identity", "Off-chain or manual"],
            ["Escrow", "Milestone-based, human-released", "None or agent-controlled"],
            ["Evidence bundle", "Policy + KYC + receipt + tx hash — exportable", "Transaction log only"],
            ["Audit trail", "Reviewer-ready JSON, on-chain anchored", "Not designed for auditors"],
            ["Compliance posture", "HashKey regulated PayFi", "Generic L1/L2"],
          ].map(([label, us, them]) => (
            <div key={label} className="comparison-row">
              <span className="comp-label">{label}</span>
              <span className="comp-us">{us}</span>
              <span className="comp-them">{them}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="proof-band" aria-label="Platform modules">
        <article>
          <h2>Policy Gate</h2>
          <p>Budget, category, currency, and milestone checks before any wallet signature.</p>
        </article>
        <article>
          <h2>KYC Adapter</h2>
          <p>Vendor trust status stays visible before escrow funding.</p>
        </article>
        <article>
          <h2>Evidence Bundle</h2>
          <p>Receipts, tx hashes, and adapter modes stay exportable for judges.</p>
        </article>
      </section>

      <footer className="site-footer">
        <span>Built for HashKey Chain Japan Hackathon</span>
        <div>
          <a href="/docs">Docs</a>
          <a href="/faq">FAQ</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/legal/disclaimer">Disclaimer</a>
        </div>
      </footer>
    </main>
  );
}
