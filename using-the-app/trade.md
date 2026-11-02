---
title: Trade PT and YT
description: "Buy and sell PT and YT in a market's Trade panel, review every step and sign it in your wallet."
order: 3
---

The **Trade** panel of a market page has three tabs: **PT**, **YT** and **LP**. This page covers PT and YT, which each have a **Buy** / **Sell** toggle. [Add and remove liquidity](/using-the-app/liquidity) covers LP, whose sides are **Deposit** / **Withdraw**. For which to use when, see [Strategies](/guide/strategies).

## USDY or SY

Every buy has a **Pay with** choice under **You pay**, and every sale a **Receive as** choice under **You receive (preview)**: **USDY**, the default, or **USDY** with an **SY** badge, its SY version.

The pool trades SY, so paying or receiving in USDY adds steps: the app turns USDY into SY first, or SY back into USDY at the end. Each step is a transaction you sign. The **Signatures** row of the details gives the count, and its info tip lists the steps.

| Action | In USDY | In SY |
|---|---|---|
| Buy PT | 2 signatures | 1 signature |
| Sell PT | 2 signatures | 1 signature |
| Buy YT | 3 signatures | 1 signature |
| Sell YT | 2 signatures | 1 signature |

## The PT tab

**Buy PT**: "Each PT redeems for $1 of USDY at maturity, so buying it below $1 fixes your return in USD." Enter what you pay; **You receive (preview)** shows the PT. The details add:

- **Value today**: what that PT is worth at the pool's price now.
- **Fixed APY**: the pool's fixed APY now → once your trade lands. Buying PT raises its price, so the fixed APY falls.
- **Your effective fixed APY**: what you lock in, valued in USD at today's USDY oracle rate.
- **Price impact**: your price against the pool's spot price, swap fee included.
- **Fees**: the pool's swap fee.
- **Minimum received**: the least you accept, at your slippage tolerance.
- **At maturity**: your gain in USD, fixed whatever USDY's price does.

**Sell PT** sells PT before maturity. Its details show Fixed APY, Price impact, Fees and Minimum received; selling lowers the PT price, so the fixed APY rises.

## The YT tab

**Buy YT**: "A YT earns USDY's variable yield until maturity, then is worth 0. Enter what you want to spend." Buying YT raises the fixed APY. Besides Price impact, Fees and Minimum received, the details show:

- **Break-even APY**: you gain if USDY's average APY until maturity is higher.
- **Leverage**: YT received per dollar spent. There is no borrowing.
- **Spends at most**: the most the trade may cost at your slippage tolerance.
- **At maturity**: "YT worth 0".

A buy also shows **Moves**, **Spends** and **Comes back (step N)**, N being the step that hands the rest back to you. To buy YT the app mints PT + YT from a larger amount and sells the PT straight back, so your balance must cover what is moved, not only what you spend. This holds whether you pay in USDY or in SY. **Max** takes this into account. The mechanism is in [Pricing and the AMM](/how-it-works/pricing-and-amm).

**Sell YT** sells YT before maturity; the fixed APY falls.

## Review and sign

Click the review button, such as **Review Buy PT**. It stays off while a box headed **Signing is off** lists a reason, such as an amount above your balance.

The dialog, **Review route: Buy PT**, says how many signatures the trade takes and lists every step with what you give and get. For the step about to be signed it shows:

- **Step 1: you give** and **Step 1: you get at least**: the exact amounts, with a minimum from a fresh simulation at your slippage tolerance.
- **Fees**: "Network fee: up to" an amount of XLM and, where the step has one, the swap or tokenization fee, "already counted in the amounts above".
- **Deadline** or **Valid until**: when the transaction can no longer land.
- **Technical details**: the contract call and the transaction hash, folded away.

Each later step says its minimum "is set from a fresh quote once step N is confirmed, not from this review", N being the step before it. Click **Sign step 1 of 2** and approve in Varial. Once a step is confirmed, the next is prepared from what it actually produced, and you sign it the same way. The amount fields clear once a step reaches the network. At the end the panel reads "Route complete".

A step left unsigned for 60 seconds expires and the route stops. **Cancel** before step 1 drops the route; nothing was sent.

## When a step is refused or fails

The route stops. The panel shows **Step n of m**, the reason, and what the confirmed steps left you, such as "You hold … SY". Then:

- **You rejected the signature, cancelled the review, or it expired.** Nothing was sent. **Continue** prepares the step again with a fresh quote.
- **The step failed on-chain.** Only the network fee was charged. **Continue** tries again.
- **The result is not known yet.** The route waits and never sends the step twice. Click **Check again**.
- **Back to USDY** turns leftover SY into USDY in one signature. It appears only when SY is all the route left you; otherwise the panel says what else to do.

Closing a route that holds funds asks you to confirm. It then stays in History with a **Continue** link.

## After maturity

The PT tab reads "This market has matured: redeem your PT" and shows the **Redeem at maturity** form. The YT tab reads "YT trading has closed": a YT earns nothing more, and redeeming it pays the yield it earned. See [Portfolio and history](/using-the-app/portfolio) and [Maturity](/how-it-works/maturity).

**Next:** [Add and remove liquidity](/using-the-app/liquidity).
