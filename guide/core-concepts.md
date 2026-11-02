---
title: Core concepts
description: "The terms you meet in Principal: underlying asset, SY, PT, YT, maturity, LP, fixed APY and implied yield."
order: 2
---

Principal turns one yield-bearing asset into a few tokens, each with one job. This page defines them in the order you meet them.

![The underlying asset wraps into SY; SY splits into a fixed Principal Token (PT) and a variable Yield Token (YT); before maturity, PT and YT recombine one to one into SY, which unwraps into the underlying.](/images/tokenization.svg)

## Underlying asset

The underlying is the real-world asset a market is built on, for example USDY, a tokenized note backed by US Treasuries. USDY earns by price appreciation: you keep the same number of tokens while each one's dollar value rises as interest accrues.

Principal reads that value from an oracle. The **oracle rate** is the dollar value of one unit of the underlying. It can stay level or rise, never fall. [Oracle](/how-it-works/oracle) explains how it is fed and checked.

## SY (Standardized Yield)

Wrapping the underlying gives you SY. One SY is a share of the underlying the wrapper holds, and today one SY equals one unit of the underlying. SY has no maturity, and you can unwrap it back into the underlying. Its dollar value grows with the oracle rate, while the number of SY you hold stays the same.

SY is what you split into PT and YT, and what the pool trades against PT.

## PT (Principal Token)

Splitting SY gives you PT and YT in equal amounts. That amount is the dollar value of the SY you split, after the tokenization fee. Example, without fees: 100 SY split at an oracle rate of 1.05 give 105 PT and 105 YT.

At maturity, each PT redeems for one dollar's worth of the underlying, priced at the market's settlement rate. You are paid in units of the underlying: the higher the rate, the fewer units you receive for the same dollar value. Before maturity, PT normally trades below one dollar, and the gap is your fixed yield.

## YT (Yield Token)

Each YT collects the yield on one dollar's worth of the underlying, counted from the time you get it until maturity. That yield is the rise in the oracle rate. You can claim it at any time, in the underlying, and the market keeps its YT fee from each payout. When a YT changes hands, the yield earned so far stays with the seller and the buyer earns from then on. If the oracle rate does not rise, YT earns nothing.

YT stops earning at maturity, so its price falls toward zero as maturity nears. In the app, the YT price is one dollar minus the PT price, and **YT leverage** is one divided by the YT price: how many YT one dollar buys. With PT at 0.96, a YT costs about 0.04 and the leverage is 25x.

## Recombine and redeem

Before maturity, equal amounts of PT and YT recombine into SY at the current oracle rate. Yield the YT has already earned stays yours to claim. After maturity you redeem instead: PT for its dollar value in the underlying, YT for any yield it has not paid out yet. [Maturity](/how-it-works/maturity) has the details.

## Maturity

Each market has one maturity date, fixed when the market is created. Until then you can split, trade and recombine. From maturity on, there are no new splits and the pool stops trading. Both tokens are then settled against one **settlement rate**, frozen by the first settlement after maturity, and later oracle moves change nothing.

## LP (liquidity position)

Each market has one pool, which trades PT against SY. Liquidity providers deposit PT and SY, or SY alone, and receive an LP position: their share of the pool, recorded by the pool itself rather than issued as a separate token. YT has no pool of its own. Buying YT splits SY and sells the PT into the pool in one transaction; selling YT does the reverse. See [Pricing and the AMM](/how-it-works/pricing-and-amm).

## Fixed APY and implied yield

The **fixed APY** is the yield you lock in if you buy PT at the pool's current price and hold it to maturity, expressed per year. The market page shows it as "PT fixed APY", and the trade forms as "Fixed APY". It compounds the pool's simple annual rate (APR) over the time left; on the market page, its tooltip shows the APR too.

Example: one year before maturity, a PT costs 0.96 dollars' worth of SY. You pay 0.96 and receive 1.00 at maturity, a fixed APY of about 4.17 %.

The **implied yield** is the yield the market expects from the underlying until maturity, read from the prices of PT and YT. In Principal's pool it is the same number as the fixed APY. PT buyers lock it in; YT buyers come out ahead only if the underlying earns more. For a given YT purchase, the YT trade form shows the rate the underlying has to beat as **Break-even APY**.

**Underlying APY (7 d)**, on the market page, is what the underlying actually earned: the growth of the oracle rate over the last seven days, expressed per year. Compare it with the fixed APY to see whether the market prices in more or less yield than the asset has been earning.

## Next

Put these together in [Strategies](/guide/strategies). For the mechanics behind them, read [Tokenization](/how-it-works/) and [Yield](/how-it-works/yield).
