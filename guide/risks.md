---
title: Risks
description: "What can go wrong when you use Principal: the contracts, the oracle, liquidity, YT decay, issuer controls, pauses and Testnet itself."
order: 5
---

Read this page before you use Principal. The controls that limit these risks are described in [Security](/technical/security).

## Testnet only

Principal runs on Stellar Testnet. Tokens there have no value. USDY (test) is a test asset issued by Principal, not by Ondo, and its dollar value comes from a test oracle that Principal's keeper raises on a schedule. The Testnet market is a test deployment: Principal can replace it with a new one.

## Smart-contract risk

Principal is a set of new Soroban contracts. They come with a large test suite, but tests cannot rule out every bug, and the contracts have not had an independent security review. A bug could lock or lose funds. The contracts have no upgrade function, so a flaw cannot be patched in place: fixing one means deploying new contracts.

## Oracle risk

Every market prices and settles with one reference rate, which the oracle's administrator pushes from a single key. The oracle contract checks that:

- the value never goes down;
- each update carries a later timestamp than the one before, and none in the future;
- a value counts as fresh for one hour after its timestamp.

These checks cannot catch a value that is wrong but higher than the last one. A settlement rate set too high pays PT holders fewer units of the underlying and YT holders more. And because the rate can never go down, the market cannot show a loss of value in the real asset.

If the oracle is not updated for an hour, the market stops most actions until it is: splitting, recombining, trading, claiming yield, and the first redemption after maturity, which sets the settlement rate. Removing liquidity keeps working, and once the settlement rate is set, redemptions and claims no longer need the oracle.

## Liquidity and price impact

Each market has one pool. Every trade moves its price, and a trade that is large next to the pool gets a noticeably worse price. The price the app shows is the pool's spot price, which a large trade can move.

Every trade the app sends carries a **minimum received** and a deadline. If the price moves past your limit, or the transaction lands too late, it fails instead of filling at a worse price.

If the pool is thin, you may not find a good price to exit before maturity. Your other exits are recombining equal amounts of PT and YT before maturity, or redeeming at maturity, neither of which uses the pool.

Liquidity providers earn no swap fees, and they end up holding more of whichever side loses value when the market's implied yield moves. See [Strategies](/guide/strategies).

## YT decays to zero

A YT is worth the yield still ahead of it. As maturity nears there is less of it left, and the YT price falls toward zero. At maturity a YT is worth only the yield it has earned and not yet paid out. If the underlying earns less than the Break-even APY the app showed when you bought, you come out behind; if the oracle rate does not rise at all, the YT pays nothing.

Close to maturity, selling YT can fail: the pool refuses the sale when the YT no longer covers the PT the pool has to put in. You then hold it and collect what it has earned.

## Issuer freeze and clawback

The issuer's controls on the underlying asset reach every position in Principal. If the issuer revokes your authorization on the asset, you can no longer send, receive, trade, split, recombine, claim or redeem SY, PT, YT or LP positions.

The issuer can then recover a frozen account's positions. SY is turned back into the underlying at once. An LP position is withdrawn into its PT and SY. PT and YT are held until maturity, then settled into the underlying. From there, the issuer can claw it back with the asset's own controls. Only accounts the issuer has already deauthorized can be targeted, and other holders are not affected.

The issuer also creates each market on its asset and sets its fees, up to fixed caps: 1 % for the tokenization fee, 50 % for the YT fee, 5 % for the swap fee tier. A fee change takes effect at once, with no delay.

On Testnet, the issuer of USDY (test) and the market's administrator are Principal's own test accounts.

## Pauses and limits

The market's administrator can pause its contracts. While paused, the market refuses new deposits, splits, trades, yield claims and redemptions. Withdrawing liquidity is blocked during a pause before maturity, never after it. Recovery by the issuer keeps working during a pause.

A circuit breaker limits total deposits over a window that resets on its own, across the protocol and per asset, and the wrapper can also cap each address's deposits. A deposit over a limit fails. The **Safety** tab on each market page shows whether the market is paused, whether the oracle is fresh, and how much room the limits have left.

## The underlying asset

PT and YT are claims on the underlying asset. If the asset loses value or its issuer fails, they lose value with it.

## Next

See the controls in [Security](/technical/security), and how the oracle and compliance work in [Oracle](/how-it-works/oracle) and [Compliance](/how-it-works/compliance). To try Principal on Testnet, start with [Getting started](/using-the-app/).
