---
title: What is Principal
description: Principal splits a yield-bearing real-world asset on Stellar into a Principal Token with a fixed return and a Yield Token that collects the variable yield.
order: 1
---

Principal is a yield-tokenization protocol for regulated real-world assets (RWAs) on Stellar. It takes an asset that earns a variable yield, such as a tokenized US Treasury note, and splits it into two tokens you can hold or trade separately: a **Principal Token (PT)** with a fixed return at maturity, and a **Yield Token (YT)** that collects the variable yield until then.

Principal runs on Stellar Testnet today, with a test asset. Nothing you hold there has real value. [Supported assets](/guide/supported-assets) lists what is available.

## The problem

Stellar already hosts tokenized RWAs, among them Ondo's USDY, Franklin Templeton's BENJI and Spiko's USTBL. Their yield floats with interest rates: if you hold one, you take whatever rate the coming months bring. Without a market built for it, you cannot:

- lock in a fixed yield on an asset you hold;
- sell the yield you expect to earn and get paid for it today;
- take a position on where an asset's yield is heading;
- separate your exposure to the principal from your exposure to the yield.

Principal adds that market on top of the assets as their issuers already run them.

## One asset, two tokens

You deposit the asset and receive SY, a standardized wrapper around it. You then split SY into PT and YT, both tied to one maturity date.

- **PT is the principal.** At maturity, each PT pays one dollar's worth of the underlying asset. Before maturity it normally trades below one dollar, and buying it at that discount fixes your yield.
- **YT is the yield.** It collects what the asset earns from the moment you hold it until maturity, and you can claim that yield at any time. At maturity it stops earning and expires.

Before maturity, equal amounts of PT and YT can be recombined into SY. After maturity, each token is redeemed on its own.

Each market has one pool, where PT trades against SY. YT trades through the same pool: buying YT splits SY and sells the PT in one transaction, and selling YT does the reverse. If you know Pendle, this is the same PT/YT model, built for Stellar and for regulated assets.

[Core concepts](/guide/core-concepts) defines each of these pieces.

## Compliance comes from the asset

The assets Principal targets are regulated. Their issuer decides which accounts may hold them, and can freeze or claw back balances. Principal does not run a separate allow-list: every SY, PT, YT and liquidity position checks the issuer's own authorization on the underlying asset, for the sender and for the receiver. If the issuer has not authorized your account for the asset, you cannot hold or trade its PT or YT either. The issuer can narrow access further in its own market, never widen it.

The same issuer creates each market on its asset and sets the market's fees. If it freezes an account, that account's positions in Principal are frozen too, and the issuer can recover them. [Compliance](/how-it-works/compliance) explains how this works, and [Risks](/guide/risks) what it means for you.

## Who it is for

- **Holders of a yield-bearing RWA, and treasuries,** who want a known return at a known date. They buy PT, or split their asset and sell the YT.
- **Traders, vault managers and funds** who want exposure to future yield. They buy or sell YT.
- **Liquidity providers** who put PT and SY in a market's pool.

[Strategies](/guide/strategies) walks through each of these with an example.

## Next

Read [Core concepts](/guide/core-concepts), then [Strategies](/guide/strategies). To try Principal on Testnet, go to [Getting started](/using-the-app/).
