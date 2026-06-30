import { describe, expect, it } from "vitest";
import { demoVendorAddress, deployedPaymentEvidenceRegistry, hashkeyTestnet } from "../src/hashkey";

describe("HashKey public testnet config", () => {
  it("ships the public testnet configuration reviewers need", () => {
    expect(hashkeyTestnet).toMatchObject({
      name: "HashKey Chain Testnet",
      chainId: 133,
      rpcUrl: "https://testnet.hsk.xyz",
      explorerBaseUrl: "https://testnet-explorer.hsk.xyz",
      faucetUrl: "https://faucet.hsk.xyz",
      nativeCurrency: {
        symbol: "HSK",
        decimals: 18
      }
    });
    expect(demoVendorAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
  });

  it("ships the deployed registry contract proof on HashKey testnet", () => {
    expect(deployedPaymentEvidenceRegistry).toMatchObject({
      contractName: "PaymentEvidenceRegistry",
      contractAddress: "0xfaa5505f61a61cbb4f11463d6eeb4f3393ac66ce",
      deployer: "0xc62B5278C9E918B7C6171a13f78192e0fd00780b",
      txHash: "0x6d71f1cef4b3e7007b776ebca5cd17d74992c878317ad13609803031da6920af",
      explorerUrl:
        "https://testnet-explorer.hsk.xyz/tx/0x6d71f1cef4b3e7007b776ebca5cd17d74992c878317ad13609803031da6920af",
      blockNumber: 29800967
    });
  });
});
