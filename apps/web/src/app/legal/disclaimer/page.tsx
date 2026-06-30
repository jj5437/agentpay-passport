import { LegalPage } from "../../components/LegalPage";

export default function DisclaimerPage() {
  return (
    <LegalPage title="Prototype Disclaimer" version="2026-06-19">
      <p>
        AgentPay Passport is not a regulated financial product, broker, custodian, payment institution, legal advisor,
        tax advisor, or compliance provider.
      </p>
      <p>
        Demo flows may use HashKey Chain testnet contracts, fixture KYC data, mock HSP adapters, and sandbox evidence.
        Testnet assets do not represent real money.
      </p>
      <p>
        AI agent reasoning is explanatory. Deterministic policy checks and human wallet signatures remain required for
        payment execution.
      </p>
    </LegalPage>
  );
}
