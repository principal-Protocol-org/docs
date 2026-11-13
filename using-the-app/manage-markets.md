---
title: Manage and create markets
sidebarTitle: Manage markets
description: "The manager view and the seven-step wizard that creates a market: who can use them, what each step asks for, who signs it and when a step is refused."
order: 7
---

The **Manage** view and the **New market** wizard are for the people who run a market, not for traders. Every action in them needs a role: the asset's issuer authority, the RiskControl or Router admin, or the Permissioning admin. The asset's issuer authority is the admin of the asset's Stellar Asset Contract, and the app calls it the "issuer". On Testnet Principal's own keys hold every one of these roles, so a reader cannot create a market today. This page shows what the issuer of a real asset does, and what you see if your wallet holds a role on a market.

## Who sees what

The **Manage** link in the header appears only for a wallet that holds a role on a market, or that is the test asset's issuer authority. The view lists the roles it reads on each market's own contracts:

- **Issuer**: the asset's issuer authority. It creates markets on its asset.
- **Creator**: the market creator its config records, which for a market on a Stellar asset is the asset's issuer authority. It claims the creator fees.
- **Protocol admin**: it claims the protocol's fees and can change the protocol share and the treasury.
- **Contract admin (pool, SY wrapper, manager)**: the admin of one of the market's own contracts. It can pause that contract.
- **Router admin**, **RiskControl admin** and **Permissioning admin**: the admins of the shared contracts. They sign steps 4 and 5 of the wizard.

You only see the actions your role can sign. If you connect the wrong wallet, the refusal says who can: "Only {who} can {can}. You are connected as {short}, which is not {who}. Connect {who}'s wallet to sign this."

## The manager view

Open **Manage** in the header. The page is headed "Manage" and says: "The markets where your wallet holds a role. You see only the actions that role can sign, and every one is reviewed in your wallet before it is sent." Under it, **Connected as** shows your shortened address, and two buttons switch the list: **My markets ({n})**, the markets where your wallet holds a role, and **All ({n})**, every listed market, read-only for a market where you hold no role.

If your wallet holds no role, the list says "This wallet does not hold a role on any listed market. Roles are the asset issuer, the market creator, the protocol admin and the admin of a market's pool, SY wrapper or manager."

If your wallet is an asset's issuer, a box reads "You are an asset's issuer, so you can create a market on it." with a **New market** button that opens the wizard.

### Market cards

Each market is a card with its name and status. A role holder sees:

- **My roles**: the role names above, separated by "·".
- **Oracle**: **Fresh** or **Stale**, and how long ago the price was updated.
- **Liquidity**: what the pool holds.
- **Pool**, **SY wrapper** and **Manager**: **Running** or **Paused**, for each contract you administer.
- **Creator fees to claim** and **Protocol fees to claim (treasury)**: the fees waiting in the pool and the manager, in SY, or "Nothing to claim".

A figure the app cannot read says "Unavailable" with the reason, never a zero.

### Actions

These are all the actions the view offers. There is no action to change fees, add permissions, transfer an admin role or change the treasury.

| Button | Who sees it | What it does |
|---|---|---|
| **Pause pool** / **Unpause pool** | the admin of the pool | stops or restarts the pool |
| **Pause SY wrapper** / **Unpause SY wrapper** | the admin of the SY wrapper | stops or restarts the SY wrapper |
| **Pause manager** / **Unpause manager** | the admin of the manager | stops or restarts the PrincipalManager. While it is paused, minting, buying and selling YT, recombining, claiming and redeeming are refused. |
| **Claim creator fees** | the Creator | pays the accrued creator fees |
| **Claim protocol fees (to treasury)** | the Protocol admin | pays the accrued protocol fees to the treasury |

The button shows the action the contract allows: **Pause** while it is running and **Unpause** while it is paused. A claim button is off while nothing has accrued. Every action opens the same review dialog as the rest of the app, "Review: {title}", and you sign it with **Sign transaction** in Varial. Each one is a single transaction.

### Markets being created

A market that has been deployed and is not yet in the market list appears under **Markets being created**, as a row with the pool's shortened address and a **Resume at step {N}** button, which opens the wizard where the market stands. If the app cannot reach the registry, it says "Markets started from other browsers could not be read from the registry right now. Their wizard links still open them."

In the **All** view, a **Not listed** section shows the markets that failed the registry's checks. Each reads "Not listed because {reason}", with what to fix. If there are none, it says "Every market the registry knows is listed."

## The wizard

**New market** opens `/app/manage/new`. The page says: "Seven steps, from the parameters to the market list. Every transaction is reviewed and signed in your wallet, and where the market stands is read from the chain, so you can stop and come back with this page's link."

The link holds a random salt that fixes the addresses of the market's seven contracts. Nothing is saved in a draft: the app reads from the chain which steps are done, shows the step the market has reached and marks the earlier ones **Done**. A step you can no longer sign, because the chain already has it, says so and the wizard moves on.

| Step | What you do | Who signs |
|---|---|---|
| 1 Parameters | Pick the **Asset** from the assets this network knows and set the **Maturity (UTC)**, the PT and YT names and symbols, and the settings below. The fields start with the current market's values, read on its contracts. A read-only box lists the shared contracts (MarketFactory, Permissioning, Oracle, RiskControl, Router) and the code each market contract runs. Then **Next: preview the addresses**. | nobody |
| 2 Addresses | Read the seven addresses the market will have: SY wrapper, PT, YT, Market config, PrincipalManager, Pool and Recovery escrow. Then **Next: deploy**, or **Back**. | nobody |
| 3 Deploy | Three transactions, "1. SY wrapper, PT and YT", "2. Market config and PrincipalManager" and "3. Pool and recovery escrow". Click **Deploy the market**, or **Continue the deployment** if some are done. **Edit the parameters** goes back to step 1. | the asset's issuer authority |
| 4 Wire | RiskControl lists the SY wrapper as a consumer, RiskControl lists the PrincipalManager as a consumer, and the Router registers the pool. Click **Wire the market**. | the RiskControl admin and the Router admin |
| 5 Permissions | The market's contracts and its treasury need authorization on the asset and Principal permissions before the pool can be seeded. The step lists 17 items, each read live from the chain, and offers only the ones still missing: 5 asset authorizations (such as "{holder} is authorized to hold USDY"), 6 account permissions ("{holder} has a Principal permission") and 6 permissions to hold the market's PT and YT ("{holder} may hold PT" or "may hold YT"). Click **Sign the permissions**. | the asset's issuer authority signs the authorizations, the Permissioning admin signs the rest |
| 6 Seed the pool | Enter the **Starting fixed APY (%)** and the **Amount (USDY)**. Part of the amount is minted into PT and YT and the rest deposited as SY, and the pool takes the PT and SY in the ratio that prices that APY. Click **Seed the pool**. It is three transactions: the mint, the deposit and the pool's first deposit. | the asset's issuer authority |
| 7 Publish | Click **Publish the market**. The registry checks it and lists it. | nobody |

Step 1's settings are **Tokenization fee (bps)** (at most 100), **YT fee (bps)** (at most 5000), **Swap fee tier (bps)** (at most 500), **Protocol share (bps)** (at most 10000), **Time stretch (years)** (1 to 20), **Treasury** and **Protocol admin**. Each field shows its own help text. 100 bps is 1%. The app checks every field the way the contracts do and names the ones to fix: for example, with a time stretch of 4 years the maturity must be within three quarters of it, 3 years, from now. [Fees](/how-it-works/fees) and [Pricing and the AMM](/how-it-works/pricing-and-amm) explain what the settings do.

If another wallet must sign a step, the step names the account: "Must be signed by {address}". That account can finish the step from its own wallet, using the same link. If it is your wallet, it says "You sign this: you are its admin." In step 3 any other wallet reads "Only the {code} issuer can deploy this market: every contract checks the asset contract's admin, which is {address}."

### What step 6 refuses

The seed is worked out before you sign, and the step stays off with a message when it would fail:

- **A starting APY of 0% or less.** "Enter a starting APY above 0%. At 0% or less the pool prices PT at or above par, and then YT cannot be bought in this market."
- **PT at or above par.** "This PT and SY would price PT at or above par: the starting APY must be above 0%, or YT cannot be bought in this market. Enter a higher APY."
- **Too little liquidity.** "The amount is too small: the pool's first deposit must give more than 1,000 units of liquidity (the square root of PT × SY). Enter a larger amount."
- **An APY too high.** "This starting APY is too high for the pool's curve to price. Enter a lower one."
- **A stale oracle.** "The oracle price is stale, and the pool takes no first deposit without a fresh one. Wait for the next oracle update, then try again."
- **A pool already seeded.** "The pool is already seeded: its first deposit has been made, so there is nothing left to seed. Close this; the wizard moves on."

The plan shows **Minted into PT and YT**, **Deposited as SY**, **The pool takes**, **Starting fixed APY** and **Your liquidity**. The pool keeps 1,000 raw units of liquidity forever. The amounts are final only in each review. If a seed was started and not finished, the step says "Your wallet already holds {n} PT and {n} SY of this market: a seed was started and not finished." and finishes with that PT.

## Publishing

Step 7 signs nothing. **Publish the market** sends the pool to the registry, which checks it like every market it lists: the Router lists the same contracts, each contract is wired to this network's shared contracts, and each runs the code this network's manifest pins. If it passes, the step reads "Published: {name}, maturing {date}, is in the market list." with **Open the market** and **See the market list** buttons. If not, it says "Not listed because {reason}" and what to fix. The market then appears in the market list on every browser.

## Resuming

Closing the tab loses nothing. Open the wizard's link again, or click **Resume at step {N}** in **Markets being created**. The app keeps the salt in your browser from step 3 on, and the registry also indexes the factory's salts, so the resume row appears from any browser for the asset's issuer authority and for the market's protocol admin.

**Next:** [Portfolio and history](/using-the-app/portfolio) shows your positions on every market. [Compliance](/how-it-works/compliance) explains the permissions a market's contracts need.
