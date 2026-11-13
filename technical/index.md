---
title: Architecture
description: "Principal's twelve Soroban contracts, shared and per market, how one market's contracts call each other, and how MarketFactory creates a market."
order: 1
---

Principal runs as twelve Soroban smart contracts on Stellar, plus one Rust library, `principal_compliance`, built into each market's contracts. Five contracts are shared by every market; each market, meaning one underlying asset and one maturity, has seven of its own. This page groups the contracts by role, follows one market's calls from deposit to trade, and explains how a market is created. It describes the contracts deployed on Stellar Testnet.

## Shared and per-market contracts

![Principal's contracts in two groups: shared infrastructure (OracleAdapter, Permissioning, RiskControl, Router, MarketFactory, and the principal_compliance library) and the seven contracts of one market](/images/contract-layers.svg)

**Shared infrastructure**, used by every market:

| Contract | Role |
|---|---|
| `OracleAdapter` | The reference value (USDC per unit of the underlying), its timestamp and the policy that guards it: a freshness window, a deviation cap, optional value bounds, a primary and an optional fallback source, and the last update it rejected. See [Oracle](/how-it-works/oracle). |
| `Permissioning` | An allow-list every account must be on, checked on every operation that moves an account's positions (PT and YT also have a list per token). It adds to the issuer's own controls: it can only narrow who may use a market, never widen it. |
| `RiskControl` | The protocol pause and the deposit circuit breaker. |
| `Router` | One-transaction user flows for every registered market, including the one-call flows that start or end in the underlying and the flash Buy YT; holds no funds. |
| `MarketFactory` | Deploys and wires a new market's contracts. |

The `Permissioning` admin, on Testnet the test asset's issuer account, keeps the list; the app's "Get test tokens" adds your account. `principal_compliance` is the library each market contract uses to ask the underlying asset two questions: may this account hold you, and who is your issuer authority?

**One market** has seven contracts. Four turn the underlying into SY, PT and YT and handle fees and recovery:

| Contract | Role |
|---|---|
| `SYWrapper` | Wraps the underlying into SY shares and back. |
| `PrincipalManager` | Splits SY into PT + YT, recombines them, settles and redeems at maturity, holds the tokenization and YT fees. |
| `MarketConfig` | Maturity, fees and the protocol/creator fee split. |
| `RecoveryEscrow` | Compliance recovery of SY, PT, YT and LP positions. |

The other three are what users hold and trade: `PTToken` and `YTToken` (SEP-41-style tokens, YT with its `1/rate` yield index) and `MarketPool`, the PT/SY yield-curve AMM with its LP positions. A second maturity on the same asset is a second set of seven, with its own SY.

Addresses change with each deployment, so these pages do not list them. The Testnet addresses of the shared contracts and the first market are listed in the app's network manifest, `config/manifests/testnet.json` on the `testnet` branch of the public `principal-Protocol-org/dapp` repository; the app adds markets created later from on-chain events.

## One market's wiring

**Deposit.** `SYWrapper.deposit` checks its pause, your compliance (authorized on the underlying, allowed by `Permissioning`) and the per-address deposit cap. It reports the amount to `RiskControl.check_deposit`, pulls the underlying from your account and credits SY shares.

**Split.** `Router.wrap_and_mint` deposits through `SYWrapper`, then calls `PrincipalManager.mint` in the same transaction. `PrincipalManager` checks that the market is open, the oracle fresh and you compliant, and reports to `RiskControl`. It keeps the tokenization fee, values the rest of the SY at the oracle's reference value, takes custody of the SY, brings `YTToken`'s yield index up to date, and mints the same amount of PT and YT to you. Only `PrincipalManager` can mint PT and YT.

**Trade.** `Router.swap_sy_for_pt` calls `MarketPool.swap_sy_for_pt`. The pool checks that it is open and you compliant, reads a fresh oracle value and the current swap fee from `MarketConfig`, prices the trade on its curve, then moves your SY in and the PT out. To buy YT, the app calls `Router.flash_mint_yt` (paid in SY) or `Router.flash_mint_yt_from_underlying` (paid in USDY), which call `MarketPool.flash_mint_yt`: the pool mints PT + YT from its own SY, sells the PT to itself, refunds what you did not spend and sends you the YT. You pay only the net cost, within the `max_net_cost` you signed (flash-mint). `Router.swap_sy_for_yt` still exists: it mints from your own SY and sells the PT into the pool. To sell YT, `MarketPool.swap_yt_for_sy` recombines your YT with the pool's own PT through `PrincipalManager` and pays you the difference (flash-redeem).

At maturity, anyone can call `PrincipalManager.settle_all` to freeze one settlement rate; `Router.redeem_at_maturity` then redeems through `PrincipalManager.redeem`.

The `Router` holds no funds and always acts as you, so every contract checks compliance against your account. In the flash, the mint leg runs as the pool, so `PrincipalManager` checks the pool there; you are checked by the pool and by the token transfers. The `Router` routes only to markets its admin has registered and checked.

The one-call flows that end in the underlying withdraw only what the call itself produced: `SYWrapper.withdraw_gained` and `MarketPool.swap_gained_pt_for_sy` act on the gain over a balance the `Router` reads just before the step, so SY or PT already in your wallet is neither used nor blocked. See [Pricing and the AMM](/how-it-works/pricing-and-amm) for the flash and [Quick actions](/using-the-app/quick-actions) for the app side.

## How the app talks to the contracts

Your transactions go from your browser to the network: no server signs, relays or changes them. In your browser, the app reads contract state by simulating read-only calls over Soroban RPC (and balances and trustlines from Horizon). For an action, it builds the transaction, has Soroban RPC prepare it, asks your Varial wallet (formerly Freighter) to sign, checks that the signed transaction is the one it showed you, and submits it through Soroban RPC.

A plain deposit calls `SYWrapper.deposit` directly; every other trading action goes through the `Router`, and on Testnet each is one `Router` call, so one signature, whether you pay in USDY or SY (Keep YT needs USDY): buying and selling PT, buying and selling YT (the flash), Keep YT and LP only, and withdrawing liquidity before maturity to USDY. The app plans a one-call route whenever the network manifest lists the `Router` function. Two transactions remain for recombining to USDY, for withdrawing liquidity to SY (remove, then sell the PT) and for withdrawing liquidity after maturity (two to SY, three to USDY).

The manager view and the market wizard are the exception: they call the market's contracts, the asset contract, `Permissioning`, `RiskControl`, the `Router`'s `register_market` and `MarketFactory` directly, each signed by the role holder. See [Manage and create markets](/using-the-app/manage-markets).

The app's server keeps a database. It holds the list of markets the app shows: those in the manifest, plus markets found from the `Router`'s and the factory's events or submitted to `POST /api/markets` (the wizard's last step), each listed only after the server checks its wiring and that its contracts run the code the manifest pins. It also indexes the factory's salts, so a market that is half created can be resumed from any browser. Every 15 minutes it records a snapshot of every market for the charts. On Testnet it also runs the faucet, which signs with the test asset's issuer key to authorize your account, add it to `Permissioning` and send test tokens, and the oracle keeper, which pushes the test reference value with the oracle's admin key. None of it signs or relays your transactions.

## Creating a market: MarketFactory

`MarketFactory` deploys and wires a market's seven contracts in three calls:

1. `create_tokens` deploys `SYWrapper`, `PTToken` and `YTToken`.
2. `create_engine` (which takes the `tokens` from call 1) deploys `MarketConfig` and `PrincipalManager`, makes `PrincipalManager` the only minter of PT and YT, and connects it and `SYWrapper` to `RiskControl`.
3. `create_pool_and_escrow` deploys `MarketPool` and `RecoveryEscrow`, and connects the escrow to SY, PT, YT and the pool.

Calls 2 and 3 check that the `tokens` or `engine` you pass equal the addresses the salt derives, and revert `TopologyMismatch` otherwise. Each call is one all-or-nothing transaction: if any step fails, nothing from that call stays on-chain. All seven in one call would exceed a Soroban transaction's memory budget, hence three. Between calls a market is incomplete; the issuer finishes it by sending the remaining calls with the same `salt`, the value the seven addresses derive from.

The factory has no admin and no storage. The underlying's issuer authority (the admin of its Stellar Asset Contract, which the app calls the "issuer") signs all three calls, and the six new contracts that take an admin check again, live, that the signer is that authority: no one can open a market on an asset without its issuer. `predict_market(salt)` returns the seven addresses before anything is deployed.

A few steps stay outside the factory. The shared contracts' admin registers `SYWrapper` and `PrincipalManager` with `RiskControl` (until then, deposits and mints revert) and lists the pool in the `Router`. And the new contracts, the treasury and the creator's payee must be authorized on the underlying, the issuer's decision, and allowed in `Permissioning`. The app's market wizard runs the factory calls as its step 3 and these steps as its step 4 (Wire) and step 5 (Permissions), each signed by its role holder; [Manage and create markets](/using-the-app/manage-markets) walks through all seven steps.

The Testnet market was deployed contract by contract, not through the factory: its seven contracts were deployed and wired one by one, and `MarketFactory` was deployed after them.

**Next:** [Safety controls](/technical/security). Related: [Pricing and the AMM](/how-it-works/pricing-and-amm), [Compliance](/how-it-works/compliance).
