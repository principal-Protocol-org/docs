---
title: Tokenization
description: "How Principal wraps a yield-bearing asset into SY, splits SY into PT and YT, and puts them back together."
order: 1
---

Principal turns one yield-bearing asset into two tokens: one that pays a fixed value at maturity (PT) and one that collects the yield until then (YT). It does this in three moves: wrap the asset into SY, split SY into PT + YT, and, if you change your mind before maturity, recombine them. This page shows the arithmetic the contracts run for each move.

## Units

Rates are integers at a scale of 10,000,000 (`SCALE = 1e7`), so a rate of `1.0` is stored as `10_000_000`. Token amounts are integers in the token's smallest unit: the test USDY, SY, PT and YT on Testnet all use 7 decimals.

The **reference rate** `r` is the USDC value of one underlying token, from the market's oracle. A rate of 1.05 USDC per token is stored as `10_500_000`. See [Oracle](/how-it-works/oracle) for where it comes from.

## Step 1: wrap the underlying into SY

SY is a share in the wrapper's pool of the underlying asset. You deposit the underlying and receive SY shares:

```
shares = amount × SCALE / exchange_rate
exchange_rate = total_underlying × SCALE / total_shares
```

With no shares yet, the exchange rate is 1.0. For an asset like USDY, whose token count does not grow (its value does), deposits and withdrawals keep the exchange rate at 1.0: one SY is one underlying token. The asset's growth shows up in the reference rate instead.

SY has no maturity. You can unwrap it back into the underlying at any time, as long as the wrapper is not paused and your account passes the [compliance checks](/how-it-works/compliance).

## Step 2: split SY into PT + YT

Splitting (`PrincipalManager.mint`) takes your SY, withholds the tokenization fee, and values what is left at the current reference rate. That value is the **notional**, in USDC, and you receive that many PT and that many YT:

```
fee_shares = ceil(n × fee_bps / 10_000)
notional   = (n − fee_shares) × r / SCALE
PT minted  = YT minted = notional
```

Here `n` is the SY you split and `fee_bps` is the market's tokenization fee (see [Fees](/how-it-works/fees)).

**Example.** You split 100 SY when the rate is 1.05. With no fee you receive 105 PT and 105 YT. With a 5 bps tokenization fee, 0.05 SY is withheld and you receive 104.9475 PT and 104.9475 YT.

Splitting needs the market to be open (not matured, and the PrincipalManager not paused), a fresh oracle value (updated within the oracle's freshness window, one hour on the Testnet market, see [Oracle](/how-it-works/oracle)), and an account that passes the [compliance checks](/how-it-works/compliance): authorized on the underlying and on the allow-list. The circuit breaker also applies: `mint` reports the value being tokenized to RiskControl, and a deposit over a set limit fails. The SY you split stays in the PrincipalManager contract as the backing for your PT and YT.

The app's Buy YT does not make you split SY yourself: the pool splits its own SY inside one call, and you pay only the net cost (see [Pricing and the AMM](/how-it-works/pricing-and-amm)).

## What PT and YT are claims on

PT and YT are both counted in notional (USDC), but they pay out in the underlying token.

- **PT** pays its notional, converted into underlying at the final rate: `PT ÷ r_final` tokens at maturity.
- **YT** collects the growth of the underlying behind that notional: `N × (1/r₀ − 1/r_final)` tokens over the market's life, where `r₀` is the rate when it was minted.

Added together, before fees, the two claims come back to the SY you split, whatever the rates (rounding can only take a raw unit or two off). [Yield](/how-it-works/yield) shows why, and [Maturity](/how-it-works/maturity) shows the payout.

## Step 3: recombine PT + YT

Before maturity you can burn equal amounts of PT and YT to get SY back (`PrincipalManager.recombine`). The SY is valued at the **current** rate:

```
shares_returned = amount × SCALE / r
```

**Example** (no fees). You split 100 SY at a rate of 1.0 and receive 100 PT + 100 YT. Later the rate is 1.25. Recombining the 100 PT + 100 YT returns 80 SY. The other 20 SY back the yield your YT has already earned: it stays yours, and you collect it with a yield claim.

Recombining charges no fee. It needs a fresh oracle and is closed once the market matures; after that you redeem instead.

## Before and after maturity

| Action | Before maturity | At or after maturity |
|---|---|---|
| Wrap or unwrap SY | Yes | Yes |
| Split SY into PT + YT | Yes | No |
| Recombine PT + YT | Yes | No (redeem instead) |
| Claim YT yield | Yes | Yes |
| Trade PT or YT in the pool, add liquidity | Yes | No |
| Remove liquidity (the pool's `remove_liquidity`) | Yes | Yes |
| Redeem PT and YT | No | Yes |

Every row also requires that your account passes the compliance checks, and most are refused while the market's contracts are paused (after maturity, removing liquidity ignores the pool's pause but still needs the SY wrapper unpaused).

The app's one-call withdraw to USDY also sells the PT it receives, so it is for before maturity only. After maturity the app removes the liquidity, redeems, then unwraps (see [Maturity](/how-it-works/maturity)).

In the app these are the [Quick actions](/using-the-app/quick-actions) **Deposit USDY → SY**, **Withdraw SY → USDY**, **Split USDY → PT + YT** (which wraps your USDY into SY first) and **Recombine PT + YT**.

**Next:** [Yield](/how-it-works/yield), how YT earns and how you claim it.
