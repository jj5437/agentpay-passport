# AgentPay Passport

AgentPay Passport is a HashKey Chain PayFi control console for AI-agent prepared payments.

The product lets an AI agent prepare a payment intent, but keeps business policy, vendor KYC,
milestone escrow state, evidence export, and final wallet signing under human control.

## Hackathon Positioning

Most agent-payment prototypes focus on letting an agent spend money. AgentPay Passport focuses on the regulated control
layer around that payment:

- deterministic policy checks before any wallet prompt;
- vendor KYC status surfaced in the payment review flow;
- human approval before execution;
- reviewer-friendly evidence bundle export;
- real HashKey Chain Testnet deployment proof for evidence anchoring.

## Live HashKey Testnet Proof

The current project includes a deployed minimal evidence registry contract on HashKey Chain Testnet.

| Field | Value |
| --- | --- |
| Network | HashKey Chain Testnet |
| Chain ID | `133` |
| Contract | `0xfaa5505f61a61cbb4f11463d6eeb4f3393ac66ce` |
| Deploy tx | `0x6d71f1cef4b3e7007b776ebca5cd17d74992c878317ad13609803031da6920af` |
| Explorer | <https://testnet-explorer.hsk.xyz/tx/0x6d71f1cef4b3e7007b776ebca5cd17d74992c878317ad13609803031da6920af> |
| Block | `29800967` |

The contract package also includes a `recordEvidence` script for writing a payment evidence hash to the deployed
registry.

## Monorepo Layout

```text
apps/
  api/       Hono API for auth and payment evaluation
  web/       Next.js product site and live demo workspace
packages/
  contracts/ Solidity registry, HashKey config, deploy and record scripts
  db/        SQLite-backed local auth/session store
  email/     Dev email-code delivery adapter
  shared/    Policy engine, demo data, shared types
  ui/        Shared UI package placeholder
docs/
  onchain-deployment.md
  project-progress.md
```

## Demo Flow

1. Open the public product site.
2. Enter the live workspace at `/app`.
3. Use the horizontal workspace tabs:
   - `Payment Control`: allowed / blocked policy evaluation;
   - `Vendor KYC`: vendor identity and KYC state;
   - `Escrow`: milestone release sequence;
   - `Receipts`: deploy and prepared evidence records;
   - `Evidence`: HashKey registry deployment proof.
4. Export the evidence JSON from the payment evaluation panel.
5. Verify the deployed registry transaction in the HashKey testnet explorer.

## Requirements

- Node.js compatible with the repo lockfile.
- pnpm `10.12.4` or newer.

## Install

```bash
pnpm install
```

## Run Locally

Start the API:

```bash
pnpm dev:api
```

Start the web app in another terminal:

```bash
pnpm dev:web
```

Open:

```text
http://127.0.0.1:3000
http://127.0.0.1:3000/app
```

The web app defaults to the local API at `http://127.0.0.1:8787`.

## Useful Scripts

```bash
pnpm test:phase1
pnpm build
pnpm --filter @agentpay/web test
pnpm --filter @agentpay/api test
pnpm --filter @agentpay/contracts test
```

## HashKey Contract Commands

Public HashKey testnet config is already hardcoded in `packages/contracts/src/hashkey.ts`.

Deploy a new registry with a funded testnet wallet:

```bash
HASHKEY_PRIVATE_KEY=0x... pnpm --filter @agentpay/contracts deploy:hashkey
```

Record demo evidence into the already deployed registry:

```bash
HASHKEY_PRIVATE_KEY=0x... pnpm --filter @agentpay/contracts record:hashkey
```

Never commit a funded wallet private key. The deployed testnet contract address and deploy transaction are public proof
data and are intentionally committed.

## Current Status

Completed:

- public product pages;
- passwordless email-code auth flow for local demo;
- deterministic payment policy engine;
- `POST /payments/evaluate` API;
- live `/app` workspace with allowed and blocked scenarios;
- exportable evidence bundle;
- horizontal workspace tabs for lower information density;
- deployed `PaymentEvidenceRegistry` on HashKey Chain Testnet;
- tests for shared policy, API, web UI, and contracts.

Still pending:

- automatic `recordEvidence` call from the API;
- record transaction hash persistence and UI backfill;
- wallet connection for human signing;
- production KYC SBT/HSP integration;
- milestone escrow funding and release contract.

See [docs/project-progress.md](docs/project-progress.md) for the full Chinese progress tracker and
[docs/onchain-deployment.md](docs/onchain-deployment.md) for the HashKey deployment notes.
