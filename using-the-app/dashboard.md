---
title: Public dashboard
sidebarTitle: Dashboard
description: "Follow the Principal protocol's state and history on Mainnet or Testnet without a wallet, and check any figure against the contracts yourself."
order: 9
---

The public dashboard shows what Principal's contracts answer right now, and what has happened on them: the markets' totals, the oracle, the risk limits and pauses, the compliance tools, and every protocol event. It is part of the app on each network, Mainnet and Testnet, shows that network's contracts, and anyone can open it.

You do not need a wallet. No dashboard page asks for one, reads one or signs anything, so you can follow the protocol without connecting.

To open it, click **Launch app** at the top of this site, then **Dashboard** in the app's header. The dashboard's own header has six views, **Overview**, **Markets**, **Oracle**, **Risk**, **Compliance** and **Activity**, and **Open the app** takes you back to the markets.

![The dashboard's overview on Testnet: the six views in the header, then Protocol totals and Safety side by side, each panel with the ledger it was read at and how often it refreshes](/images/dashboard/overview.png)

## What each view shows

### Overview

The protocol at a glance.

- **Protocol totals**: the **TVL**, which is the underlying asset held by every market's SY wrapper plus what its RecoveryEscrow holds (USDY on Testnet; on Mainnet, where the markets use five different assets, the sum is in underlying units); the **TVL in USD**, each market's TVL times its own oracle value, added up; the number of **Markets**; and **Pool liquidity**, each pool's PT and SY valued at the pool price.
- **Safety**: the **RiskControl capacity** left in the current window (or "No limit (disabled)"), the **Wrap-and-mint capacity** (half of it, because depositing USDY and minting PT and YT from it count against the same limit twice), the **Pauses** (or "None paused"), the **Oracles** (how many are fresh, for example "1 of 1 fresh" on Testnet, naming any that are not, with an **Each oracle** link), and the **Open alerts**.
- **Latest compliance events**: the five newest seizures and allow-list changes.
- **Event index**: how far the history goes, explained in [Where the history comes from](#where-the-history-comes-from).

### Markets

Every market the app lists, one row each: the PT and YT **Supply**, the pool's PT and SY **Reserves**, the **LP supply**, the **Liquidity**, the **TVL**, and the unclaimed **Protocol fees** and **Creator fees**. **Totals** over every market sit above the list.

Open a market for its own page:

- **Market figures**: PT and YT supply, the pool's reserves, LP supply, pool liquidity, TVL, and what the SY wrapper and the RecoveryEscrow hold.
- **Settlement**: the maturity, the settlement rate and the YT yield index.
- **Fees**: the unclaimed fees, the protocol share, the tokenization fee, the YT fee and the swap fee tier.
- **Fee recipients**: the treasury, the creator and the protocol admin.
- **Pending yield**: paste any Stellar address (G… or C…) to see the YT yield it can claim, net of the YT fee.

### Oracle

The OracleAdapters that give the markets their reference value: one per market on Mainnet, one for the Testnet market. See [The oracle](/how-it-works/oracle) for how it works.

- **Oracles**: one row per oracle, with its asset, its **State**, the time until operations block (**Blocks in**) and its **Update path**. Click one to see it in detail in the panels below; the first is shown by default.
- **Reference value**: the **Value**, its **Timestamp**, its **Freshness** and the **Time until operations block**. Both are counted on the network's ledger clock, not your computer's, so a wrong clock on your side does not change them.
- **Policy**: **Max stale** (how old the value may be), **Deviation cap** (how far one update may move it) and **Value bounds**. On the Testnet market's oracle these are one hour, 1,000 bps (10%) and none.
- **Sources**: who may set the value. Each source is a 32-byte id, the hash of a readable name.
- **Feed**: the price feed the oracle reads, on the Mainnet oracles: the **Feed contract**, the **Asset key** it asks the feed for, the **Minimum interval between feed updates**, the **Feed price** (the feed's latest price, converted to the oracle's 7 decimals), the **Feed tick age**, and the **Stored value against feed**, how far the oracle's value is from the feed's price. An oracle with no feed set reads "No feed source set: updated by push only." The Testnet market's oracle has no feed in its code, so the panel says it is not supported.
- **Update path**: whether the current value was pushed by the oracle's admin or read from a price feed. The Testnet market's oracle has no view for this, so the panel says it is not supported by this oracle's code; the update history still lists every value set.
- **Last rejection**: the latest update the oracle refused, and why.
- **Rejection history** and **Update history**: every refused and every accepted update, newest first, each with its transaction.
- **Keeper**: the service that keeps the value fresh. Its **Health**, its **Last successful update**, its rejected and failed runs in the last 24 hours, and its recent runs.

![The Oracle view: the reference value with its timestamp, freshness and time until operations block, the policy, the sources and the update path](/images/dashboard/oracle.png)

### Risk

RiskControl, the protocol's circuit breaker and pause switch. See [Risks](/guide/risks) for what they protect.

- **Circuit breaker**: the **Limit** on deposits per window, the **Volume in this window** (**Volume counted now** on Mainnet) and what remains.
- **Window**: when the current window started, how long it lasts, and its state. On Testnet the window is fixed: it is open through a given ledger, then lapses, and the next deposit opens a new one. On Mainnet, which runs a newer version of the contracts, it slides, and its state reads "Sliding window of N ledgers: used volume decays as older deposits leave it", N being its length: room frees up gradually and the window never resets.
- **Per-asset limits**: one limit per underlying asset, in the same window.
- **Pauses**: whether RiskControl and each market's SY wrapper, manager and pool are paused. A paused contract refuses deposits and mints.
- **Pausers**: the accounts allowed to pause, each checked live.
- **Limit changes** and **Pause history**: every change of a limit or of the window, and every pause and unpause, newest first.
- **Exhaustion history**: each time a limit was reached in the last 7 days. A deposit refused by the circuit breaker leaves no event on the network, so this list comes from the dashboard's own alerts.

### Compliance

The tools behind Principal's compliance rules. See [Compliance](/how-it-works/compliance) for the full picture.

- **Underlying asset**: for each market's asset (USDY on Testnet, the five mock assets on Mainnet), who administers it on the network (**Administrator**), and what its issuer may do (**Authorization required**, **Authorization revocable**, **Clawback enabled**).
- **Permissioning**: how many times accounts were added to and removed from the allow-list.
- **RecoveryEscrow records**: each seizure. The account, what was taken (SY shares, LP, PT and YT), what it was turned into, and the seizure and settlement transactions. When the network has archived a record, it is shown from the event index and marked **Archived**.
- **Reconciliation**: the escrow's own record count compared with the seizures in the event index. They should match.
- **Seizure history**: every seizure, newest first.

### Activity

Every protocol event the index holds, newest first: trades and liquidity, SY deposits, oracle updates and rejections, RiskControl and allow-list changes, and seizures. Each row links to its transaction on stellar.expert. The filters at the top narrow the list by kind. They are part of the page's address, so a filtered view can be shared as a link.

## Check a figure yourself

Every figure read from a contract has an info button beside it, named "How to verify" and the figure's name. It opens the **How to verify** panel, which lists:

- **Value** and **Raw value**: the figure as shown, and the numbers the contracts returned.
- **Scale**: how to read a raw number, for example "7 decimals: 10,000,000 = 1 USDY".
- **Contracts**: each contract read, with a link to its page on stellar.expert.
- **Function and arguments**: the contract functions called, and what was passed to them.
- **Ledger**: the ledger the network answered at.
- **RPC endpoint**: the server the app read through.
- **Status**: **Live** and how long ago it was read, or one of the states below.
- **Re-read it**: one command per contract call, each with a **Copy** button. Some figures take more than one call: the TVL adds what the SY wrapper holds to what the RecoveryEscrow holds, so it lists two.
- **Raw XDR (base64)**, at the bottom: each answer exactly as the network sent it, for anyone who wants to decode it with `stellar xdr decode --type ScVal`.

![The How to verify panel for TVL: the value and raw value, the scale, the two contracts with their stellar.expert links, the functions called, the ledger, the RPC endpoint, the status, and the first of the two commands to copy](/images/dashboard/verify-drawer.png)

The command is a simulation: it signs nothing, sends nothing and needs no account of yours. With the [Stellar CLI](https://developers.stellar.org/docs/tools/cli) installed, paste it into a terminal. For the oracle's value it reads:

```bash
stellar contract invoke --network testnet --id CDYGBFGO7KD446CDTGJ7M4OWUXC7UPBGPVM5CUWP2NSNX2CKK2TYYIPS --source-account GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF --send=no -- get_reference_value
```

That is the Testnet command. On Mainnet, the command gives the RPC endpoint and the network passphrase (`--rpc-url` and `--network-passphrase`) in place of `--network testnet`.

The answer is the raw value as of the newest ledger. If the figure changed since the dashboard read it, the panel's **Ledger** says which ledger its own answer came from.

Every view except Activity, and each market's page, also has a **Copy evidence table** button. It copies every figure of the page, with its contract, function, ledger and command, as a table you can paste into a document.

## Unavailable, Stale and Read across ledgers

- **Unavailable** means the figure could not be read, and the dashboard does not guess. The reason is beside it. Its info button, then named for example "Why TVL is unavailable, and how to verify it", gives the command to try the read yourself. A total over several markets is Unavailable as soon as one market's figure is: the dashboard never shows a partial sum.
- **Stale** means no new read has arrived for twice the refresh time, for example "Stale: no new read for over 30 s", while the last one still stands. This happens when your browser pauses a tab in the background. A refresh that fails does not leave the old value showing: the figure turns Unavailable, with the reason "the last refresh failed" and the error.
- **Read across ledgers** means a panel's figures were answered at different ledgers, for example "Read across ledgers 5720000–5720001". The network closes a ledger every few seconds and the dashboard reads several contracts at once, so their answers can come from neighboring ledgers. Each figure is still exact at its own ledger, which its info button shows.

Each panel also says when it was read and how often it refreshes, for example "Ledger 5720001 · read 4s ago · Refreshes every 15 s". Live figures (the oracle, the risk limits, the pauses and a market's page) refresh every 15 seconds. Totals, the markets list and the history refresh every minute.

## Where the history comes from

The history lists, from the update and rejection history to the pause history, the seizures, the allow-list counts and the Activity view, come from the app's event index. It reads every event Principal's contracts publish on the network and keeps it. The network's own servers keep only about a week of events, so the index is what lets the dashboard show history from the start.

Every list says how far the index goes, for example "Indexed through ledger 5720000 · lag 3m · Refreshes every 1 min". The lag is how far the index is behind the network; over an hour, the line adds "over 1 hour behind". If the index ever misses a range of ledgers, the list says so with the range, for example "Gap: oracle ledgers 5700000–5700500 are not indexed", rather than leaving a silent hole. The overview's **Event index** panel shows the same: **Indexed through ledger**, **Lag**, **Gaps**, and the **RecoveryEscrow check** described under Compliance.

Each history row links to its transaction on stellar.expert, so you can check any event there too.

**Next:** back to [Getting started](/using-the-app/), or read [How it works](/how-it-works/) for the contracts behind each view.
