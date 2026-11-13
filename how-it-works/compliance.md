---
title: Compliance
description: "How SY, PT, YT and LP positions inherit the issuer's rules: SAC authorization, SEP-8 and SEP-57 assets, the allow-list, and what a freeze or clawback means for you."
order: 7
---

A regulated asset comes with rules set by its issuer: who may hold it, and the power to freeze or claw back a holder's tokens. Principal carries those rules into every position it creates. If the issuer would not let your account hold the underlying, you cannot receive, move, trade or redeem the SY, PT, YT or LP built on it either.

## Two questions, asked live

Every Principal contract routes compliance through one shared library, which asks the underlying's contract two questions:

| Question | Classic Stellar asset (incl. SEP-8) | SEP-57 token |
|---|---|---|
| May this account hold the asset? | the asset contract's `authorized(account)` | the account is not frozen **and** its identity is verified |
| Who is the issuer's authority? | the asset contract's `admin()` | whoever holds the token's operator role |

For a classic asset, an account with no trustline counts as not allowed. Principal reads these answers at each call and keeps no copy, so if the issuer revokes an account, freezes it, or rotates its key, the change applies from the next transaction.

## Where the check runs

The "may this account hold it?" check runs on every operation that creates, moves or pays out a position:

- wrapping into SY, unwrapping, and SY transfers;
- PT and YT transfers, on **both** the sender and the receiver;
- splitting, recombining, claiming yield and redeeming;
- every pool trade, adding and removing liquidity, and LP transfers.

What counts as "your" check depends on who makes the call. In the app's Buy YT the PrincipalManager's mint is made by the pool, not by you, so the mint's check is on the pool. You are checked by the pool's trader check, by your SY transfer and by the YT sent to you.

Because both sides are checked, an account the issuer has revoked cannot move its PT or YT to another wallet before the issuer recovers them.

The issuer's authority is required for the other kind of action: creating a market, changing its fees, and recovering a frozen account's positions. On Testnet that authority is a Principal-held key (the test USDY's asset-contract admin); the issuer account itself runs authorization and the allow-list. Market creation also needs the authorizations and allow-list entries a new market's contracts and treasury require; the wizard's permissions step lists them (see [Manage and create markets](/using-the-app/manage-markets)).

## SEP-8 regulated assets

A SEP-8 asset is a classic Stellar asset whose issuer approves each payment through an approval server. Its holders usually sit unauthorized and are authorized only for one approved transaction at a time.

That pattern cannot wrap a Soroban contract call: a contract call must be the only operation in its transaction. Principal reads the authorization flag when the contract runs, so a holder authorized only inside an approved transaction is refused. For a SEP-8 asset to work with Principal, the issuer must leave approved holders **authorized at rest**. The contracts do not see the issuer's off-chain approval rules (limits per payment, jurisdiction checks).

## SEP-57 tokens

A SEP-57 (T-REX) token has no Stellar asset contract and no admin. Principal checks that an account is not frozen and that the token's identity verifier accepts it; any failure counts as "not allowed". The issuer's authority is proven by its operator role.

The token's own compliance modules (transfer limits, country rules) run only when SY is wrapped or unwrapped, the only time the token itself moves. When PT, YT or LP move between users, only the freeze and identity checks apply.

## The allow-list

Every market also checks a second list, kept in the shared Permissioning contract. Only its admin can change it; on Testnet that admin is the test USDY's issuer account. It has an account-level list plus a list per token, so PT and YT can have different audiences.

This check always runs: an account that is not on the list is refused. It can only narrow access: you need the issuer's authorization **and** a place on the list.

Each token has its own entry, and an action needs only the entries of the tokens it moves to you: Buy YT needs the YT entry, LP only needs no PT entry (the PT dust stays in the pool), a two-sided add and every liquidity exit need the PT entry (they send PT to you), and Keep YT needs both.

On Testnet, the app's "Get test tokens" action authorizes your account on the test USDY and adds it to the allow-list, for your account and for each market's PT and YT (see [Getting started](/using-the-app/)). The test USDY has authorization required, revocable and clawback enabled, so these controls are live.

## If your account is frozen

If the issuer revokes your authorization (or freezes you, for a SEP-57 token), every Principal operation on your account is refused: you cannot transfer, trade, split, recombine, claim, redeem, or add or remove liquidity. Your positions stay where they are. If the issuer restores your access, you carry on as before.

## Clawback and recovery

Native clawback takes underlying tokens from a wallet, but cannot reach SY, PT, YT or LP, which are balances inside Principal's contracts. For those, the issuer uses the market's RecoveryEscrow:

1. The issuer revokes the account first. The escrow refuses to act against an account that is still authorized, so a recovery always follows a revocation made on the asset itself. The issuer's authority can make both moves; this rule sets their order.
2. The issuer, checked live, moves that account's positions into the escrow:
   - **SY** is unwrapped into the underlying at once;
   - **LP** is burned for its PT and SY; the SY is unwrapped, the PT is kept;
   - **PT and YT** are kept, fully backed, until maturity, then redeemed into the underlying. Yield the YT had earned moves with it.
3. The issuer then claws back the underlying the escrow holds.

Only that account's positions move. Each recovery writes an on-chain record of what was taken, from whom and when. The escrow has no key of its own. Seizing works even while a market is paused; redeeming the seized PT and YT at maturity waits until the market is unpaused.

For all the controls, see [Safety controls](/technical/security); for the risk, see [Risks](/guide/risks).

**Next:** [Architecture](/technical/), how the contracts fit together.
