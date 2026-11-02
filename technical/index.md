---
title: Architecture
description: "Principal's twelve Soroban contracts in three layers, how one market's contracts call each other, and how MarketFactory creates a market."
order: 1
---

Principal runs as twelve Soroban smart contracts on Stellar, plus one Rust library, `principal_compliance`, built into each market's contracts. This page groups the contracts into three layers, follows one market's calls from deposit to trade, and explains how a market is created. It describes the contracts deployed on Stellar Testnet.

## Three layers

![Principal's contracts grouped in three layers: infrastructure, tokenization and market](/images/contract-layers.svg)

**Infrastructure** contracts are shared across markets:

| Contract | Role |
|---|---|
| `OracleAdapter` | The reference value (USDC per unit of the underlying), its timestamp and a freshness check. |
| `Permissioning` | An optional eligibility list that can narrow who may hold a market's positions, never widen it. |
| `RiskControl` | The protocol pause and the deposit circuit breaker. |
| `Router` | Stateless one-transaction user flows for every registered market. |
| `MarketFactory` | Deploys and wires a new market's contracts. |

`principal_compliance` is the library each market contract uses to ask the underlying asset two questions: may this account hold you, and who is your issuer authority?

**Tokenization** contracts turn the underlying into SY, PT and YT:

| Contract | Role |
|---|---|
| `SYWrapper` | Wraps the underlying into SY shares and back. |
| `PrincipalManager` | Splits SY into PT + YT, recombines them, settles and redeems at maturity, holds the fees. |
| `MarketConfig` | Maturity, fees and the protocol/creator fee split. |
| `RecoveryEscrow` | Compliance recovery of SY, PT, YT and LP positions. |

**Market** contracts are what users hold and trade: `PTToken` and `YTToken` (SEP-41-style tokens, YT with its `1/rate` yield index) and `MarketPool`, the PT/SY yield-curve AMM with its LP positions.

### Shared versus per market

The tokenization and market layers are deployed together: each market, meaning one underlying asset and one maturity, gets its own seven contracts (`SYWrapper`, `PTToken`, `YTToken`, `MarketConfig`, `PrincipalManager`, `MarketPool`, `RecoveryEscrow`). A second maturity on the same asset is a second set of seven, with its own SY. The five infrastructure contracts are shared.

Addresses change with each deployment, so these pages do not list them. The app's Testnet manifest, [`config/manifests/testnet.json`](https://github.com/principal-Protocol-org/dapp/blob/testnet/config/manifests/testnet.json), lists them all.

## One market's wiring

**Deposit.** `SYWrapper.deposit` checks its pause, your compliance (authorized on the underlying, allowed by `Permissioning`) and the per-address deposit cap. It reports the amount to `RiskControl.check_deposit`, pulls the underlying from your account and credits SY shares.

**Split.** `Router.wrap_and_mint` deposits through `SYWrapper`, then calls `PrincipalManager.mint` in the same transaction. `PrincipalManager` checks that the market is open, the oracle fresh and you compliant, and reports to `RiskControl`. It keeps the tokenization fee, values the rest of the SY at the oracle's reference value, takes custody of the SY, brings `YTToken`'s yield index up to date, and mints the same amount of PT and YT to you. Only `PrincipalManager` can mint PT and YT.

**Trade.** `Router.swap_sy_for_pt` calls `MarketPool.swap_sy_for_pt`. The pool checks that it is open and you compliant, reads a fresh oracle value and the current swap fee from `MarketConfig`, prices the trade on its curve, then moves your SY in and the PT out. To buy YT, `Router.swap_sy_for_yt` mints PT + YT from your SY and sells the PT into the pool (flash-mint). To sell YT, `MarketPool.swap_yt_for_sy` recombines your YT with the pool's own PT through `PrincipalManager` and pays you the difference (flash-redeem).

At maturity, anyone can call `PrincipalManager.settle_all` to freeze one settlement rate; `Router.redeem_at_maturity` then redeems through `PrincipalManager.redeem`.

The `Router` holds no funds and always acts as you, so every contract checks compliance against your account. It routes only to markets its admin has registered and checked.

## How the app talks to the contracts

The Principal app has no backend between your wallet and the contracts. In your browser it reads contract state by simulating read-only calls over Soroban RPC (and balances and trustlines from Horizon). For an action, it builds the transaction, has Soroban RPC prepare it, asks Freighter to sign, checks that the signed transaction is the one it showed you, and submits it through Soroban RPC.

Deposit calls `SYWrapper.deposit` directly; every other action goes through the `Router`. An action that needs two contract calls, such as buying PT with USDY (deposit, then swap), is two transactions, each signed on its own. Its server routes (market list, chart history, Testnet faucet and oracle keeper) never sign or relay your transactions.

## Creating a market: MarketFactory

`MarketFactory` deploys and wires a market's seven contracts in three calls:

1. `create_tokens` deploys `SYWrapper`, `PTToken` and `YTToken`.
2. `create_engine` deploys `MarketConfig` and `PrincipalManager`, makes `PrincipalManager` the only minter of PT and YT, and connects it and `SYWrapper` to `RiskControl`.
3. `create_pool_and_escrow` deploys `MarketPool` and `RecoveryEscrow`, and connects the escrow to SY, PT, YT and the pool.

Each call is one all-or-nothing transaction, so no half-wired contract is ever left on-chain. All seven in one call would exceed a Soroban transaction's memory budget, hence three.

The factory has no admin and no storage. The underlying's issuer authority signs all three calls, and the six new contracts that take an admin check again, live, that the signer is that authority: no one can open a market on an asset without its issuer. The calls share a `salt` from which the seven addresses derive; `predict_market(salt)` returns them before anything is deployed.

A few steps stay outside the factory. The shared contracts' admin registers `SYWrapper` and `PrincipalManager` with `RiskControl` (until then, deposits and mints revert) and lists the pool in the `Router`. And the new contracts must be authorized on the underlying, the issuer's decision, and allowed in `Permissioning`.

**Next:** [Safety controls](/technical/security). Related: [Pricing and the AMM](/how-it-works/pricing-and-amm), [Compliance](/how-it-works/compliance).
