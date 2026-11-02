---
title: Maturity
description: "What PT and YT pay at maturity, how the single settlement rate is fixed, and how redemption works."
order: 4
---

Every market has a maturity date, fixed when the market is created. The Testnet market matures on 31 January 2027 at 00:45 UTC. At maturity, trading closes and PT and YT become redeemable for the underlying token. The first index update at or after maturity fixes one final rate for everyone. This page explains what each one pays and how.

![Before maturity PT rises toward par while YT's price falls toward zero as its future yield runs out; at maturity PT redeems for the principal's value and YT's earned yield stays claimable](/images/maturity-payout.svg)

## The settlement rate

At or after maturity, anyone can call `PrincipalManager.settle_all`. Unless the YT index is already frozen, it needs a fresh oracle value (updated within the last hour), uses it to move the index one last time and freezes it. It then records the frozen rate as the market's **settlement rate**. If nobody calls it, the first redemption does the same thing.

From then on:

- every redemption, by every holder, uses that one rate, so PT and YT are settled against the same number and the first redeemer has no advantage;
- later oracle values change nothing;
- no oracle is needed any more, so a feed that stops after maturity cannot block redemption.

In short, the settlement rate is the oracle value read by the first index update at or after maturity.

## What PT pays

PT is a claim on a fixed USDC value. At maturity it pays that value in the underlying token, converted at the settlement rate:

```
underlying = floor(pt_amount × SCALE / r_final)
```

The token count depends on the rate, but its USDC value does not: 105 PT at a settlement rate of 1.10 pays 95.4545 tokens, which are worth 105 USDC at that rate. PT redemption charges no fee.

The oracle rate can never go down (see [Oracle](/how-it-works/oracle)), so the settlement rate is at least the rate at which any PT was minted. The underlying held for PT always covers it.

## What YT pays

Redeeming YT pays all the yield it has earned and not yet claimed, less the YT fee:

```
gross = N × (1/r_s − 1/r_final)        r_s = rate at your last settlement
paid  = gross − YT fee
```

`gross` also includes yield settled earlier and not yet claimed, and covers your whole YT balance even if you redeem only part of it.

The YT is burned. Yield you already collected with a claim is not paid again. If the rate never rose above your entry rate, the YT part is zero; PT still pays in full. After the settlement rate is fixed, YT earns nothing more.

You do not have to redeem YT to collect its yield: a yield claim after maturity pays the same amount and leaves the (now inert) YT in your wallet.

## Example

In round numbers: you split USDY worth 100 USDC into a 3-month market, and USDY yields 4% a year. At maturity, PT pays USDY worth 100 USDC. YT has earned about 1 USDC of yield over the period, less the YT fee.

The exact version (no fees): 100 SY split at a rate of 1.05 gives 105 PT + 105 YT. The settlement rate is 1.10.

| Leg | Formula | Underlying tokens |
|---|---|---|
| PT | `105 / 1.10` | 95.4545 |
| YT | `105 × (1/1.05 − 1/1.10)` | 4.5455 |
| Total | | 100, the SY split (less one raw unit of rounding) |

## How redemption works

You redeem with `PrincipalManager.redeem` (or `Router.redeem_at_maturity`, which the app uses), giving an amount of PT, of YT, or of both. In one transaction it:

1. fixes the settlement rate, if that has not happened yet;
2. burns your PT and pays its value in the underlying token;
3. brings the YT index up to date, burns your YT, and pays its yield, less the YT fee.

Redemption pays the underlying token itself to your wallet, not SY. It is refused before maturity, while the market is paused, and if your account does not pass the [compliance checks](/how-it-works/compliance).

## Liquidity providers at maturity

Swaps close at maturity, and the pool's price stops mattering. Removing liquidity stays open after maturity, even if the pool is paused, and needs no oracle. You receive your share of the pool's PT and SY, then redeem the PT at par like any other PT.

## Leaving before maturity

You do not have to wait. Before maturity you can sell PT or YT in the pool, recombine equal amounts of PT and YT into SY (see [Tokenization](/how-it-works/)), or claim YT yield as it accrues. In the app, redemption and claims are on the [Portfolio and history](/using-the-app/portfolio) page.

**Next:** [Fees](/how-it-works/fees), every fee a market charges and who receives it.
