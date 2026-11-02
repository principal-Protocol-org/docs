---
title: Markets and the market page
sidebarTitle: Markets
description: "Read the market list and a market page: its stats, the fixed against variable APY chart, and the Details, Compliance and Safety tabs."
order: 2
---

**Markets**, the first link in the app's header, lists every market. Each market splits one yield-bearing asset into a principal token (PT) and a yield token (YT) with one maturity date. Click a market to open its page, where you trade. The terms used below are explained in [Core concepts](/guide/core-concepts).

## The market list

Markets are grouped by asset. On Testnet there is one asset, **USDY (test)**, noted "Test token issued by Principal for Stellar Testnet, not Ondo's USDY". Its row shows how many markets it has, their total liquidity and TVL, the best YT leverage and the best fixed APY among its live markets. Click the row to show or hide its markets; with a single asset it opens by itself.

Each market row shows its name, a status badge, the maturity date with the days left, and these columns:

| Column | What it shows |
|---|---|
| Liquidity / TVL | The pool's value in USDY, with the TVL under it: all USDY locked in the market. |
| Underlying APY (7 d) | The asset's own yield: how fast the oracle rate grew over the last 7 days, as an APY. With less history it says "since" a date. |
| Fixed APY, 30 d | A small line of the fixed APY over 30 days, and its change in points. |
| YT leverage | A chip with the YT leverage, for example "300x". |
| PT fixed APY | A chip with the fixed APY a PT buyer gets now. |

Click the **YT** or **PT** chip to open the market page on that tab, with **Buy** selected. A market whose pool has no liquidity yet shows "No price yet". A matured or settled market shows "Matured" or "Settled" instead of a chip, since it can no longer be bought into.

The status badge reads **Live**, **Paused** (the market's SY wrapper or pool, or risk control, is paused), **Matured** (the maturity date has passed), **Settled** (the settlement rate is recorded) or **Unavailable**. Time is read from the network's ledger, not from your computer's clock.

When a figure cannot be read, the app shows **Unavailable**, with the reason behind an info tip. It never shows a guess or a zero in its place.

## The market page

The top of the page shows the market's name, its status badge, the maturity date and a countdown such as "Matures in 89d 11h 46m". Below it, five stats:

- **Liquidity** and **TVL**, in USDY.
- **Underlying APY (7 d)**: the variable yield of the asset.
- **PT fixed APY**: hover it to see the pool's APR. "Fixed APY compounds it over the time left."
- **YT leverage**: 1 divided by the YT price. There is no borrowing.

How the fixed APY comes from the pool is in [Pricing and the AMM](/how-it-works/pricing-and-amm).

## The chart

The chart has two tabs. **APY** draws the **Fixed APY** against the **Underlying APY (7 d)**: the fixed rate you can lock in against the variable rate the asset pays. Point at the chart, or focus it and use the arrow keys, to read both values at a date; the tooltip adds the **Fixed premium**, the gap between them in points. **Liquidity** draws the pool's liquidity in USDY.

The range buttons are **7 d**, **30 d** (the default), **90 d** and **All**. If the latest recorded point is old, the chart says "History is N h old".

## Details, Compliance and Safety

Under the chart, a card has three tabs.

**Details** lists the market's facts in two groups. **Oracle & maturity**: the oracle rate, when the oracle was last updated, the maturity date, and the settlement rate once there is one. **Pool & fees**: PT and YT outstanding, the PT price at the pool's spot price, the pool's PT and SY reserves, and the tokenization fee, YT fee and swap fee. The swap fee "decreases to 0 at maturity". See [Fees](/how-it-works/fees) and [Oracle](/how-it-works/oracle).

**Compliance** has two parts. **Underlying asset** shows the issuer's settings for USDY: authorization required, authorization revocable, clawback enabled, and its administrator. **Your account**, once your wallet is connected, checks whether you can use this market: your account exists, you have a trustline to USDY, the issuer has authorized it, and Principal's permissioning allows your account, and allows it to hold this market's PT and YT. Each check reads **OK**, **Action needed**, **Blocked** or **Unavailable**, with the fix. Where the fix is the faucet, a **Get test tokens** button opens the dialog described in [Getting started](/using-the-app/). See [Compliance](/how-it-works/compliance).

**Safety** shows whether the SY wrapper, the market pool and risk control are paused, whether the oracle is fresh ("updated within the last hour"), the room left in the protocol-wide and USDY circuit breakers (or "No limit (disabled)" when one is off), and the room left under your own deposit cap (or "No cap (disabled)"). On the Testnet market these limits are currently off, so those rows read disabled; the card always shows the live values. See [Safety controls](/technical/security).

The Compliance and Safety tabs carry a small number: how many problems they report for you. Zero means nothing needs your attention. Compliance shows its number once your wallet is connected.

## The Trade panel

On a wide screen the **Trade** panel stays on the right while you scroll; on a phone it comes after the chart. It holds the PT, YT and LP tabs and the Quick actions menu.

**Next:** [Trade PT and YT](/using-the-app/trade).
