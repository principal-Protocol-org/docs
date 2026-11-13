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

The **Keep YT** switch is on by default. With it on, part of your USDY is split into PT + YT, the PT and the rest go into the pool at its ratio, and you keep the YT. You get LP tokens and YT. It takes one signature: a single Router call deposits all your USDY as SY, mints PT + YT from part of it and adds the PT and the rest to the pool.

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

Keep YT signs the PT and SY amounts as fixed numbers. If the oracle rate rises between your review and the transaction, a little PT can stay in your wallet, and your holdings show it. If the pool or the oracle moves too far, the call fails: only the network fee is lost, and the panel names the cause.

### LP only

Turn **Keep YT** off to put all your USDY into the pool and keep no YT. Under the switch the app says "LP only: all your USDY goes into the pool and you keep no YT." It is also one signature. The pool buys the PT it needs with part of your payment, so the details differ:

- **Fixed APY**: now → after. The pool buys PT, so the fixed APY falls a little.
- **Price impact**: that PT purchase against the pool's spot price, swap fee included.
- **Fees**: the pool's swap fee on the part swapped into PT. There is no tokenization fee, since no YT is minted.
- **Pool share** and **Minimum received**.
- **Refunded to your wallet**: the SY the pool did not use. The few raw units of PT it bought and did not use stay in the pool.

Choose LP only when you want the pool's earnings and no YT exposure. Keep YT instead if you also want the YT's variable yield. Click **Review Add liquidity**.

Paying in SY works too, and turns Keep YT off: the switch is disabled with the reason "Keep YT needs USDY: it splits USDY into PT + YT with the Router, which takes USDY. Pay in USDY to keep the YT." Adding liquidity from SY is one signature as well.

## Withdraw

The card reads **Withdraw liquidity**: "Withdraw your LP for USDY or its SY. The PT you get back is sold into the pool." Enter the LP to withdraw and choose **Receive as** USDY or SY.

Before maturity your liquidity comes out as PT and SY, and the PT is sold for SY. If you receive USDY, that is one signature: one Router call removes the liquidity, sells the PT and pays out USDY. If you receive SY, it is two signatures: remove the liquidity, then sell the PT. A very large share can fail in the USDY exit, because its PT sale runs inside the same call. Receiving SY removes your liquidity at the first signature, so you hold PT and SY even if the second step, the same PT sale, is refused; you can then sell the PT in smaller pieces or keep it to maturity. The details show:

- **Fixed APY** now → after: selling the PT back raises the fixed APY.
- **Price impact** of the PT sale, swap fee included.
- **Fees**: the pool's swap fee on the PT sold.
- **Pool share** now → after, and **Minimum received**.

Click **Review Withdraw liquidity**.

## At maturity

Adding liquidity closes at maturity. The Deposit side then reads "Adding liquidity closed at maturity: the pool takes no new PT or SY. You can still withdraw your liquidity: choose Withdraw." After maturity the LP tab opens on Withdraw.

Withdrawing stays open. Your PT is then redeemed instead of sold: the details show **Your PT: Redeemed, not sold** and no fee, since redeeming takes no fee and nothing moves the pool's price. The redeemed part is paid in USDY even when you choose to receive SY. It is still three signatures to USDY, two to SY. Until the market is settled, the redeem step can need a fresh oracle price, as **Redeem at maturity** does (see [Portfolio and history](/using-the-app/portfolio)). See [Maturity](/how-it-works/maturity).

## Review and sign

Deposits and withdrawals are reviewed and signed like trades: one signature each, except the withdrawals that still take several steps (two to SY before maturity; three to USDY and two to SY after it), which are signed one step at a time. If a step is refused or fails, the route stops and tells you what you hold. Both are described in [Trade PT and YT](/using-the-app/trade).

Your LP position, its share of the pool's PT and SY and its estimated value appear in the [Portfolio](/using-the-app/portfolio).

**Next:** [Quick actions](/using-the-app/quick-actions).
