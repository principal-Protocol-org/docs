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
| `OracleAdapter` | The reference value (USDC per unit of the underlying), its timestamp and a freshness check. |
| `Permissioning` | An allow-list every account must be on, checked on every operation that moves an account's positions (PT and YT also have a list per token). It adds to the issuer's own controls: it can only narrow who may use a market, never widen it. |
| `RiskControl` | The protocol pause and the deposit circuit breaker. |
| `Router` | One-transaction user flows for every registered market; holds no funds. |
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

**Trade.** `Router.swap_sy_for_pt` calls `MarketPool.swap_sy_for_pt`. The pool checks that it is open and you compliant, reads a fresh oracle value and the current swap fee from `MarketConfig`, prices the trade on its curve, then moves your SY in and the PT out. To buy YT, `Router.swap_sy_for_yt` mints PT + YT from your SY and sells the PT into the pool (flash-mint). To sell YT, `MarketPool.swap_yt_for_sy` recombines your YT with the pool's own PT through `PrincipalManager` and pays you the difference (flash-redeem).

At maturity, anyone can call `PrincipalManager.settle_all` to freeze one settlement rate; `Router.redeem_at_maturity` then redeems through `PrincipalManager.redeem`.

The `Router` holds no funds and always acts as you, so every contract checks compliance against your account. It routes only to markets its admin has registered and checked.

## How the app talks to the contracts

Your transactions go from your browser to the network: no server signs, relays or changes them. In your browser, the app reads contract state by simulating read-only calls over Soroban RPC (and balances and trustlines from Horizon). For an action, it builds the transaction, has Soroban RPC prepare it, asks your Varial wallet (formerly Freighter) to sign, checks that the signed transaction is the one it showed you, and submits it through Soroban RPC.

Deposit calls `SYWrapper.deposit` directly; every other user action goes through the `Router`. An action that needs two contract calls, such as buying PT with USDY (deposit, then swap), is two transactions, each signed on its own.

The app's server keeps a database. It holds the list of markets the app shows: those in the manifest, plus markets found from the `Router`'s and the factory's events or submitted to `POST /api/markets`, each listed only after the server checks its wiring and that its contracts run the code the manifest pins. Every 15 minutes it records a snapshot of every market for the charts. On Testnet it also runs the faucet, which signs with the test asset's issuer key to authorize your account, add it to `Permissioning` and send test tokens, and the oracle keeper, which pushes the test reference value with the oracle's admin key. None of it signs or relays your transactions.

## Creating a market: MarketFactory

`MarketFactory` deploys and wires a market's seven contracts in three calls:

1. `create_tokens` deploys `SYWrapper`, `PTToken` and `YTToken`.
2. `create_engine` deploys `MarketConfig` and `PrincipalManager`, makes `PrincipalManager` the only minter of PT and YT, and connects it and `SYWrapper` to `RiskControl`.
3. `create_pool_and_escrow` deploys `MarketPool` and `RecoveryEscrow`, and connects the escrow to SY, PT, YT and the pool.

Each call is one all-or-nothing transaction: if any step fails, nothing from that call stays on-chain. All seven in one call would exceed a Soroban transaction's memory budget, hence three. Between calls a market is incomplete; the issuer finishes it by sending the remaining calls with the same `salt`, the value the seven addresses derive from.

The factory has no admin and no storage. The underlying's issuer authority signs all three calls, and the six new contracts that take an admin check again, live, that the signer is that authority: no one can open a market on an asset without its issuer. `predict_market(salt)` returns the seven addresses before anything is deployed.

A few steps stay outside the factory. The shared contracts' admin registers `SYWrapper` and `PrincipalManager` with `RiskControl` (until then, deposits and mints revert) and lists the pool in the `Router`. And the new contracts, the treasury and the creator's payee must be authorized on the underlying, the issuer's decision, and allowed in `Permissioning`.

The Testnet market was deployed contract by contract, not through the factory: its seven contracts were deployed and wired one by one, and `MarketFactory` was deployed after them.

**Next:** [Safety controls](/technical/security). Related: [Pricing and the AMM](/how-it-works/pricing-and-amm), [Compliance](/how-it-works/compliance).
