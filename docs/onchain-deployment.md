# HashKey Testnet 上链指南

更新时间：2026-06-19

## 目标

当前最小真实上链闭环不是完整资金托管，而是把 AgentPay 的 payment intent / evidence hash / buyer / vendor / amount / status 写入 HashKey Chain testnet。这样评审可以看到真实交易哈希和 explorer 链接，证明项目不是只停留在本地模拟。

## 已实现的合约

合约位置：

- `packages/contracts/contracts/PaymentEvidenceRegistry.sol`

合约能力：

- `recordEvidence(intentId, vendor, amount, currency, evidenceHash, status)`
- 记录：
  - `buyer`：发起交易的钱包，也就是 `msg.sender`
  - `vendor`
  - `amount`
  - `currency`
  - `evidenceHash`
  - `intentId`
  - `status`
  - `recordedAt`
- 发出 `EvidenceRecorded` event
- 同一个 `evidenceHash` 只能记录一次

## 环境变量

HashKey Chain Testnet 的公开配置已经写死在项目里，不需要评委自行查找：

- Network Name: `HashKey Chain Testnet`
- Chain ID: `133`
- RPC: `https://testnet.hsk.xyz`
- Explorer: `https://testnet-explorer.hsk.xyz`
- Faucet: `https://faucet.hsk.xyz`
- Native token: `HSK`

配置位置：

- `packages/contracts/src/hashkey.ts`

唯一不能写死的是部署钱包私钥。公开仓库里硬编码私钥会让任何人都能转走测试币或冒充部署者。部署时请在本地创建一个只用于 testnet 的临时钱包，并在运行命令前设置：

```bash
HASHKEY_PRIVATE_KEY=0x... pnpm --filter @agentpay/contracts deploy:hashkey
```

记录 evidence 时，demo vendor 地址也已内置为 `0x1111111111111111111111111111111111111111`。如果要覆盖 vendor 地址，可以传 `AGENTPAY_VENDOR_ADDRESS=0x...`。

## 部署命令

```bash
HASHKEY_PRIVATE_KEY=0x... pnpm --filter @agentpay/contracts deploy:hashkey
```

成功后会输出：

- `contractAddress`
- `deployer`
- `txHash`
- `explorerUrl`
- `blockNumber`

当前项目已部署一份 registry 到 HashKey Chain Testnet：

- Contract: `0xfaa5505f61a61cbb4f11463d6eeb4f3393ac66ce`
- Deployer: `0xc62B5278C9E918B7C6171a13f78192e0fd00780b`
- Deploy tx: `0x6d71f1cef4b3e7007b776ebca5cd17d74992c878317ad13609803031da6920af`
- Explorer: `https://testnet-explorer.hsk.xyz/tx/0x6d71f1cef4b3e7007b776ebca5cd17d74992c878317ad13609803031da6920af`
- Block: `29800967`

配置位置：

- `packages/contracts/src/hashkey.ts`

## 记录 evidence

```bash
HASHKEY_PRIVATE_KEY=0x... pnpm --filter @agentpay/contracts record:hashkey
```

默认会写入已部署的 `PaymentEvidenceRegistry`。如果需要覆盖合约地址，可以传：

```bash
HASHKEY_PRIVATE_KEY=0x... AGENTPAY_REGISTRY_ADDRESS=0x... pnpm --filter @agentpay/contracts record:hashkey
```

成功后会输出：

- `contractAddress`
- `buyer`
- `vendor`
- `intentId`
- `evidenceHash`
- `txHash`
- `explorerUrl`
- `blockNumber`
- `status`

这些字段应回填到 AgentPay evidence bundle 的 receipt 中。

## 当前限制

- 这个版本只做 evidence registry，不托管资金。
- 还没有 wallet connect UI。
- 还没有自动把 txHash 回写到 API 数据库。
- 还没有真实 HSP / KYC SBT read。

## 下一步

1. 用当前已部署 registry 调用 `recordEvidence`。
2. 把真实 `txHash`、`explorerUrl` 回填到 `/app` evidence UI。
3. 录屏展示 explorer 中的真实部署交易和 evidence 记录交易。
