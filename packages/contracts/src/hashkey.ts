export const hashkeyTestnet = {
  name: "HashKey Chain Testnet",
  chainId: 133,
  rpcUrl: "https://testnet.hsk.xyz",
  explorerBaseUrl: "https://testnet-explorer.hsk.xyz",
  faucetUrl: "https://faucet.hsk.xyz",
  nativeCurrency: {
    name: "HSK",
    symbol: "HSK",
    decimals: 18
  }
} as const;

export const demoVendorAddress = "0x1111111111111111111111111111111111111111" as const;

export const deployedPaymentEvidenceRegistry = {
  contractName: "PaymentEvidenceRegistry",
  contractAddress: "0xfaa5505f61a61cbb4f11463d6eeb4f3393ac66ce",
  deployer: "0xc62B5278C9E918B7C6171a13f78192e0fd00780b",
  txHash: "0x6d71f1cef4b3e7007b776ebca5cd17d74992c878317ad13609803031da6920af",
  explorerUrl:
    "https://testnet-explorer.hsk.xyz/tx/0x6d71f1cef4b3e7007b776ebca5cd17d74992c878317ad13609803031da6920af",
  blockNumber: 29800967
} as const;
