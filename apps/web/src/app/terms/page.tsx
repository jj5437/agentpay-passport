import { LegalPage } from "../components/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" version="2026-06-19">
      <p>
        AgentPay Passport is a hackathon prototype for AI agent payment authorization, policy review, and escrow
        evidence on HashKey Chain testnet.
      </p>
      <p>
        The service does not provide financial, legal, tax, investment, or compliance advice. Users remain responsible
        for reviewing wallet signatures and transaction details.
      </p>
      <p>
        Users may not use the service for fraud, sanctions evasion, money laundering, system abuse, spam, or activity
        that violates applicable law.
      </p>
    </LegalPage>
  );
}
