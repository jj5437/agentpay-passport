import { LegalPage } from "../components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" version="2026-06-19">
      <p>
        AgentPay Passport may collect email addresses, password hashes, session metadata, accepted legal versions,
        wallet addresses, demo payment intents, and testnet transaction metadata.
      </p>
      <p>
        Data is used to operate accounts, send verification emails, protect sessions, render the product workspace, and
        prepare hackathon evidence.
      </p>
      <p>
        Wallet addresses and transaction hashes may be public on blockchain explorers. Non-chain account data can be
        deleted on request during the prototype period.
      </p>
    </LegalPage>
  );
}
