---
title: Safety controls
description: "The pause switches, the deposit circuit breaker, the oracle's policy (freshness, deviation cap, rejections), compliance recovery and the pool's safety rules, as Principal's contracts enforce them."
order: 2
---

This page lists the safety controls in Principal's contracts, who can use each one and what it stops, all enforced by the contracts deployed on Stellar Testnet.

## Pause

**Protocol pause.** On `RiskControl`, the admin or any registered pauser can call `pause`; only the admin can `unpause`, so a pauser key cannot toggle the switch to let chosen transactions through. While it is on, every deposit into `SYWrapper` and every mint in `PrincipalManager` reverts with `Paused`, in every market connected to that `RiskControl`, so splitting and buying YT (which mints) stop too. Every `Router` call that deposits or mints stops with it: `wrap_and_mint`, `swap_underlying_for_pt`, `swap_sy_for_yt`, `swap_underlying_for_yt`, `flash_mint_yt`, `flash_mint_yt_from_underlying`, `add_liquidity_single_underlying` and `add_liquidity_keep_yt`. In app terms, Buy PT in USDY, Buy YT, Split, Keep YT and LP only in USDY stop. Selling PT, selling YT, adding or removing liquidity with SY, withdrawals, recombining, yield claims and redemption continue.

**Market pauses.** `SYWrapper`, `PrincipalManager` and `MarketPool` each have their own `set_paused`, for that contract's admin only, and an `is_paused` read. A market's admin is the underlying's issuer authority at creation and can be handed over with `transfer_admin`. The app's manager view offers **Pause** and **Unpause** for the pool, the SY wrapper and the manager, to the wallet that is that contract's admin; the market page's **Safety** tab shows each contract's state, and the status badge reads **Paused** when the manager is paused. See [Manage and create markets](/using-the-app/manage-markets).

| Contract | While paused |
|---|---|
| `SYWrapper` | Deposits stop. A transfer of SY stops unless the market's `RecoveryEscrow` is either party, and a withdrawal stops unless the escrow itself withdraws. Minting, swaps, liquidity and redemption all move SY, so they stop too. |
| `PrincipalManager` | Mint, recombine, claim yield and redeem stop, so buying and selling YT stop too. `settle_all` still works. The app's refusal reads "PrincipalManager is paused: minting, buying and selling YT, recombining, claiming and redeeming are stopped until it is unpaused." |
| `MarketPool` | Swaps, the flash Buy YT, adding liquidity (single-sided too) and LP transfers stop. Removing liquidity stops only before maturity. The one-call withdrawal to USDY sells PT, so it stops before maturity too. |

`PTToken` and `YTToken` have no pause.

## Circuit breaker

`RiskControl` limits how much underlying can be deposited within a window: a protocol-wide limit across all assets, and a limit per asset. A limit of `0` switches that limit off. A deposit or mint that would exceed either limit reverts (`CircuitBreakerTripped` or `AssetLimitTripped`) inside its own transaction.

The window is counted in ledger sequence numbers, which advance by exactly one per ledger and, unlike a timestamp, cannot be nudged by a validator. The default is 17,280 ledgers, about 24 hours at roughly 5 seconds per ledger; the admin can change it and the limits, and each change emits an event.

`SYWrapper.deposit` and `PrincipalManager.mint` report to `RiskControl` themselves, so direct calls are limited like `Router` calls, and a one-step deposit-and-split counts at both. The one-call flows count the same way: the flash counts the full `sy_in` through the mint, not the net cost; the USDY flash counts its budget at the wrapper and `sy_in` at the manager; Keep YT counts its deposit and its mint; LP only in USDY and Buy PT in USDY count the deposit. Only registered contracts may report, so no outsider can use up the allowance. `SYWrapper` also caps what one address can have deposited, net of withdrawals; a cap of `0` means no cap.

On the Testnet market these limits are currently off: both circuit-breaker limits and the per-address cap are set to `0`. The **Safety** tab on the market page shows the live values. The pause still applies.

## Oracle policy and freshness

`OracleAdapter` stores one reference value and its timestamp, and the policy that guards it. Only its admin can push a value, through `set_reference_value(caller, source, value, timestamp)`, and the source must be the oracle's primary or optional fallback source. [Oracle](/how-it-works/oracle) explains each rule; as safety controls they are:

- **Reverts.** A call from a caller that is not the admin, a value of zero or less, a timestamp ahead of the ledger clock or an unknown source reverts and stores nothing.
- **Recorded rejections.** A well-formed update the policy refuses returns `false` and stores nothing, and the oracle records the rejection (`last_rejection()`, a `ref_rej` event) because a revert would discard its own record. The reasons are `decrease` (a lower value, so the rate never falls), `stale_ts` (a timestamp not newer than the stored one), `deviate` (a rise above the deviation cap), `fb_value` (the fallback tried to change the value) and `oob` (outside the optional value bounds).
- **Deviation cap.** `max_deviation_bps` limits how far one update can lift the value, so a faulty feed cannot push a huge number that could never be corrected. On this Testnet market it is 1,000 bps, 10% per update.
- **Bounds and sources.** The bounds are optional, and not set on this Testnet market. The primary source is the source of truth; the fallback can only refresh the timestamp of the value already stored. This Testnet market has one primary source and no fallback.

The market page's **Safety** tab shows **Oracle deviation cap**, **Oracle primary source**, **Oracle fallback source** and **Oracle last rejected update**.

A value is fresh when it is at most `max_stale_seconds` old by the ledger clock, a window the oracle owns and its admin can change; the contracts read it through `is_available()`. On this Testnet market it is 3,600 seconds (one hour), and the Safety tab shows "Fresh (updated within the last 1 hour)". Mint, recombine, claim yield, every swap, the flash Buy YT, Keep YT, single-sided liquidity, the one-call liquidity withdrawal to USDY, the first liquidity deposit, and the observation that freezes the YT yield index at maturity all require a fresh value, or revert with `OracleStale`. A stale feed pauses these operations but leaves exits open: unwrapping SY and a plain `remove_liquidity` never read the oracle, and once one fresh value has been taken at or after maturity (by `settle_all` or the first redemption), redemption and yield claims no longer need it. Until that first fresh value, PT and YT cannot be redeemed.

On Testnet, the app's keeper pushes the value with the oracle's admin key.

## Compliance recovery

An account the issuer deauthorizes on the underlying is frozen in Principal too, since transfers, trades and withdrawals check both sides. `RecoveryEscrow` lets the issuer recover that account's positions, under two conditions checked on every call:

- The caller is the underlying's current issuer authority, read live (`SAC.admin()` for a classic or SEP-8 asset, the operator role for a SEP-57 token). The escrow holds no key of its own.
- The account is already deauthorized on the underlying; otherwise the call reverts with `TargetStillAuthorized`.

| Position | On seizure |
|---|---|
| SY | Unwrapped at once into the underlying, held by the escrow. |
| LP | Burned in the pool. The SY part is unwrapped at once, the PT part is held. |
| PT and YT | Held, fully backed, until maturity. |

At or after maturity, the issuer settles what is still held with `finalize_record`, which redeems the PT and YT through `PrincipalManager`. The issuer then uses the asset's own clawback on the escrow's balance, outside Principal.

`seize_batch` and `seize_all_positions` recover up to three accounts in one transaction, checking each one. Every seizure writes a `RecoveryRecord` (account, ledger, time, what was seized and what it yielded), and `finalize_record` adds the result to it. Only the deauthorized account's positions move, and seizure works while the market is paused. Each position contract accepts seizures only from its own escrow, set once at creation.

## Pool safety rules

- **Minimum output.** Every swap and liquidity call reverts with `SlippageExceeded` below the minimum you set. The flash Buy YT has two guards: it reverts if fewer than your `min_yt_out` YT would be minted or the net cost would exceed your `max_net_cost`. `Router` flows that trade or move liquidity also revert with `DeadlineExpired` after their `deadline`.
- **Rounding favors the pool.** Swap fees round up and every curve result is padded against the trader. The tokenization fee also rounds up, and PT redemption rounds down.
- **Reserves never empty.** A swap cannot leave either reserve below 1,000 raw units, and the first liquidity deposit locks 1,000 LP in the pool for good.
- **Opening price at or below par.** The first deposit must price PT at or below par. The check rounds the SY value up, so it is the stricter test.
- **Donations cannot skew LP.** LP is priced from the pool's recorded reserves, never from its token balances.
- **Trading closes at maturity.** Swaps and new liquidity revert with `Expired`; removing liquidity stays open.
- **Flash-redeem cannot leave the pool short.** Selling YT reverts with `InsufficientLiquidity` if the recombined SY does not cover the PT the pool gives up.
- **Spot price is not an oracle.** A trade can move `pt_price` and `implied_rate` within a ledger.

`MarketConfig` caps the fees: 1% tokenization, 50% YT fee, 5% swap Fee Tier, with the effective swap fee capped at 10%. See [Fees](/how-it-works/fees).

**Next:** [Developers](/technical/developers). Related: [Risks](/guide/risks), [Compliance](/how-it-works/compliance).
