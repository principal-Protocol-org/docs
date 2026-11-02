---
title: Supported assets
description: The asset you can use with Principal on Stellar Testnet today, USDY (test), and the assets listed as coming soon.
order: 4
---

Principal runs on Stellar Testnet, with one market on one test asset. This page lists it, and the real assets listed as coming soon.

## On Testnet: USDY (test)

| Field | Value |
|---|---|
| Market | USDY (test) |
| Network | Stellar Testnet |
| Asset code | USDY |
| Issuer | `GDUGKHAJJPEYRF4T5XG7HJSUY3AGMHKHCSTSLZSGOCK2673N5ZKDFIDT` |
| Decimals | 7 |
| Maturity | 31 January 2027, 00:45:35 UTC |

**USDY (test) is a test asset.** Principal issued it from a test account it holds, for Testnet only. Ondo did not issue it, and it has no value. It shares the code USDY with Ondo's asset, so check the issuer above if your wallet shows more than one USDY.

Its dollar value comes from a test oracle, which Principal's own keeper raises at a set yearly rate on a regular schedule. That value follows no real Treasury yield and no price of Ondo's USDY, so the returns you see on Testnet say nothing about real ones.

The test asset behaves like a regulated one. Its issuer requires authorization for every account that holds it, can revoke that authorization, and can claw balances back. Principal's compliance rules therefore apply on Testnet as they would on a real asset: an account needs the issuer's authorization before it can hold USDY (test), SY, PT or YT, and a place on Principal's shared allow-list before it can hold SY, PT or YT. On Testnet, those issuer powers sit with Principal's test accounts, and the test asset's issuer account runs the allow-list.

You do not have to arrange any of this yourself: **Get test tokens** in the app sets up your account, has it authorized, adds it to the allow-list and sends you test USDY. [Getting started](/using-the-app/) walks you through it.

## What the maturity date means

Until 31 January 2027, 00:45:35 UTC, you can split SY into PT and YT, trade in the pool, recombine, and add liquidity. From that moment:

- the pool stops trading, and no new PT or YT can be minted;
- PT redeems for one dollar's worth of USDY (test) each, at the market's settlement rate;
- YT stops earning, and redeeming it pays out any yield it has not paid out yet;
- liquidity providers can still withdraw their share of the pool.

The app shows the same date on the market page, with a countdown. [Maturity](/how-it-works/maturity) explains settlement in detail.

## Coming soon

The Principal website lists two real assets as coming soon:

| Asset | Issuer | Status |
|---|---|---|
| USDY | Ondo Finance | Coming soon |
| BENJI | Franklin Templeton | Coming soon |

Ondo's USDY, a tokenized note backed by US Treasuries, is the asset Principal targets first. It is not live on Testnet: the Testnet market uses the test asset above. BENJI is listed, with no market yet.

**Next:** [Risks](/guide/risks), what to know before you start. Then follow [Getting started](/using-the-app/) to connect a wallet and get test tokens, or see the market in [Markets](/using-the-app/markets).
