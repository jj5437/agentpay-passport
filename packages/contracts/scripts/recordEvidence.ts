import { createHash } from "node:crypto";
import { createWalletClient, getContract, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { compileRegistryContract } from "../src/compile";
import { loadHashKeyNetworkConfig } from "../src/env";
import { demoVendorAddress, deployedPaymentEvidenceRegistry } from "../src/hashkey";

const config = loadHashKeyNetworkConfig();
const account = privateKeyToAccount(config.privateKey);
const contractAddress = (process.env.AGENTPAY_REGISTRY_ADDRESS ??
  deployedPaymentEvidenceRegistry.contractAddress) as `0x${string}`;
const vendorAddress = (process.env.AGENTPAY_VENDOR_ADDRESS ?? demoVendorAddress) as `0x${string}`;
const intentId = process.env.AGENTPAY_INTENT_ID ?? "intent_inv_001";
const amount = BigInt(process.env.AGENTPAY_AMOUNT ?? "80");
const currency = process.env.AGENTPAY_CURRENCY ?? "USDC";
const status = process.env.AGENTPAY_STATUS ?? "prepared";
const evidenceJson = process.env.AGENTPAY_EVIDENCE_JSON ?? JSON.stringify({ intentId, amount: amount.toString(), currency, status });
const evidenceHash = `0x${createHash("sha256").update(evidenceJson).digest("hex")}` as `0x${string}`;
const compiled = compileRegistryContract();

const client = createWalletClient({
  account,
  transport: http(config.rpcUrl)
}).extend(publicActions);

const contract = getContract({
  address: contractAddress,
  abi: compiled.abi,
  client
});

const hash = await contract.write.recordEvidence([intentId, vendorAddress, amount, currency, evidenceHash, status], {
  account,
  chain: null
});
const receipt = await client.waitForTransactionReceipt({ hash });
const explorerUrl = config.explorerBaseUrl ? `${config.explorerBaseUrl.replace(/\/$/, "")}/tx/${hash}` : "";

console.log(
  JSON.stringify(
    {
      contractAddress,
      buyer: account.address,
      vendor: vendorAddress,
      intentId,
      evidenceHash,
      txHash: hash,
      explorerUrl,
      blockNumber: receipt.blockNumber.toString(),
      status
    },
    null,
    2
  )
);

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}
