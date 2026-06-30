import { createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { compileRegistryContract } from "../src/compile";
import { loadHashKeyNetworkConfig } from "../src/env";

const config = loadHashKeyNetworkConfig();
const account = privateKeyToAccount(config.privateKey);
const compiled = compileRegistryContract();

const client = createWalletClient({
  account,
  transport: http(config.rpcUrl)
}).extend(publicActions);

const hash = await client.deployContract({
  abi: compiled.abi,
  bytecode: compiled.bytecode,
  account,
  chain: null
});

const receipt = await client.waitForTransactionReceipt({ hash });
const explorerUrl = config.explorerBaseUrl ? `${config.explorerBaseUrl.replace(/\/$/, "")}/tx/${hash}` : "";

console.log(
  JSON.stringify(
    {
      contractName: compiled.contractName,
      contractAddress: receipt.contractAddress,
      deployer: account.address,
      txHash: hash,
      explorerUrl,
      blockNumber: receipt.blockNumber.toString()
    },
    null,
    2
  )
);
