---
title: Yield
description: "How YT earns the underlying's yield through the 1/rate index, what a transfer does to it, and how you claim it."
order: 2
---

YT collects the yield of the underlying asset from the moment you hold it until maturity. The YT contract tracks that yield with one number, an index built from `1/rate`, and pays it out in the underlying token whenever you claim. This page explains the index, what happens when YT changes hands, and the fee taken on each payout.

## Yield is the rate going up

The underlying behind your position keeps its token count but grows in value. That growth is the reference rate `r` rising (USDC per underlying token, see [Oracle](/how-it-works/oracle)). YT holders earn exactly that growth on the notional they hold. If the rate does not rise, YT earns nothing; it never earns a negative amount.

## The `1/rate` index

The YT contract keeps one global index, plus, for each account, the value of that index the last time the account was settled:

```
G = INDEX_SCALE × SCALE / r          INDEX_SCALE = 1e12, rounded up
```

As the rate rises, `G` falls. For an account holding `N` YT that was last settled at index `G_s` (rate `r_s`), the yield waiting for it is:

```
pending = N × (G_s − G) / INDEX_SCALE  =  N × (1/r_s − 1/r)
```

The result is in underlying tokens. In words: your notional, divided by the old rate, minus your notional divided by the new rate. That difference is the number of underlying tokens your notional no longer needs, because each token is now worth more.

## Why `1/rate`

PT and YT are minted in notional (USDC), but the yield comes from the underlying tokens the position holds. Over the life of a position the claims add up:

```
PT at maturity     N / r_final
YT, all yield      N × (1/r₀ − 1/r_final)
total              N / r₀  =  the SY you split
```

So PT and YT together never claim more than the SY backing them, whatever the rate was at minting and however many times it moved.

**Example** (no fees). You split 100 SY at a rate of 1.05 and receive 105 PT + 105 YT. At maturity the rate is 1.10. PT pays `105 / 1.10 = 95.4545` tokens and YT pays `105 × (1/1.05 − 1/1.10) = 4.5455` tokens: 100 in total, less one raw unit of rounding.

## When the index moves

Anyone can call `update_yield_index`. It reads the oracle, requires a fresh value (updated within the oracle's own freshness window, one hour on the Testnet market), and lowers the index only if the rate has risen since the last update. Splitting SY calls it before crediting your new YT, so a new position never earns a rise that happened before it existed.

## What a transfer does

Every change to a YT balance (mint, burn, transfer in either direction, and a compliance seizure) first brings the index up to date and settles the accounts involved at their old balances:

- The **sender** keeps the yield earned up to the transfer. It stays in their pending claim, ready to collect.
- The **receiver** starts earning from the moment of the transfer, never from before.

When you buy YT you get the future yield; when you sell it you keep what it already earned.

## Claiming

You collect your yield with `PrincipalManager.claim_yield` (Claim yield in the app). It brings the index up to date, settles your account, and pays the pending yield to you in the underlying token, in the same transaction. Your YT stays in your wallet and keeps earning.

You can claim at any time, before or after maturity. Before the market's settlement rate is fixed, a claim needs a fresh oracle value; after it, no oracle is needed. Yield you have claimed is never paid again at redemption.

## The YT fee

Each payout, a claim or the YT part of a redemption, pays the market's YT fee:

```
fee   = ceil(gross × yt_fee_bps / 10_000)
paid  = gross − fee
```

The fee is kept as SY and split between Principal and the market creator (see [Fees](/how-it-works/fees)). The Testnet market's YT fee is 10%.

**Example** (10% YT fee). You hold 104.9475 YT minted at 1.05. The rate reaches 1.10 and you claim:

```
gross  = 104.9475 × (1/1.05 − 1/1.10)  ≈ 4.5432
fee    = 10% of gross                   ≈ 0.4543
paid   = gross − fee                    ≈ 4.0889 underlying tokens
```

## Yield stops at settlement

The first index update at or after maturity moves the index one last time, using a fresh oracle value, and then freezes it. That update can come from `settle_all`, `update_yield_index`, a redemption, a claim, a YT transfer or a compliance seizure of YT. It may happen some time after maturity, and yield accrues until it does. The rate the index froze at is the market's settlement rate, used for both PT and YT. Nothing accrues after that. See [Maturity](/how-it-works/maturity).

## Rounding

The index is rounded up and each settlement subtracts one more index unit, so rounding can only pay YT slightly less, never more. The difference is at most a few parts in a trillion of your balance.

**Next:** [Pricing and the AMM](/how-it-works/pricing-and-amm), how PT and YT are priced and traded. To claim in the app, see [Portfolio and history](/using-the-app/portfolio).
