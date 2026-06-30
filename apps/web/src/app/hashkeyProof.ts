export const hashkeyProof = {
  network: "HashKey Chain Testnet",
  chainId: "133",
  contractName: "PaymentEvidenceRegistry",
  contractAddress: "0xfaa5505f61a61cbb4f11463d6eeb4f3393ac66ce",
  deployer: "0xc62B5278C9E918B7C6171a13f78192e0fd00780b",
  deployTxHash: "0x6d71f1cef4b3e7007b776ebca5cd17d74992c878317ad13609803031da6920af",
  deployExplorerUrl:
    "https://testnet-explorer.hsk.xyz/tx/0x6d71f1cef4b3e7007b776ebca5cd17d74992c878317ad13609803031da6920af",
  blockNumber: "29800967",
  evidenceRecordStatus: "ready_to_record"
};

export function shortenAddress(value: string): string {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}
