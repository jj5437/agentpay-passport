# AgentPay Passport 项目进度跟踪

更新时间：2026-06-30

## 拿奖目标

AgentPay Passport 是一个面向 HashKey Chain 黑客松的受监管 AI Agent 支付原型。它最强的参赛角度不是做一个普通 checkout，而是做一个可审计的 PayFi 控制台：AI Agent 可以准备支付，但策略限制、KYC 状态、里程碑托管、收据证据和最终钱包签名都必须保持透明、可追踪，并由人类最终控制。

## 已完成

### 产品与演示界面

- 已有 HashKey-native PayFi 定位的公开首页。
- 已有 `/app` 产品工作台，展示 Payment Control、Vendor KYC、Escrow、Receipts、Evidence 等模块。
- 已有公开页面：docs、platform、FAQ、resources、privacy、terms、disclaimer。
- 已有无密码注册/登录页面，并包含 terms/privacy 勾选同意 UI。
- 已有首页控制台的响应式布局回归测试。
- `/app` 工作台已接入 live evaluation panel，会调用后端 `POST /payments/evaluate`。
- `/app` 已支持 allowed scenario / blocked scenario 切换，方便评审直观看到 policy enforcement。
- `/app` 已支持导出当前 evidence bundle JSON。
- 首页主 CTA 已改为公开 live demo 入口，评委可以直接进入 `/app`，不需要先登录。
- 首页已新增 HashKey on-chain proof 区块，显式展示真实部署网络、合约地址、部署交易、区块号和 explorer 链接。
- `/app` 已新增 HashKey deployment proof 卡片，展示真实 `PaymentEvidenceRegistry` 合约地址、deploy tx、block 和 chain id。
- `/app` evidence 面板已显式展示 HashKey receipt adapter 与已部署 registry：
  - `network: HashKey Chain Testnet`
  - `adapterMode: hashkey-testnet-adapter`
  - `onchainStatus: ready_for_signature` 或 `blocked_before_signature`
  - `registry: 0xfaa5505f61a61cbb4f11463d6eeb4f3393ac66ce`
  - `deployTx: 0x6d71f1cef4b3e7007b776ebca5cd17d74992c878317ad13609803031da6920af`
- FAQ、Platform、Docs 已同步真实部署状态，避免仍显示 pending deployment 的旧文案。

### 后端与登录认证

- 已有 Hono API 和 `/health` 健康检查接口。
- 已有邮箱验证码登录认证接口：
  - `POST /auth/request-code`
  - `POST /auth/verify-code`
  - `GET /auth/session`
  - `POST /auth/logout`
- 已有 SQLite 持久化的 users、email_codes、sessions。
- 开发模式下，如果没有 SMTP 配置，会直接返回可见验证码，方便本地演示。
- 已有 HttpOnly session cookie 的创建、读取和注销流程。

### 支付策略核心

- 已有共享 policy engine，可以检查：
  - invoice amount 是否超过 policy limit；
  - currency 是否匹配；
  - invoice category 是否被允许；
  - milestones 是否被允许；
  - vendor KYC 是否满足策略要求。
- 已有 demo data：
  - approved vendor；
  - missing-KYC vendor；
  - approved invoice；
  - over-budget invoice。
- 已有支付评估 API：
  - `POST /payments/evaluate`
  - 返回确定性的 `evaluation`；
  - 返回适合评审查看的 `evidence` bundle；
  - allowed intent 的 receipt 状态为 `prepared`；
  - blocked intent 的 receipt 状态为 `blocked`。
- evidence receipt 已包含 HashKey testnet-ready adapter stub 字段：
  - `network`
  - `adapterMode`
  - `onchainStatus`
  - `txHash`
  - `explorerUrl`
  - `escrowContract`

### 合约与上链准备

- 已新增 `@agentpay/contracts` workspace 包。
- 已新增最小上链证明合约：`PaymentEvidenceRegistry`。
- 合约支持把 payment intent / vendor / amount / currency / evidence hash / status 写入 EVM 链。
- 已新增 HashKey testnet 部署脚本：`pnpm --filter @agentpay/contracts deploy:hashkey`。
- 已新增 evidence 写链脚本：`pnpm --filter @agentpay/contracts record:hashkey`。
- 已新增上链说明文档：`docs/onchain-deployment.md`。
- HashKey Chain Testnet 公共配置已写死在项目里：
  - Chain ID: `133`
  - RPC: `https://testnet.hsk.xyz`
  - Explorer: `https://testnet-explorer.hsk.xyz`
  - Faucet: `https://faucet.hsk.xyz`
- `PaymentEvidenceRegistry` 已部署到 HashKey Chain Testnet：
  - Contract: `0xfaa5505f61a61cbb4f11463d6eeb4f3393ac66ce`
  - Deployer: `0xc62B5278C9E918B7C6171a13f78192e0fd00780b`
  - Deploy tx: `0x6d71f1cef4b3e7007b776ebca5cd17d74992c878317ad13609803031da6920af`
  - Explorer: `https://testnet-explorer.hsk.xyz/tx/0x6d71f1cef4b3e7007b776ebca5cd17d74992c878317ad13609803031da6920af`
  - Block: `29800967`

### 测试覆盖

- 已有 shared policy engine 测试。
- 已有 contracts 编译测试，覆盖 Solidity ABI、bytecode、`recordEvidence` 和 `EvidenceRecorded`。
- 已有 API health、auth、payment-evaluation 测试。
- 已有 web public pages 和 layout regression 测试。
- 已有 `/app` live evaluation panel 测试，覆盖 API response 渲染、blocked scenario 切换和 HashKey receipt adapter stub 展示。
- 当前阶段主要测试命令：`pnpm test:phase1`。

## 进行中

- 在真正接入合约前，保持 HashKey Chain 集成边界清晰，避免把演示逻辑和链上逻辑混在一起。
- 准备调用已部署 registry 的 `recordEvidence`，生成真实 evidence 记录交易。
- 准备最终评审提交材料和公开部署验证。

## 尚未完成

### 对拿奖最关键的缺口

- 还没有真实 `recordEvidence` transaction hash / explorer URL。
- 还缺完整的评审提交材料：
  - 最终版 README walkthrough；
  - demo script；
  - API examples；
  - screenshots 或 recorded evidence。
- 还没有完成 web/API 的公开部署验证。

### Blockchain / HashKey Chain 工作

- 还没有 testnet wallet connection。
- 已有最小 evidence registry 合约，但还没有 milestone escrow smart contract 或资金托管 adapter。
- 还没有 HSP / KYC SBT read integration。
- 还没有自动从 API 触发 `recordEvidence` 并持久化 evidence record tx。
- evidence receipt 里还没有自动回写 recordEvidence explorer link。

### 产品硬化工作

- buyer policies、vendors、invoices、evaluations 还没有完整业务持久化。
- 还没有 buyer/vendor 角色化导航。
- 生产环境还没有真正 SMTP 邮件发送。
- API request validation 还可以继续加强，并抽出 typed API client。
- auth code request 还没有 rate limiting。
- evidence bundle 还没有审计日志存储。

## 推荐下一步开发顺序

1. 用 demo evidence 调用 `recordEvidence`，拿到真实 tx hash 和 explorer URL。
2. 把真实 `contractAddress`、`txHash`、`explorerUrl` 回填到 `/app` evidence UI。
3. 录屏展示 HashKey explorer 中的部署交易和 evidence 记录交易。
4. 补最终版 README walkthrough、demo script、API examples、screenshots 或 recorded evidence。
5. 接 testnet wallet connection，让 allowed intent 能进入 human signature flow。
6. 后续再加 milestone escrow smart contract 或资金托管 adapter。

## 当前验收证据

- `pnpm test:phase1` 已在 2026-06-30 通过，18 个测试全绿。
- `pnpm build` 已在 2026-06-30 通过。
- `pnpm --filter @agentpay/web test` 已在 2026-06-30 通过，覆盖 public pages、layout regression、live evaluation panel。
- `pnpm --filter @agentpay/contracts test` 已在 2026-06-30 通过，确认 `PaymentEvidenceRegistry` 可编译，并覆盖 HashKey testnet 硬编码配置和真实部署证明。

## Demo 故事线

1. Buyer 定义一条小额 USDC vendor payment policy。
2. Vendor 提交结构化 invoice。
3. AI Agent 准备 payment intent，但不能直接执行支付。
4. Policy 与 KYC checks 产出透明决策。
5. Evidence bundle 捕获 policy、invoice、vendor、receipt、adapter mode。
6. 评委可以从首页或 `/app` 打开 HashKey explorer，验证 `PaymentEvidenceRegistry` 真实部署交易。
7. 后续 HashKey Chain 集成会补上 wallet signature、escrow funding 和自动 recordEvidence explorer-backed receipts。
