---
title: Add and remove liquidity
description: "Use the LP tab to deposit USDY into a market's pool for LP tokens, and to withdraw it."
order: 4
---

The **LP** tab of a market's Trade panel adds to and takes from the market's pool, which holds PT and SY. In return for liquidity you get LP tokens: the app's name for your share of the pool. The tab has a **Deposit** / **Withdraw** toggle. The LP position is explained in [Core concepts](/guide/core-concepts), and the pool in [Pricing and the AMM](/how-it-works/pricing-and-amm).

## What LPs earn

The details of both sides carry the row **LP earns: PT convergence**, with the tip "LPs earn PT convergence; swap fees go to the protocol and the market creator." The PT in the pool trades below its value at maturity and rises towards it as maturity nears; that rise is what an LP earns. The pool's swap fees do not go to LPs: on the Testnet market both shares go to Principal, which is also the market's creator there. See [Fees](/how-it-works/fees).

## Deposit

The card reads **Add liquidity**: "Deposit USDY into the pool for LP tokens." Enter what you pay under **You pay**.

The **Keep YT** switch is on by default. With it on, part of your USDY is split into PT + YT, the PT and the rest go into the pool at its ratio, and you keep the YT. You get LP tokens and YT. It takes three signatures:

1. Mint PT + YT from the part to split.
2. Deposit the rest of your USDY as SY.
3. Add the PT and the SY to the pool.

The details show:

- **Fixed APY**, marked "(unchanged)": PT and SY go in at the pool's ratio, so its price does not move.
- **Price impact**: "None". Nothing is swapped.
- **Split into PT + YT**: the USDY that is minted into PT + YT.
- **Fees**: the tokenization fee on the split part. There is no swap fee.
- **YT you keep**.
- **Pool share**: your share of the pool's LP supply now → once the deposit lands.
- **Minimum received**: the least LP you accept, at your slippage tolerance.
- **Left in your wallet**: a rounding remainder, if any. The pool takes PT and SY only in its exact ratio.

Click **Review Add liquidity (keep YT)**.

Turning Keep YT off ("LP only", all your USDY into the pool) is not offered in this release. The app says so under the switch, and the review button stays off. Paying in SY turns Keep YT off and disables the switch, with the reason under it: to add liquidity, pay in USDY with Keep YT on.

## Withdraw

The card reads **Withdraw liquidity**: "Withdraw your LP for USDY or its SY. The PT you get back is sold into the pool." Enter the LP to withdraw and choose **Receive as** USDY or SY.

Before maturity the route removes your liquidity as PT and SY, sells the PT for SY, and, if you receive USDY, turns the SY into USDY. That is three signatures to USDY, two to SY. The details show:

- **Fixed APY** now → after: selling the PT back raises the fixed APY.
- **Price impact** of the PT sale, swap fee included.
- **Fees**: the pool's swap fee on the PT sold.
- **Pool share** now → after, and **Minimum received**.

Click **Review Withdraw liquidity**.

## At maturity

Adding liquidity closes at maturity. The Deposit side then reads "Adding liquidity closed at maturity: the pool takes no new PT or SY. You can still withdraw your liquidity: choose Withdraw." After maturity the LP tab opens on Withdraw.

Withdrawing stays open. Your PT is then redeemed instead of sold: the details show **Your PT: Redeemed, not sold** and no fee, since redeeming takes no fee and nothing moves the pool's price. The redeemed part is paid in USDY even when you choose to receive SY. It is still three signatures to USDY, two to SY. Until the market is settled, the redeem step needs a fresh oracle price, as **Redeem at maturity** does (see [Portfolio and history](/using-the-app/portfolio)). See [Maturity](/how-it-works/maturity).

## Review and sign

Deposits and withdrawals are reviewed and signed one step at a time, like trades. If a step is refused or fails, the route stops and tells you what you hold. Both are described in [Trade PT and YT](/using-the-app/trade).

Your LP position, its share of the pool's PT and SY and its estimated value appear in the [Portfolio](/using-the-app/portfolio).

Next: [Quick actions](/using-the-app/quick-actions).
