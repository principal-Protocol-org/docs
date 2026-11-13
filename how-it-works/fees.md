---
title: Fees
description: "The three fees a Principal market charges (tokenization, YT and swap), their Testnet values, their caps, and who receives them."
order: 5
---

A Principal market charges three fees: a tokenization fee when you split SY, a YT fee on yield payouts, and a swap fee on pool trades. Each is set per market in its MarketConfig contract, and each is split between Principal and the market's creator. Stellar's own network fee, paid on every transaction, is separate and goes to the network.

## At a glance

| Fee | Charged on | This Testnet market | Cap |
|---|---|---|---|
| Tokenization | SY split into PT + YT | 5 bps (0.05%) | 1% |
| YT fee | each yield payout to a YT holder | 10% of the yield | 50% |
| Swap | each PT/SY trade in the pool | Fee Tier 0.1% × days to maturity / 365 | tier 5%, effective fee 10% |

The values above are this Testnet market's settings, read from its MarketConfig (`tokenization_fee_bps` 5, `yt_fee_bps` 1000, `swap_fee_tier_bps` 10). Another market can use other values, within the caps. All fees are taken in SY.

## Tokenization fee

Charged when you split SY into PT + YT, before the notional is computed:

```
fee_shares = ceil(n × tokenization_fee_bps / 10_000)
```

It is rounded up, so a non-zero fee rate never rounds down to a zero fee. It applies to every split: the Split quick action (which wraps your USDY into SY first), the part Keep YT mints when you add liquidity, and the app's Buy YT, where the pool splits its own SY inside one call and charges the fee on the whole `sy_in`. You pay it through the net cost. At 5 bps, splitting 100 SY withholds 0.05 SY (see [Tokenization](/how-it-works/)).

## YT fee

Charged on every payout of yield: a yield claim, and the YT part of a redemption at maturity.

```
fee = ceil(gross_yield × yt_fee_bps / 10_000)
```

At 10%, a claim of 4.5432 tokens of yield pays you 4.0889 and keeps 0.4543 (see [Yield](/how-it-works/yield)). The rate in force when you claim applies, so a change to the YT fee also applies to yield earned before the change.

## Swap fee

Charged on each trade in the pool, as a rate that falls in a straight line to zero at maturity:

```
fee_rate = Fee Tier × seconds_to_maturity / (86_400 × 365)
```

The contract computes it at a precision of 1e12, so it stays accurate in the last days, and caps it at 10%. It is charged in SY:

- when you buy PT, on the SY you pay in;
- when you sell PT, on the SY you receive;
- when you sell YT, on the SY the pool keeps for the PT it uses.

Buying YT pays the swap fee too: the pool sells the PT it just minted to itself on the curve, and the fee is charged on that whole internal sale.

**Example schedule** (Fee Tier 0.1%, as on the Testnet market):

| Days to maturity | 365 | 180 | 90 | 30 | 7 | 1 | 0 |
|---|---|---|---|---|---|---|---|
| Fee rate | 0.1000% | 0.0493% | 0.0247% | 0.00822% | 0.00192% | 0.000274% | 0 |

A 1,000 SY trade 90 days before maturity pays 0.2466 SY of fee; the same trade a week out pays 0.0192 SY. Trades close to maturity pay almost no swap fee.

## What costs nothing

The contracts charge no fee to:

- wrap the underlying into SY, or unwrap SY;
- recombine PT + YT into SY;
- redeem PT at maturity;
- add or remove liquidity with both PT and SY (the pool's own calls);
- transfer PT, YT, SY or LP.

Two things the app does on top of those do pay the swap fee, because they sell PT on the curve: **LP only** (single-sided add), on the part it swaps into PT, and the one-call withdraw to USDY, on its PT sale. LP only charges no tokenization fee, since no YT is minted.

## Who receives the fees

Every fee is split when it is charged, by the market's protocol share:

```
protocol = floor(fee × protocol_share_bps / 10_000)
creator  = fee − protocol
```

On the Testnet market the protocol share is 2,000 bps: **20% to Principal** and **80% to the market creator**. Rounding dust goes to the creator.

- Principal's share is paid to the treasury address in the market's configuration.
- The **market creator** is the underlying asset's current issuer authority. For a Stellar asset that is the asset contract's `admin()`, read when the fee is paid out, so if the issuer changes its admin key the new key receives the fees with nothing to update. A SEP-57 token has no admin, so its market names an explicit payee.

On Testnet the test USDY's asset-contract admin is Principal's admin key, so both shares go to Principal: the 20% to its treasury key, the 80% to its admin key.

The shares build up in the PrincipalManager (tokenization and YT fees) and in the pool (swap fees). Anyone can trigger the payout with `claim_protocol_fees` or `claim_creator_fees`; the recipient is fixed by the configuration, so calling them cannot redirect anything. In the app the claim buttons (**Claim creator fees**, **Claim protocol fees (to treasury)**) are on the manager view and shown only to the creator and the protocol admin; see [Manage and create markets](/using-the-app/manage-markets).

## Liquidity providers earn no swap fees

Swap fees are not added to the pool's reserves. They go to the two shares above. A liquidity provider's return comes from PT converging to par (see [Pricing and the AMM](/how-it-works/pricing-and-amm)), not from fees.

## Who can change the fees

The market creator, meaning the underlying's issuer authority checked live, can change the three fees with `set_fees`, within the caps. The caps are constants in the contract: 100 bps for tokenization, 5,000 bps for the YT fee, 500 bps for the swap Fee Tier and 10% for the effective swap fee. Principal's share and treasury can be changed only by Principal's protocol admin. Every change emits an on-chain event. There is no waiting period before a change takes effect. The app has no action to set fees: changing them means calling `set_fees` on the market's MarketConfig directly.

The app shows a market's current fees on the market page (see [Markets and the market page](/using-the-app/markets)).

**Next:** [Oracle](/how-it-works/oracle), the reference rate every one of these calculations uses.
