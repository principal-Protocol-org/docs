---
title: Strategies
description: "Four ways to use Principal: fix a yield with PT, take a view on yield with YT, provide liquidity, or sell your future yield."
order: 3
---

Principal gives you four basic moves, each with its own exposure. The examples below use round numbers and leave out fees and price impact unless they say otherwise; the app quotes the real figures before you sign.

All four examples use the same made-up market: one year to maturity, and a PT priced at 0.96 dollars' worth of SY. A YT then costs about 0.04, and the fixed APY is about 4.17%.

## Fix a yield: buy PT

You swap SY, or the underlying asset, for PT in the pool, and hold it to maturity.

**Example.** You spend 960 dollars' worth of SY and receive 1,000 PT. At maturity they redeem for 1,000 dollars' worth of the underlying, whatever the asset earned in between: a fixed 4.17% for the year.

**What you gain.** A known dollar amount on a known date. Rates can rise or fall in the meantime; your payout at maturity does not change.

**What you risk.**

- If the asset earns more than 4.17%, the extra goes to YT holders.
- If you sell before maturity, you get the pool's price on that day. If the market's implied yield has risen since you bought, that price is lower.
- You are paid in the underlying, so you keep the asset's own risks and its issuer's controls. See [Risks](/guide/risks).

## Take a view on yield: buy YT

The app splits your SY into PT and YT, sells the PT into the pool and leaves you the YT, all in one transaction. You can claim the yield as it accrues, or let it build up.

**Example.** At about 0.04 per YT, 1,000 dollars buy about 25,000 YT, a leverage of 25x. What they collect depends on what the asset earns over the year:

| Asset earns over the year | Your YT collect, before the YT fee | Against the 1,000 you paid |
|---|---|---|
| 6% | about 1,500 | about +500 |
| 4% | about 1,000 | about even |
| 2% | about 500 | about −500 |
| 0% | 0 | −1,000 |

These figures are in dollars. For this purchase the app's **Break-even APY** reads about 4.17%: the rate at which your YT does as well as simply holding the asset, which would have earned too.

**What the trade moves.** To buy these 25,000 YT, your wallet must hold about 25,000 dollars' worth of SY or USDY at the start, not only the 1,000 you spend. The trade splits that whole amount into PT and YT and sells the 25,000 PT straight back, so about 24,000 comes back to you and about 1,000 is spent. The trade form shows this as **Moves**, **Spends** and **Comes back**, and **Max** allows for it. The tokenization fee is charged on the whole amount split and the swap fee on the whole PT sale, so together they are larger than the 1,000 suggests.

**What you gain.** A large exposure to the asset's yield for a small net outlay, with no borrowing.

**What you risk.**

- YT loses value as time passes. Here, if the asset earns less than about 4%, you lose part of your money; if it earns nothing, you lose all of it.
- Near maturity, a YT is worth almost nothing, and a sale can fail: the pool refuses it when the YT no longer covers the PT the pool has to put in. You then keep the YT and collect what it has earned.
- A large purchase moves the pool's price. The trade form shows Price impact and Minimum received before you sign.

## Earn as a liquidity provider

You pay USDY. The app splits part of it into PT and YT, puts the PT and the rest (as SY) into the pool at its current ratio, and gives you an LP position plus the YT. Adding SY alone is not available in this release.

**Where your return comes from.** The PT in the pool rises toward par as maturity approaches, with no trading needed. The SY in the pool is the underlying, so its dollar value moves with the asset. In the worked example in [Pricing and the AMM](/how-it-works/pricing-and-amm), a pool 180 days from maturity prices PT at 0.99376. With no trades at all, the price reaches 0.99997 by day 179 and par at maturity, while the implied yield stays at about 1.27% a year. Time alone raises the value of the PT you hold in the pool.

**What you do not earn.** Swap fees. They are split between Principal and the market's creator, the asset's issuer; on Testnet, where Principal is also the creator, both shares go to Principal. Liquidity providers receive none.

**What you risk.**

- When the market's implied yield moves, traders rebalance the pool, and you end up holding more of whichever side lost value, as in any AMM.
- You also hold the YT from the split, which loses value as maturity nears (see the YT strategy above).
- You can withdraw before or after maturity. Before maturity, the app sells the PT you take out back into the pool, which pays the swap fee and moves the price; after maturity it redeems that PT instead. A pause of the pool blocks withdrawals before maturity, not after it; a pause of the SY wrapper, or of redemptions, still holds them up after maturity. See [Risks](/guide/risks).

## Sell your future yield: split, then sell YT

You split SY into PT and YT, sell the YT, and keep the PT.

**Example.** You split 1,000 dollars' worth of SY into 1,000 PT and 1,000 YT, then sell the YT for about 40 dollars' worth of SY. At maturity, your 1,000 PT redeem for 1,000 dollars' worth of the underlying. You put in 1,000, took 40 back today, and receive 1,000 at maturity: the same fixed 4.17% as buying PT.

**What you gain.** Money today for yield you would otherwise wait a year for, and a fixed outcome on the rest.

**What you risk.**

- If the asset earns more than the yield you sold at, the buyer of your YT keeps the difference.
- To undo this before maturity, you need YT again to recombine with your PT, which means buying it back at the market price.

## Fees in every strategy

Splitting SY costs the tokenization fee, and buying YT includes a split of the whole amount moved. Adding liquidity in the app includes a split, so it pays the tokenization fee on that part. Yield paid to YT holders carries the YT fee. Every pool trade pays a swap fee that falls to zero at maturity. Each market shows its current fees on its page, under **Details**. [Fees](/how-it-works/fees) explains how each one is computed.

**Next:** [Supported assets](/guide/supported-assets), then [Risks](/guide/risks). To do each of these in the app, see [Trade PT and YT](/using-the-app/trade), [Add and remove liquidity](/using-the-app/liquidity) and [Quick actions](/using-the-app/quick-actions).
