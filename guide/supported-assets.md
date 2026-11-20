---
title: Supported assets
description: "The assets you can use with Principal today: five mock assets on Stellar Mainnet, USDY (test) on Stellar Testnet, and the real assets listed as coming soon."
order: 4
---

Principal runs on two Stellar networks: on Mainnet, with five markets on mock assets issued by Principal for testing, and on Testnet, with one market on one test asset. This page lists them, and the real assets listed as coming soon.

## On Testnet: USDY (test)

| Field | Value |
|---|---|
| Market | USDY (test) |
| Network | Stellar Testnet |
| Asset code | USDY |
| Issuer | `GDUGKHAJJPEYRF4T5XG7HJSUY3AGMHKHCSTSLZSGOCK2673N5ZKDFIDT` |
| Decimals | 7 |
| Maturity | 11 February 2027, 08:59:04 UTC |

**USDY (test) is a test asset.** Principal issued it from a test account it holds, for Testnet only. Ondo did not issue it, and it has no value. It shares the code USDY with Ondo's asset, so check the issuer above if your wallet shows more than one USDY.

Its dollar value comes from a test oracle, which Principal's own keeper raises at a set yearly rate on a regular schedule. That value follows no real Treasury yield and no price of Ondo's USDY, so the returns you see on Testnet say nothing about real ones.

The test asset behaves like a regulated one. Its issuer requires authorization for every account that holds it, can revoke that authorization, and can claw balances back. Principal's compliance rules therefore apply on Testnet as they would on a real asset: an account needs the issuer's authorization before it can hold USDY (test), SY, PT or YT, and a place on Principal's shared allow-list before it can hold SY, PT or YT. On Testnet, those issuer powers sit with Principal's test accounts, and the test asset's issuer account runs the allow-list.

You do not have to arrange any of this yourself: **Get test tokens** in the app sets up your account, has it authorized, adds it to the allow-list and sends you test USDY. [Getting started](/using-the-app/) walks you through it. Only Principal can open new Testnet markets today, because creating one needs the issuer authority's key.

## On Mainnet: five mock assets

On Stellar Mainnet, Principal's markets use five assets that Principal issued for testing. Each one follows the price of a real asset and is not that asset. The app says so beside each of them, for example "Mock asset issued by Principal for testing. It follows the price of USDY and is not USDY.", and a banner at the top of every app page reads "Stellar Mainnet · These markets use mock assets issued by Principal for testing."

| Asset code | Follows the price of | Issuer |
|---|---|---|
| MOCKUSDY | USDY | `GB3SOEMQVYBLMHPV3AK64PV4FJTOMQ2XUJLOZSVDJLP2LT42EU3XLE4P` |
| MOCKUSTRY | USTRY | `GDM2Q2F5KC2ECQZ5C3TIPTM7UTZJ775G4UZCLLGYULZUMBI6VEQERK4K` |
| MOCKGILTS | GILTS | `GA5KXEPU7FLWKNG255WKYSYQ5U3G7WHFKD7HTTK2DR37KYJJ7V6GOR3G` |
| MOCKCETES | CETES | `GBB6TITJASKDTNBA6XEU7IM3VVMM3JLSQRTPQBBHZM4KJELPQGECVSCZ` |
| MOCKXAUM | XAUM | `GC6VP3LK7JWQRRLZVTHMPYYNN3ZRUJ7KSZGMV4AJTYETICNISI4I7AMN` |

Each asset has 7 decimals and one market, with its own oracle. Anyone can issue an asset with the same code on Stellar, so check the issuer above if your wallet shows more than one. The market page shows each market's maturity date with a countdown.

Each market's oracle can be pointed at a price feed on Stellar that gives the real asset's price. An oracle without a feed is updated by its admin instead, and the dashboard's Oracle view shows no feed price for it. [Oracle](/how-it-works/oracle) explains how, and why the oracle's value can differ from the feed's price for a while.

The mock assets keep the issuer controls a regulated asset has: their issuer can revoke an account's authorization and claw balances back, so Principal's compliance rules apply as they would on a real asset. They do not require authorization in advance: a trustline is authorized as soon as you add it. An account also needs a place on Principal's shared allow-list before it can hold SY, PT or YT, and on Mainnet the protocol team keeps that list.

Mainnet has no **Get test tokens** and no faucet, and its network fees are paid in real XLM. To use a market, add a trustline to its asset (the market page has an **Add trustline** button), then ask the protocol team for access, and for the mock asset itself: the market page's **Request access** card shows your address to send and what is still missing. [Getting started](/using-the-app/) walks you through it. The app does not offer market creation on Mainnet: the protocol team creates the markets it lists.

## What the maturity date means

Until a market's maturity date, 11 February 2027, 08:59:04 UTC for the Testnet market, you can split SY into PT and YT, trade in the pool, recombine, and add liquidity. From that moment:

- the pool stops trading, and no new PT or YT can be minted;
- PT redeems for one dollar's worth of the underlying asset each, at the market's settlement rate;
- YT stops earning, and redeeming it pays out any yield it has not paid out yet;
- liquidity providers can still withdraw their share of the pool.

The app shows the same date on the market page, with a countdown. [Maturity](/how-it-works/maturity) explains settlement in detail.

## Coming soon

The Principal website lists two real assets as coming soon:

| Asset | Issuer | Status |
|---|---|---|
| USDY | Ondo Finance | Coming soon |
| BENJI | Franklin Templeton | Coming soon |

Ondo's USDY, a tokenized note backed by US Treasuries, is the asset Principal targets first. It is not live on Principal yet: the Testnet market uses the test asset above, and Mainnet's USDY-tracking market uses MOCKUSDY, which only follows its price. BENJI is listed, with no market yet.

**Next:** [Risks](/guide/risks), what to know before you start. Then follow [Getting started](/using-the-app/) to connect a wallet and set up your account, or see the markets in [Markets](/using-the-app/markets).
