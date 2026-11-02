---
title: Quick actions
description: "Deposit, Withdraw, Split and Recombine PT + YT: the four Quick actions of a market page, and the one-step review."
order: 5
---

The **Quick actions** button sits on the heading row of a market's Trade panel. Its menu has four entries. Each opens a dialog with its own form.

| Menu entry | What it does | Signatures |
|---|---|---|
| Deposit USDY → SY | "Turn USDY into SY, the token the pool trades." | 1 |
| Withdraw SY → USDY | "Turn SY back into USDY." | 1 |
| Split USDY → PT + YT | "Split USDY into equal amounts of PT and YT." | 1 |
| Recombine PT + YT | "Give back equal amounts of PT and YT for USDY or SY, before maturity." | 2 to USDY, 1 to SY |

SY, PT and YT are explained in [Core concepts](/guide/core-concepts), and wrapping and splitting in [Tokenization](/how-it-works/).

## Deposit

The form is titled **Deposit**: "Wrap USDY into SY, the token the pool trades and PT + YT are minted from." Enter the **USDY to deposit**. The preview shows the **SY received**. A **Market (indicative)** block adds the **SY exchange rate** (USDY per SY), **Your deposit cap left**, and the room left in each circuit breaker that is on. On the Testnet market these limits are currently off, so the cap reads "No cap" and no circuit-breaker row shows; the **Safety** tab on the market page shows the live values. Click **Review Deposit**.

## Withdraw

The form is titled **Withdraw**: "Unwrap SY back into USDY." Enter the **SY to withdraw**; the preview shows the **USDY received** and the SY exchange rate. Use it, for example, for SY left over after a route stopped halfway. Click **Review Withdraw**.

## Split

The dialog is titled **Split USDY → PT + YT**, and the form inside it **Mint PT + YT**: "Deposit USDY and split it into PT, the fixed leg, and YT, the yield leg, in one transaction." Enter the **USDY to mint with**. The preview shows:

- **You receive**: the PT and the equal amount of YT.
- **Tokenization fee**: "Kept by the market from the SY, rounded up."
- **Deposited as SY first**: the transaction deposits your USDY, then mints from that SY.

Once the app has simulated it as your account, the preview shows the exact PT and YT, the fee and the **Minimum PT received (and as much YT)**.

The market block adds the oracle rate, the tokenization fee rate, your deposit cap and, when a circuit breaker is on, the room left in it; a split counts twice against it: once for the deposit, once for the mint. Click **Review Mint PT + YT**.

Splitting starts from USDY only. If you hold SY, the form says so and suggests using it to buy PT or YT, add liquidity, or withdraw it.

## Recombine PT + YT

Recombining gives back equal amounts of PT and YT, before maturity. Enter the **PT and YT to recombine**: the balance shown is the smaller of your PT and your YT. Choose **Receive as** USDY or SY. The details show:

- **You receive**: the USDY or SY you get.
- **SY from step 1**, when you receive USDY: recombining pays SY first, and step 2 turns it into USDY.
- **Burns**: the PT and the YT given back. "The yield your YT has already earned stays yours to claim."
- **Signatures**: two to USDY, one to SY.

Click **Review Recombine**. To USDY this is a two-step route, reviewed and signed step by step as described in [Trade PT and YT](/using-the-app/trade). The Portfolio opens the same form from **Exit (recombine PT + YT)**.

After maturity, recombining closes. The dialog says "PT and YT are now redeemed, not recombined" and links to **Redeem in the PT tab**.

## The one-step review

Deposit, Withdraw and Split are single transactions, and so are Claim yield and Redeem at maturity, both described in [Portfolio and history](/using-the-app/portfolio). Their review dialog is titled with the action, for example **Review: Deposit**: "Your wallet asks you to sign exactly this transaction. Check what you give and the least you get." It shows:

- **You give**: the exact amount, to the last digit.
- **You get at least**: the minimum signed into the transaction at your slippage tolerance. The transaction fails rather than give less. Claim yield and Redeem at maturity say instead that the call sets no minimum.
- **Fees**: "Network fee: up to" an amount of XLM, plus the tokenization fee for a split or the YT fee for a claim or a YT redemption.
- **Deadline** or **Valid until**: when the transaction can no longer land. A transaction is valid for 5 minutes from when it was prepared.
- **Technical details**, folded away.

The review is valid for 60 seconds; after that the app prepares it again with the live conditions. Click **Sign transaction** and approve in Varial.

The result appears as a notice and under the form, with the transaction hash and a **View on stellar.expert** link. A confirmed deposit, for example, reads "You deposited … USDY and received … SY." Once a transaction is confirmed or sent, the form clears. If you reject the signature, the app says the action "was not sent". If it fails on-chain, only the network fee is charged. In both cases your amounts stay, to correct and try again. If the result is "not known yet", look the transaction up by its hash before trying again.

**Next:** [Portfolio and history](/using-the-app/portfolio).
