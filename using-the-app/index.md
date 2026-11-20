---
title: Getting started
description: "Set up the Varial wallet on Stellar Mainnet or Testnet, connect it to the Principal app, and get your account ready: test USDY on Testnet, access on Mainnet."
order: 1
---

The Principal app runs on two Stellar networks, as two apps: the Mainnet app at `principalmarket.fi/app` and the Testnet app at `testnet.principalmarket.fi/app`. **Launch app** at the top of this site opens the app of the domain you read these docs on. A banner at the top of every app page says which network it runs on:

- **Mainnet**: "Stellar Mainnet · These markets use mock assets issued by Principal for testing." Each market's asset follows the price of a real asset and is not that asset (see [Supported assets](/guide/supported-assets)). Network fees are paid in real XLM.
- **Testnet**: "Stellar Testnet — test assets only, no real value." Everything there uses test assets with no real value.

This page takes you from an empty browser to a wallet that can use the markets: with test USDY on Testnet, or with access from the protocol team on Mainnet. For a guided run through the Testnet app with screenshots, from connecting to redeeming, see the [Testnet walkthrough](/using-the-app/testnet-walkthrough).

These pages use the Testnet asset, USDY, in their examples. On Mainnet the app names each market's own asset instead: where Testnet shows **Deposit USDY → SY**, a MOCKGILTS market shows **Deposit MOCKGILTS → SY**.

## Install Varial

Varial is the only wallet the app works with. It is the Stellar wallet formerly called Freighter, under its new name, and the app talks to its browser extension.

Open the app with **Launch app** at the top of this site. If the app does not find the extension, the button at the top right reads **Install Varial** and links to the Varial website. Install the extension, create or import an account in it, then reload the app.

## Switch Varial to the app's network

Each app accepts a wallet on its own network only: Mainnet for the Mainnet app, Testnet for the Testnet app. Open the Varial extension and set its network to match. The app cannot change your wallet's network for you.

If Varial is on another network, the wallet button turns red and reads **Wrong network · switch your wallet to Testnet** (**to Mainnet** in the Mainnet app; just **Wrong network** on a phone), and every action stays off with the message "Your wallet is on a different network from this market." Change the network in Varial: the app checks your wallet every few seconds and picks up the change by itself. If the app cannot read your wallet's network, the button reads **Network unverified** instead: reconnect your wallet. In both cases, on Testnet, **Get test tokens** is not in the address menu until the network is right.

## Connect your wallet

1. Click **Connect wallet** at the top right.
2. Approve the connection in the Varial pop-up.
3. The button now shows a green dot and your address, shortened to its first and last four characters.

Click your address to open its menu: **Copy address**, **Get test tokens** (Testnet only) and **Disconnect**. If Varial is locked, the app says "Your wallet is locked. Unlock it, then connect again."

## Get test tokens

This section is for Testnet; on Mainnet, see [Get access on Mainnet](#get-access-on-mainnet) below. A new Testnet account has no XLM for network fees, cannot hold USDY, and is not yet on Principal's permissioning allow-list, which every account must be on. The **Get test tokens** dialog takes care of all three. Open it from your address menu, or from the **Get test tokens** button a market's Compliance tab shows when your account is missing something.

The dialog lists three steps. Click **Start**: it runs, in order, every step that is not done yet.

1. **Fund your account.** Friendbot, Stellar's Testnet funding service, sends Testnet XLM to your account, for network fees and reserves. This step is done as soon as your account exists on the network.
2. **Add a trustline to USDY.** Varial asks you to sign one transaction, so your account can hold USDY. It is the only step you sign.
3. **Get access and USDY.** Principal's Testnet faucet authorizes your trustline, adds your account to Principal's allow-list, allows it to hold every market's PT and YT, and sends 100,000 USDY while you hold less than 10,000. You sign nothing for this step.

Each step shows its status: **To do**, **Working…**, **Sent — confirming**, **Done** or **Failed**. A step counts as Done only once the network shows it. When all three are done, the dialog says "Your account is ready. Balances and checks update within a few seconds." If you open it again while you hold at least 10,000 USDY and nothing else is missing, it says there is nothing left to do.

If a step fails, the dialog shows the reason and the button becomes **Try again**. Steps already done are kept. The faucet serves each account, and each connection, once a minute, and only a few accounts a minute in all: if it refuses, it asks you to try again in a minute.

This USDY is a test token issued by Principal for Stellar Testnet, not Ondo's USDY. See [Supported assets](/guide/supported-assets).

## Get access on Mainnet

Mainnet has no faucet and no **Get test tokens**. A market's **Compliance** tab lists what your account still needs, and on Mainnet each fix is one of three:

1. **XLM.** A new account does not exist on the network until it receives XLM, which also pays network fees and reserves. Send XLM to it from an exchange or another wallet, then reload.
2. **A trustline to the market's asset.** Click **Add trustline** in the Compliance tab and sign the one transaction in Varial. Each market has its own asset, so each market needs its own trustline. The mock assets do not require the issuer's authorization: the trustline is authorized as soon as you add it.
3. **Access from the protocol team.** The protocol team adds your account to Principal's allow-list, for your account and for the market's PT and YT, by hand. Under the checks, a **Request access** card shows your address, with a **Copy address** button, and what is still missing for this market. Send that address to the protocol team: the card says where, or reads "Ask the protocol team." while no contact is listed.

Each check turns **OK** once the network shows it. The Compliance tab explains each check; see [Markets and the market page](/using-the-app/markets).

## Set slippage and deadline

The settings button (the sliders icon next to your wallet) opens **Transaction settings**:

- **Slippage tolerance (bps)**: how much less than the quoted amount you accept before a transaction fails. 100 bps is 1%. The default is 50, and you can set 1 to 500.
- **Deadline (seconds)**: a transaction not included by then is rejected. The default is 300, and you can set 60 to 1800. Every transaction is also valid for only 5 minutes from when the app prepares it, so a deadline above 300 seconds does not give you more time. Three calls take no deadline at all: turning USDY into SY (the **Deposit** quick action), **Claim yield** and **Redeem at maturity**.

The app keeps both in your browser and uses them wherever a transaction takes a minimum or a deadline.

## How every action works

Every action in the app follows the same path:

1. **Fill in the form.** Each amount field shows your **Balance** and a **Max** button that fills it in. The figures are marked **Indicative** until the app has simulated the transaction as your account; they then read **Exact (simulated)**, or **Step 1 exact (simulated)** where only the first of several steps can be simulated ahead. While something stops the action, a box headed **Signing is off** says what, and the review button stays off.
2. **Review.** Click the button that starts with **Review**, for example **Review Buy PT**. A dialog shows what you give, the least you get, the fees and the time limit.
3. **Sign in Varial.** The dialog reads "Waiting for your wallet…" until you approve or reject.
4. **Read the result.** A notice gives the outcome, the transaction hash and a **View on stellar.expert** link.

Every trade and every liquidity deposit is one signature, on both networks. A few actions still take several transactions, one signature each: recombining PT + YT to USDY, taking liquidity out as SY before maturity, and withdrawing liquidity after maturity. [Quick actions](/using-the-app/quick-actions) and [Add and remove liquidity](/using-the-app/liquidity) say how many signatures each takes, and [Trade PT and YT](/using-the-app/trade) explains the route dialog and what happens when a step is refused. If a contract's data has expired on the network, the app first offers a restore: "Some contract data has expired — restore it first (one extra signature)."

A wallet that holds a role on a market, or that is the test asset's issuer authority, also sees a **Manage** link in the header. It opens the manager view, which is described in [Manage and create markets](/using-the-app/manage-markets). Most readers never see it.

The header's **Dashboard** link opens the public dashboard, which needs no wallet: the protocol's totals, oracle, risk limits, compliance tools and history, each figure with the contract call behind it. [Public dashboard](/using-the-app/dashboard) explains its views and how to check a figure yourself.

**Next:** [Markets and the market page](/using-the-app/markets). New to PT and YT? Read [Core concepts](/guide/core-concepts) first.
