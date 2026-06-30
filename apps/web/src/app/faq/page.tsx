import { hashkeyProof } from "../hashkeyProof";
import { ProductFrame } from "../components/ProductFrame";

const faqs = [
  [
    "Is this a marketplace?",
    "No. AgentPay Passport is the authorization and escrow layer for businesses that let agents prepare payments. It does not match buyers with vendors."
  ],
  [
    "Does the agent spend money automatically?",
    "No. The agent prepares the intent. A human still signs the wallet transaction. The agent never holds the private key."
  ],
  [
    "Why HashKey Chain?",
    "HashKey provides a regulated PayFi environment with KYC-native identity (SBT), institutional compliance posture, and USDC settlement on a licensed chain — exactly what agent payments need."
  ],
  [
    "What is live today?",
    "Email-code auth, local SQLite sessions, policy evaluation API, the live evaluation workspace with allowed/blocked scenario toggle, evidence bundle export, product pages, docs, and legal pages."
  ],
  [
    "How is this different from Stripe or traditional payment APIs?",
    "Stripe handles execution. AgentPay Passport handles the decision layer before execution: is this payment allowed under the buyer's policy, is the vendor KYC-approved, and what evidence is captured before funds move."
  ],
  [
    "Can an agent bypass the policy gate?",
    "No. The policy engine runs deterministically and is tested independently. A blocked invoice produces a clear reason string — there is no override path for the agent."
  ],
  [
    "Is the evidence bundle tamper-proof?",
    "The evidence bundle captures an immutable snapshot of policy, invoice, vendor KYC, and receipt state at evaluation time. The PaymentEvidenceRegistry contract anchors the evidence hash on-chain, making post-hoc modifications detectable."
  ],
  [
    "What is actually deployed on HashKey testnet?",
    `PaymentEvidenceRegistry is deployed on HashKey Chain Testnet at ${hashkeyProof.contractAddress}. The deployment transaction is ${hashkeyProof.deployTxHash}, confirmed in block ${hashkeyProof.blockNumber}.`
  ],
  [
    "What is the roadmap after the hackathon?",
    "Next steps are wallet connection for human signature flow, automatic recordEvidence writes from the API, milestone escrow smart contract, HSP/KYC SBT read integration, buyer policy management UI, and production SMTP email delivery."
  ],
];

export default function FAQPage() {
  return (
    <ProductFrame>
      <section className="content-hero compact">
        <p className="eyebrow">Product QA</p>
        <h1>FAQ</h1>
        <p>Short answers for judges, builders, and anyone comparing AgentPay with broader agent-commerce projects.</p>
      </section>
      <section className="faq-list">
        {faqs.map(([question, answer]) => (
          <article key={question}>
            <h2>{question}</h2>
            <p>{answer}</p>
          </article>
        ))}
      </section>
    </ProductFrame>
  );
}
