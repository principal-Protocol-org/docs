---
title: Oracle
description: "The reference rate behind every Principal calculation: what it measures, where the Testnet value comes from, its sources, and the monotonicity, deviation and freshness checks, with the rejections it records."
order: 6
---

Every number on the previous pages depends on one input: the **reference rate**, the USDC value of one token of the underlying asset. Each market reads it from an OracleAdapter contract, which is shared infrastructure: every market on the same underlying asset can read the same one. This page explains what that contract stores, where its value comes from, and the checks that protect the market from a bad or stale value.

## What the rate is

The OracleAdapter stores a single value and the time it was published, and with it the policy that guards that value: its freshness window (`max_stale_seconds`), its deviation cap (`max_deviation_bps`), a primary source id and an optional fallback source id, the source the stored value came from, optional value bounds, and the last update it rejected. The value is "USDC per underlying token" at a scale of 1e7: 1.03 USDC per token is stored as `10_300_000`.

For an asset like USDY the token count in your wallet stays the same while each token is worth more over time. The reference rate is where that growth shows up, and it is what the contracts use to:

- size PT and YT when you split SY (`notional = net SY × r`);
- move the YT yield index, and so decide how much yield YT has earned;
- value the pool's SY reserve in the same units as PT;
- price a recombination (`SY = amount ÷ r`);
- fix the settlement rate at maturity.

## Where the value comes from

The contract does not fetch a price itself. Only its admin can publish a value, with `set_reference_value(caller, source, value, timestamp)`. Who runs that admin key decides where the number comes from.

Every update names a `source`, a 32-byte id that must be the oracle's **primary** source or its optional **fallback** source. The primary is the source of truth for the value. The fallback can only refresh the timestamp of the value already stored: it can never introduce a new one. Anything else is refused: an unknown source reverts. Both are submitted with the admin key, so this is a guard against a wrong or lagging feed, not a second independent oracle.

For a production USDY market, Principal's design feeds the OracleAdapter from RedStone's USDY/USD feed (a SEP-40 price feed on Stellar) through a relay. That relay is a design only: it is not part of the contracts and does not run today.

**The Testnet market does not use RedStone.** Its underlying is a test USDY, "USDY (test)", issued by a test account Principal holds, not by Ondo. Its oracle is fed by Principal's own keeper: the value started at 1.0 when the market was created and the keeper pushes a new one about every 30 minutes (a hosting schedule, not something the contract enforces), growing at about 5% a year. This market's oracle has one primary source, the keeper, and no fallback. Yields you see on Testnet come from that test value, not from USDY's real yield.

## Check 1: what an update must satisfy

A broken call **reverts**, and nothing is stored. The call reverts when:

- the caller is not the oracle's admin (`Unauthorized`);
- the value is zero or below (`InvalidValue`);
- the timestamp is **ahead** of the ledger's clock (`TimestampInFuture`), so a mistaken future timestamp cannot lock out every later update;
- the source is not the primary or the fallback (`InvalidSource`, or `FallbackNotConfigured` when no fallback is set).

A well-formed update that the policy refuses does not revert. The call **returns `false`, stores nothing and records the rejection** on the oracle (a `ref_rej` event, readable with `last_rejection()`). A revert would discard its own record, and a routine bad tick should not look like a broken transaction. The reasons:

| Reason | In words | What the rule is |
|---|---|---|
| `oob` | Outside the value bounds | the value is outside the oracle's optional bounds |
| `stale_ts` | Not newer than the current value | the timestamp is not later than the stored one, so an old value cannot be replayed |
| `fb_value` | Fallback tried to change the value | the fallback sent a value different from the stored one |
| `decrease` | Lower than the current value | the primary sent a lower value. An equal value is allowed, so the admin can refresh the timestamp without a price change |
| `deviate` | Moved more than the cap | the primary sent a rise above `max_deviation_bps` over the stored value |

The **deviation cap** limits how far one update can lift the rate. It guards against a compromised or malfunctioning feed pushing a huge number, which could never be corrected because the rate may not fall. The first value ever stored is not checked against it. On this Testnet market the cap is 1,000 bps, 10% per update.

**Value bounds** are an optional minimum and maximum the oracle admin can set, a guard against a value on the wrong scale. They are a contract feature that is not set on this Testnet market.

The market page's Safety tab shows the policy and the last rejection: **Oracle deviation cap**, **Oracle primary source**, **Oracle fallback source** ("None" when there is no fallback) and **Oracle last rejected update**, with the reason in the words of the table's second column and the rejected value and its age.

Why the value may never fall: the settlement math assumes it. YT earns only when the rate rises, and PT pays `amount ÷ r_final` tokens at maturity. If the final rate could fall below the rate at which PT was minted, PT would pay out more tokens than were deposited for it. A non-decreasing rate fits a NAV-appreciating asset like USDY. It does not fit an asset whose market price can fall, and such an asset cannot use this oracle as it is.

## Check 2: the rate must be fresh

The contracts ask the oracle whether its value is **fresh**, meaning its timestamp (set by the admin, never ahead of the ledger clock) is no older than the oracle's own freshness window by the ledger's own clock, which no caller can set. The contracts read this through the oracle's `is_available()`, so the window lives in one place. It must be above zero, and the oracle admin can change it. This Testnet market's window is 3,600 seconds, one hour. The app reads the window instead of assuming it: the Safety tab shows "Fresh (updated within the last 1 hour)" for this market.

A stale oracle blocks every operation that prices against the rate:

- splitting SY into PT + YT;
- recombining PT + YT;
- claiming YT yield, until the settlement rate is fixed;
- buying or selling PT or YT in the pool, including the flash Buy YT;
- single-sided liquidity (LP only), Keep YT (through its split), and the first deposit into an empty pool;
- the app's one-call withdraw to USDY before maturity (through its PT sale);
- moving the YT index (`update_yield_index`);
- fixing the settlement rate at maturity, the first time.

It does **not** block:

- wrapping the underlying into SY or unwrapping it;
- adding liquidity with both PT and SY to a pool that already has liquidity;
- removing liquidity with the pool's own `remove_liquidity`, so a stale feed never traps liquidity providers (the app's withdraw before maturity sells your PT, so it waits for a fresh price);
- transferring PT, or transferring YT before maturity or once the YT index is frozen;
- redeeming at maturity once the settlement rate is fixed, or claiming yield after it.

If the feed stops after maturity but one fresh value was taken at or after maturity, redemption still works: that value is the settlement rate and no further reading is needed.

## Limits

- The value is trusted as published: one admin key. The contracts do not combine several feeds. A primary and an optional fallback source id are both submitted with that key, and the fallback can only re-timestamp the current value. This Testnet market has a primary only.
- The pool's own PT price and implied rate are not an oracle. A large trade can move them within a single ledger.

For the controls around the oracle and what an operator can do, see [Safety controls](/technical/security). For what an oracle failure means for your position, see [Risks](/guide/risks).

**Next:** [Compliance](/how-it-works/compliance), how the issuer's rules apply to every position.
