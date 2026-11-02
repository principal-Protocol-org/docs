---
title: Oracle
description: "The reference rate behind every Principal calculation: what it measures, where the Testnet value comes from, and the freshness and monotonicity checks."
order: 6
---

Every number on the previous pages depends on one input: the **reference rate**, the USDC value of one token of the underlying asset. Each market reads it from an OracleAdapter contract, which is shared infrastructure: every market on the same underlying asset can read the same one. This page explains what that contract stores, where its value comes from, and the two checks that protect the market from a bad or stale value.

## What the rate is

The OracleAdapter stores a single value and the time it was published. The value is "USDC per underlying token" at a scale of 1e7: 1.03 USDC per token is stored as `10_300_000`.

For an asset like USDY the token count in your wallet stays the same while each token is worth more over time. The reference rate is where that growth shows up, and it is what the contracts use to:

- size PT and YT when you split SY (`notional = net SY × r`);
- move the YT yield index, and so decide how much yield YT has earned;
- value the pool's SY reserve in the same units as PT;
- price a recombination (`SY = amount ÷ r`);
- fix the settlement rate at maturity.

## Where the value comes from

The contract does not fetch a price itself. Only its admin can publish a value, with `set_reference_value`. Who runs that admin key decides where the number comes from.

For a production USDY market, Principal's design feeds the OracleAdapter from RedStone's USDY/USD feed (a SEP-40 price feed on Stellar) through a relay. That relay is a design only: it is not part of the contracts and does not run today.

**The Testnet market does not use RedStone.** Its underlying is a test USDY, "USDY (test)", issued by a test account Principal holds, not by Ondo. Its oracle is fed by Principal's own keeper: the value started at 1.0 when the market was created and the keeper pushes a new one about every 30 minutes, growing at about 5% a year. Yields you see on Testnet come from that test value, not from USDY's real yield.

## Check 1: the rate can only go up

Every update must pass these rules, or the contract refuses it:

- the caller is the oracle's admin;
- the value is above zero;
- the value is **not lower** than the stored one (`ValueDecreased`). An equal value is allowed, so the admin can refresh the timestamp without a price change;
- the timestamp is **later** than the stored one (`TimestampTooOld`), so an old value cannot be replayed;
- the timestamp is **not ahead** of the ledger's clock (`TimestampInFuture`), so a mistaken future timestamp cannot lock out every later update.

Why the value may never fall: the settlement math assumes it. YT earns only when the rate rises, and PT pays `amount ÷ r_final` tokens at maturity. If the final rate could fall below the rate at which PT was minted, PT would pay out more tokens than were deposited for it. A non-decreasing rate fits a NAV-appreciating asset like USDY. It does not fit an asset whose market price can fall, and such an asset cannot use this oracle as it is.

## Check 2: the rate must be fresh

The contracts ask the oracle whether its value is **fresh**, meaning its timestamp (set by the admin, never ahead of the ledger clock) is at most 3,600 seconds (one hour) old by the ledger's own clock, which no caller can set.

A stale oracle blocks every operation that prices against the rate:

- splitting SY into PT + YT;
- recombining PT + YT;
- claiming YT yield, until the settlement rate is fixed;
- buying or selling PT or YT in the pool;
- moving the YT index (`update_yield_index`);
- fixing the settlement rate at maturity, the first time.

It does **not** block:

- wrapping the underlying into SY or unwrapping it;
- adding liquidity with both PT and SY to a pool that already has liquidity;
- removing liquidity, so a stale feed never traps liquidity providers;
- transferring PT, or transferring YT before maturity or once the YT index is frozen;
- redeeming at maturity once the settlement rate is fixed, or claiming yield after it.

If the feed stops after maturity but one fresh value was taken at or after maturity, redemption still works: that value is the settlement rate and no further reading is needed.

## Limits

- The value is trusted as published: one admin key, one source. The contracts do not combine several feeds.
- The pool's own PT price and implied rate are not an oracle. A large trade can move them within a single ledger.

For the controls around the oracle and what an operator can do, see [Safety controls](/technical/security). For what an oracle failure means for your position, see [Risks](/guide/risks).

**Next:** [Compliance](/how-it-works/compliance), how the issuer's rules apply to every position.
