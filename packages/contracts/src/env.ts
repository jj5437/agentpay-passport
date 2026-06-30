import { hashkeyTestnet } from "./hashkey";

export type HashKeyNetworkConfig = {
  rpcUrl: string;
  privateKey: `0x${string}`;
  explorerBaseUrl: string;
  chainId: number;
};

export function loadHashKeyNetworkConfig(env = process.env): HashKeyNetworkConfig {
  const rpcUrl = env.HASHKEY_RPC_URL ?? hashkeyTestnet.rpcUrl;
  const privateKey = env.HASHKEY_PRIVATE_KEY;
  const explorerBaseUrl = env.HASHKEY_EXPLORER_BASE_URL ?? hashkeyTestnet.explorerBaseUrl;

  if (!privateKey || !/^0x[0-9a-fA-F]{64}$/.test(privateKey)) {
    throw new Error("HASHKEY_PRIVATE_KEY must be a 0x-prefixed 32-byte private key");
  }

  return {
    rpcUrl,
    privateKey: privateKey as `0x${string}`,
    explorerBaseUrl,
    chainId: hashkeyTestnet.chainId
  };
}
