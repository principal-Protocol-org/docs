---
title: Testnet walkthrough
sidebarTitle: Walkthrough
description: "A guided run through the Principal app on Stellar Testnet, with screenshots: connect Varial, get test tokens, deposit, mint, trade PT and YT, add liquidity, claim yield and redeem."
order: 8
---

This page takes you once through the Principal app, from connecting a wallet to redeeming, in the order a new user meets its screens, on the Testnet market **USDY (test)**, which matures on 11 February 2027 at 08:59:04 UTC. Everything uses test assets with no real value. All you need is a browser with the Varial wallet extension, which step 1 sets up.

Each step says what to click, what the review shows and what to expect after. The amounts are the ones in the screenshots: they are small next to the market's pool, so they work as they are. The figures you see (prices, APYs, fees) move as people trade and as the oracle updates, so yours will differ a little from the screenshots. The pages linked in each step go into more depth.

## 1. Install Varial and switch it to Testnet

Varial, the Stellar wallet formerly called Freighter, is the only wallet the app works with.

1. Install the Varial browser extension from the Varial website, then create or import an account in it.
2. Open Varial and set its network to **Testnet**. The app accepts a wallet on Stellar Testnet only, and it cannot change your wallet's network for you.

Nothing in the app is needed for this step. If you open the app before installing Varial, the button at the top right reads **Install Varial** and links to the Varial website. See [Getting started](/using-the-app/) for the wallet states the app can show.

## 2. Connect

Open the app with **Launch app** at the top of this site. It opens on **Markets**. A banner at the top of every page says "Stellar Testnet — test assets only, no real value."

![The app's header on Stellar Testnet, under the Testnet banner: Markets, Portfolio and History on the left, and the Connect wallet button at the top right](/images/walkthrough/02-connect-wallet.png)

1. Click **Connect wallet** at the top right.
2. Varial opens a pop-up that asks you to connect the site. Approve it.
3. The button now shows a green dot and your address, shortened to its first and last four characters.

Click your address to open its menu: your full address, **Copy address**, **Get test tokens** and **Disconnect**.

![The address menu under the connected wallet button: the full address, then Copy address, Get test tokens and Disconnect](/images/walkthrough/02-address-menu.png)

If the button turns red and reads **Wrong network · switch your wallet to Testnet**, Varial is not on Testnet: change its network, and the app picks up the change within a few seconds.

## 3. Get test tokens

A new account holds nothing, and every account must be on Principal's allow-list before it can use a market. The **Get test tokens** dialog does it all.

1. In the address menu, click **Get test tokens**. The dialog lists three steps, each marked **To do**: **Fund your account**, **Add a trustline to USDY** and **Get access and USDY**.
2. Click **Start**. The dialog runs the steps in order.
3. For the second step Varial asks you to sign one transaction, which lets your account hold USDY. Review it in the pop-up and approve it. It is the only step you sign.

![The Get test tokens dialog before it starts: Fund your account, Add a trustline to USDY and Get access and USDY, each To do, and the Start button](/images/walkthrough/03-get-test-tokens.png)

Within a minute or two every step reads **Done**, and the dialog says "Your account is ready. Balances and checks update within a few seconds." Your account now holds Testnet XLM for network fees and 100,000 USDY, and it may hold every market's PT and YT. Close the dialog.

![The Get test tokens dialog once finished: all three steps Done, and the message that the account is ready](/images/walkthrough/03-account-ready.png)

If a step fails, the dialog gives the reason and the button becomes **Try again**; steps already done are kept. The faucet serves each account, and each connection, once a minute: if it refuses, wait a minute and try again. See [Get test tokens](/using-the-app/#get-test-tokens).

## 4. Deposit

On **Markets**, click the **USDY (test)** market to open its page. The **Trade** panel sits on the right. Steps 4 to 8 start in that panel. The market page itself is described in [Markets and the market page](/using-the-app/markets).

Deposit turns USDY into SY, the token the market's pool trades.

1. Click **Quick actions** at the top of the Trade panel, then **Deposit USDY → SY**.
2. Enter **500** in **USDY to deposit**. The form shows the SY you receive and the SY exchange rate.
3. Click **Review Deposit**.

The review, **Review: Deposit**, shows **You give** (500 USDY), **You get at least** (the SY, less your slippage tolerance, 0.5% by default), **Fees** (the network fee, at most a few hundredths of an XLM) and **Valid until**: the transaction is valid for 5 minutes from when it was prepared. The review itself is valid for 60 seconds; after that the app prepares it again with the live conditions.

![The Review: Deposit dialog: you give 500 USDY, you get at least 497.5 SY, the network fee, the time the transaction is valid until, and the Sign transaction button](/images/walkthrough/04-deposit-review.png)

Click **Sign transaction**, then approve the transaction in Varial. The dialog reads "Waiting for your wallet…" until you do.

After a few seconds the form clears and a notice under it reads "You deposited 500 USDY and received 500 SY.", with the transaction hash and a **View on stellar.expert** link. Close the dialog. More in [Quick actions](/using-the-app/quick-actions#deposit).

![The Deposit dialog after the transaction: the form is clear and a green notice says 500 USDY was deposited for 500 SY, with the transaction hash and a View on stellar.expert link](/images/walkthrough/04-deposit-done.png)

## 5. Mint PT + YT

Minting splits USDY into equal amounts of PT, the fixed leg, and YT, the yield leg. If the terms are new to you, [Core concepts](/guide/core-concepts) explains them.

1. Click **Quick actions**, then **Split USDY → PT + YT**.
2. Enter **300** in **USDY to mint with**. Once the figures read **Exact (simulated)**, the form shows **You receive** (about 299.87 PT and as much YT), the **Tokenization fee** and the **Minimum PT received (and as much YT)**. Because you hold SY from step 4, a line reminds you that minting starts from USDY.
3. Click **Review Mint PT + YT**.

![The Split USDY to PT + YT dialog with 300 USDY entered: about 299.87 PT and 299.87 YT received, the tokenization fee, the minimum received and the Review Mint PT + YT button](/images/walkthrough/05-split.png)

The review, **Review: Mint PT + YT**, shows **You give** (300 USDY), **You get at least** (the PT, "and the same amount of YT"), **Fees** (the network fee and the tokenization fee, already counted in the amounts) and a **Deadline**: if the transaction lands after it, the contract refuses it and only the network fee is spent.

![The Review: Mint PT + YT dialog: 300 USDY given, the least PT received and the same amount of YT, the network and tokenization fees, the deadline, and the Sign transaction button](/images/walkthrough/05-split-review.png)

Click **Sign transaction** and approve in Varial. The notice reads "You minted … PT and … YT from 300 USDY." More in [Quick actions](/using-the-app/quick-actions#split).

## 6. Buy and sell PT

A PT redeems for $1 of USDY at maturity, so buying it below $1 fixes your return.

**Buy PT.** The Trade panel opens on the **PT** tab, with **Buy** selected and **USDY** selected under **You pay**.

1. Enter **200** in **You pay**. **You receive (preview)** shows the PT.
2. Read the details once they are **Exact (simulated)**: **Value today**, **Fixed APY** now → after your trade (buying PT lowers it), **Your effective fixed APY**, **Price impact**, **Fees**, **Minimum received**, **At maturity** (your gain in USD) and **Signatures**: 1.
3. Click **Review Buy PT**.

![The Trade panel on PT, Buy, with 200 USDY entered: about 200.3 PT to receive, and the details from Value today to Signatures, above the Review Buy PT button](/images/walkthrough/06-buy-pt.png)

The review, **Review route: Buy PT**, says the trade takes one signature. It lists **Step 1: you give** (200 USDY), **Step 1: you get at least** (the PT, at your slippage tolerance), **Fees** (the network fee, and the pool's swap fee, "already counted in the amounts above") and the **Deadline**.

![The Review route: Buy PT dialog: one step, 200 USDY given, the least PT received, the network and swap fees, the deadline, and the Sign step 1 of 1 button](/images/walkthrough/06-buy-pt-review.png)

Click **Sign step 1 of 1** and approve in Varial. Once the transaction reaches the network the amount clears, the panel reads "Route complete: 1 of 1 steps confirmed" and a notice says "Buy PT: all steps confirmed."

**Sell PT.** Click **Sell**. Enter **100** in **You pay**, which is now in PT, and keep **USDY** under **You receive (preview)**. The details show the **Fixed APY**, which rises when you sell, the **Price impact**, the **Fees** and the **Minimum received**. Click **Review Sell PT**, then **Sign step 1 of 1**, and approve in Varial. As after the purchase, the amount clears, the panel reads "Route complete: 1 of 1 steps confirmed" and a notice says "Sell PT: all steps confirmed." The USDY is in your wallet.

![The Trade panel on PT, Sell, with 100 PT entered: the USDY to receive, the fixed APY rising, price impact, fees and minimum received, above the Review Sell PT button](/images/walkthrough/06-sell-pt.png)

More in [Trade PT and YT](/using-the-app/trade#the-pt-tab).

## 7. Buy and sell YT

A YT earns USDY's variable yield until maturity, then is worth 0.

**Buy YT.** Click the **YT** tab, with **Buy** selected.

1. Enter **0.5** in **You pay**. This is a budget: the most you want to spend, not the price. A YT costs a small fraction of a USDY, so half a USDY buys well over a hundred YT.
2. A line reads "Pay at most 0.5000 USDY · expected … · about … back in the same transaction": the transaction takes at most your budget and returns the rest at once.
3. The details show the **Fixed APY** now → after (buying YT raises it), the **Break-even APY**, the **Leverage** (YT received per dollar spent, with no borrowing), **Price impact**, **Fees**, **Minimum received** and **At maturity**: "YT worth 0". Price impact counts the fees, which weigh heavily on so cheap a token, so it can read high even for a small budget.
4. Click **Review Buy YT**.

![The Trade panel on YT, Buy, with a 0.5 USDY budget: about 185 YT to receive, the Pay at most line, and the details from Fixed APY to Signatures, above the Review Buy YT button](/images/walkthrough/07-buy-yt.png)

The review's **Step 1: you give** reads "0.5 USDY in; at most 0.5 SY of it is spent, the rest comes back as USDY in the same transaction". **Fees** lists the network fee, the tokenization fee and the swap fee: the pool mints PT and YT for you and sells the PT back to itself inside the one transaction.

![The Review route: Buy YT dialog: 0.5 USDY in with the rest returned in the same transaction, the least YT received, the network, tokenization and swap fees, and the Sign step 1 of 1 button](/images/walkthrough/07-buy-yt-review.png)

Click **Sign step 1 of 1** and approve in Varial. The panel reads "Route complete: 1 of 1 steps confirmed" and a notice says "Buy YT: all steps confirmed." The YT is in your wallet, and the part of your budget the trade did not spend is back as USDY.

**Sell YT.** Click **Sell**. Your YT balance now holds the YT from step 5 and from this purchase. Enter about half of it in **You pay**, keep **USDY** under **You receive (preview)**, and read the details: the **Fixed APY** falls, the **Price impact**, the **Fees** and the **Minimum received**. Click **Review Sell YT**, then **Sign step 1 of 1**, and approve in Varial. The panel reads "Route complete: 1 of 1 steps confirmed" and a notice says "Sell YT: all steps confirmed."

![The Trade panel on YT, Sell, with about half of the YT balance entered: the USDY to receive, the fixed APY falling, price impact, fees and minimum received, above the Review Sell YT button](/images/walkthrough/07-sell-yt.png)

More in [Trade PT and YT](/using-the-app/trade#the-yt-tab).

## 8. Add and remove liquidity

The **LP** tab adds USDY to the market's pool, for LP tokens, and takes it out again.

**Add liquidity.** Click the **LP** tab, with **Deposit** selected. **Keep YT** is on.

1. Enter **300** in **You pay**. With Keep YT on, part of your USDY is split into PT + YT, the PT and the rest go into the pool at its ratio, and you keep the YT.
2. **You receive (preview)** shows the LP and the YT. The details show the **Fixed APY** "(unchanged)", **Price impact** "None", **Split into PT + YT**, the **Fees** (the tokenization fee on the split part), the **YT you keep**, your **Pool share** now → after, the **Minimum received** in LP, what is **Left in your wallet** (a rounding remainder, since the pool takes PT and SY only in its exact ratio) and **LP earns**: "PT convergence", the rise of the pool's PT towards its value at maturity.
3. Click **Review Add liquidity (keep YT)**.

![The Trade panel on LP, Deposit, with Keep YT on and 300 USDY entered: the LP to receive, the fixed APY unchanged, no price impact, the part split into PT + YT, the YT you keep and your pool share](/images/walkthrough/08-add-liquidity.png)

The review, **Review route: Add liquidity (keep YT)**, lists the 300 USDY you give and the least LP you get. It adds that you keep the YT minted from part of your deposit, with no minimum set on it, and that any PT or SY the pool does not take stays in your wallet. **Fees** lists the network fee and the tokenization fee. It is one signature: a single call deposits the USDY, mints PT + YT from part of it and adds the PT and the rest to the pool.

![The Review route dialog for adding liquidity with Keep YT: one step, 300 USDY given, the least LP received, the fees, and the Sign step 1 of 1 button](/images/walkthrough/08-add-liquidity-review.png)

Click **Sign step 1 of 1** and approve in Varial. The panel reads "Route complete: 1 of 1 steps confirmed" and a notice says "Add liquidity (keep YT): all steps confirmed." You now hold LP tokens and YT. To put all your USDY in the pool and keep no YT, turn **Keep YT** off before you review: it is also one signature (200 USDY works, for example).

**Withdraw liquidity.** Click **Withdraw**. Enter about half of your LP in **You pay** and keep **USDY** under **You receive (preview)**: one call takes your liquidity out, sells the PT it returns and pays you USDY, one signature. The details show the **Fixed APY**, which rises as the PT is sold, the **Price impact** and **Fees** of that sale, your **Pool share** and the **Minimum received**. Click **Review Withdraw liquidity**, then **Sign step 1 of 1**, and approve in Varial. The panel reads "Route complete: 1 of 1 steps confirmed" and a notice says "Withdraw liquidity: all steps confirmed." The USDY is in your wallet, and the rest of your LP stays in the pool.

![The Trade panel on LP, Withdraw, with about half of the LP balance entered and USDY chosen to receive: the USDY to receive, the fixed APY, price impact, fees, pool share and minimum received](/images/walkthrough/08-withdraw-liquidity.png)

More in [Add and remove liquidity](/using-the-app/liquidity).

## 9. Claim yield

Your YT earns yield each time the market's oracle rate rises. On the Testnet market the oracle is updated about every 30 minutes (see [Oracle](/how-it-works/oracle)), so right after you buy YT there may be nothing to claim yet: the dialog then says "Nothing to claim yet" and its review button stays off. Come back after the next update.

1. Click **Portfolio** in the header. Your card for **USDY (test)** shows your **Pending yield (net of the YT fee)**.
2. Click **Claim yield** on the card. The dialog reads "Collect the yield your YT has earned since your last claim, paid in USDY. You keep your YT." Under **Your yield (indicative)** it shows the **Pending yield (gross)**, the **YT fee** and **You receive (net)**.
3. Click **Review Claim yield**.

![The Claim yield dialog: the pending yield, the YT fee and the net amount you receive, above the Review Claim yield button](/images/walkthrough/09-claim-yield.png)

The review, **Review: Claim yield**, says you get "Your pending yield, paid in USDY. This call sets no minimum." and lists the YT fee, deducted from the yield before it is paid. Your YT stays in your wallet.

![The Review: Claim yield dialog: the pending yield paid in USDY with no minimum, the network fee and the YT fee, and the Sign transaction button](/images/walkthrough/09-claim-yield-review.png)

Click **Sign transaction** and approve in Varial. The notice reads "You claimed … USDY of yield." The amount is tiny here: a few hundred YT earn about a tenth of a cent per oracle update. More in [Portfolio and history](/using-the-app/portfolio#claim-yield).

## 10. Portfolio and History

**Portfolio** shows one card per market where you hold something: your **USDY**, **SY**, **PT**, **YT** and **LP**, the market's oracle rate, your share of the pool and its estimated value, your pending yield, what your PT is worth if held to maturity, and the fixed APY you locked when you bought PT. Below sit the shortcuts that apply to you: **Claim yield**, **Exit (recombine PT + YT)**, **Sell PT**, **Sell YT**, **Withdraw liquidity** and **Open market**.

![The Portfolio card for USDY (test): the USDY, SY, PT, YT and LP balances, the oracle rate, the LP share and its value, the pending yield, the fixed return block, and the shortcuts](/images/walkthrough/10-portfolio.png)

**History** lists your transactions on every market, read from the network's events. A line above the table says which ledgers it covers, about the last seven days. The table has five columns: **Time** (UTC), **Action**, **Details**, **Status** and **Transaction**. The trades and liquidity moves you made in this browser come first, one row each, such as "Buy PT · 1 step", marked **Completed**, with a **Steps** list that opens to show the step and its transaction. The deposit, the mint and the claim follow, each with the **Details** of what moved, such as "Deposited 500 USDY", and a shortened hash that links to stellar.expert. A transaction you just sent shows as **Pending** for a few seconds, until the network's events include it.

![The History page: the ledgers it covers, then one row per trade and liquidity move of the walkthrough, each Completed with its Steps list, then the claim, the mint and the deposit with their details and transaction links](/images/walkthrough/10-history.png)

More in [Portfolio and history](/using-the-app/portfolio).

## 11. At maturity, Redeem

The market matures on 11 February 2027 at 08:59:04 UTC. Until then there is nothing to redeem, and you leave a position by selling it, by recombining PT + YT (**Exit (recombine PT + YT)** on the Portfolio card) or by withdrawing liquidity.

Before maturity, the Portfolio card shows what your PT will pay: the **Fixed return if held to maturity** block gives the **Face value at maturity (USD)**, the **Current value (USD, at the pool price)**, the **Projected fixed return at maturity**, the **Fixed APY from now**, and **Redeems for (USDY, indicative until settlement)**: what your PT pays out, which is final only once the market settles.

![The Fixed return if held to maturity block of the Portfolio card: face value at maturity, current value at the pool price, the projected fixed return, the fixed APY from now and what the PT redeems for, indicative until settlement](/images/walkthrough/11-held-to-maturity.png)

After maturity:

1. On the Portfolio card, the **Sell PT** and **Sell YT** shortcuts give way to **Redeem at maturity**. Click it: it opens the market's PT tab, which now holds the redeem form.
2. Enter the **PT to redeem**, the **YT to redeem**, or both. The preview shows **From PT**, **From YT (net of the YT fee)** and the **Settlement rate**.
3. Click **Review Redeem at maturity**, then **Sign transaction**, and approve in Varial. It is one transaction, paid in USDY.

The first redemption after maturity settles the market for everyone, at the oracle rate of that moment. Liquidity can still be withdrawn after maturity; adding it closes. See [Redeem at maturity](/using-the-app/portfolio#redeem-at-maturity) and [Maturity](/how-it-works/maturity).

## If a step does not go through

- **You rejected the signature in Varial or closed the review.** Nothing was sent, and your amounts stay in the form.
- **A transaction failed on the network.** Only the network fee was charged. The panel gives the reason and offers **Continue**, which tries again.
- **Signing is off.** A box headed **Signing is off** under the form lists what stops the action, such as an amount above your balance or an oracle price that is not fresh.

[Trade PT and YT](/using-the-app/trade#when-a-step-is-refused-or-fails) covers every case. [Risks](/guide/risks) explains what each position can lose.
