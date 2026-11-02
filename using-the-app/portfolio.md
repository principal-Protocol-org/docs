---
title: Portfolio and history
description: "See your positions, claim YT yield, redeem at maturity and follow your transactions and routes in History."
order: 6
---

**Portfolio** and **History**, in the app's header, show what you hold and what you did, on every market. Both need your wallet connected.

## Your positions

The Portfolio shows one card per market where you hold something. If you hold nothing, it says "You hold nothing in any market yet." and links to the markets.

Each card starts with your balances: **USDY**, **SY**, **PT**, **YT** and **LP**. Then, depending on what you hold:

- **LP**: your share of the pool, as **PT** and **SY**, and the **Estimated value of your share** in USDY.
- **Oracle rate**, whether it is fresh or stale (older than 1 hour), and when it was updated.
- **YT**: your **Pending yield (net of the YT fee)**. Its tip gives the gross yield and the fee.
- **PT**: a **Fixed return if held to maturity** block, with the **Face value at maturity (USD)**, the **Current value (USD, at the pool price)**, the **Projected fixed return at maturity**, the **Fixed APY from now**, and what your PT **Redeems for** in USDY, marked indicative until the market settles.
- **PT or YT**: an entry line from your history, such as the fixed APY you locked when you bought PT, or the rate at your mint.

Below sit the shortcuts that apply to you: **Claim yield**, **Exit (recombine PT + YT)**, **Sell PT** and **Sell YT** before maturity or **Redeem at maturity** after it, **Withdraw liquidity**, and **Open market**. The Sell and Withdraw links open the market page on the right tab and side. Exit opens the Recombine form described in [Quick actions](/using-the-app/quick-actions).

## Claim yield

A YT earns the asset's yield until maturity, and you collect it without selling the YT. Click **Claim yield**. The dialog reads "Collect the yield your YT has earned since your last claim, paid in USDY. You keep your YT." Under **Your yield (indicative)** it shows the **Pending yield (gross)**, the **YT fee**, and **You receive (net)**.

Click **Review Claim yield**. The review says you get "Your pending yield, paid in USDY. This call sets no minimum." and lists the YT fee, "deducted from the yield before it is paid". Sign in Varial. Until the market is settled, claiming needs a fresh oracle price: if the oracle has not been updated in the last hour, signing stays off until the next update. How yield accrues is in [Yield](/how-it-works/yield).

## Redeem at maturity

Once the maturity date has passed, the **Redeem at maturity** shortcut opens the market's PT tab, which now holds the redeem form: "At maturity, PT pays USDY at the settlement rate and YT pays the yield it has left. Redeem either or both."

1. Enter the **PT to redeem**, the **YT to redeem**, or both.
2. Read the preview: **From PT** and **From YT (net of the YT fee)**, and under **Settlement**, the **Settlement rate**.
3. Click **Review Redeem at maturity**, then sign. It is one transaction.

If the market has not settled yet, the first redemption settles it for everyone, and the form says so. While the rate can still move, it also warns that the PT amount depends on the oracle rate when your transaction lands, and can only be lower than shown. A redemption sets no minimum. See [Maturity](/how-it-works/maturity).

## History

**History** lists "Your transactions on every market, read from the network events." A line above the table says which ledgers it covers, about how many days back: older activity is not available from the network.

The table has five columns: **Time** (UTC), **Action**, **Details**, **Status** and **Transaction**, whose shortened hash links to stellar.expert. A transaction you just sent from this browser shows as **Pending** until the network events include it, or **Not found — expired** if its time window closed first.

A multi-step route is one row, such as "Buy PT · 2 steps", with a **Steps** list you can open to see each step's status and hash. Its status reads **Completed**, **Returned to USDY**, **Waiting for the network**, **Interrupted** or **Stopped**. When a stopped route still holds your funds, the row says what you hold and offers **Continue**, which reopens the route on its market page where you left it. The app keeps routes in your browser, so Continue appears in the browser you used.

Next: [How it works](/how-it-works/), for the mechanics behind these screens, or [Risks](/guide/risks) before you trade.
