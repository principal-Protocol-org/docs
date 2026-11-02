---
title: Compliance
description: "How SY, PT, YT and LP positions inherit the issuer's rules: SAC authorization, SEP-8 and SEP-57 assets, the market's allow-list, and what a freeze or clawback means for you."
order: 7
---

A regulated asset comes with rules set by its issuer: who may hold it, and the power to freeze or claw back a holder's tokens. Principal carries those rules into every position it creates. If the issuer would not let your account hold the underlying, you cannot hold, move, trade or redeem the SY, PT, YT or LP built on it either.

## Two questions, asked live

Every Principal contract routes compliance through one shared library, which asks the underlying's contract two questions:

| Question | Classic Stellar asset (incl. SEP-8) | SEP-57 token |
|---|---|---|
| May this account hold the asset? | the asset contract's `authorized(account)` | the account is not frozen **and** its identity is verified |
| Who is the issuer's authority? | the asset contract's `admin()` | whoever holds the token's operator role |

For a classic asset, an account with no trustline to it counts as not allowed. Principal keeps no copy of these answers: it reads them at each call. If the issuer revokes an account, freezes it, or rotates its own key, the change applies to Principal on the very next transaction, with nothing to update.

## Where the check runs

The "may this account hold it?" check runs on every operation that creates, moves or pays out a position:

- wrapping into SY, unwrapping, and SY transfers;
- PT and YT transfers, on **both** the sender and the receiver;
- splitting, recombining, claiming yield and redeeming;
- every pool trade, adding and removing liquidity, and LP transfers.

Because both sides are checked, an account about to be frozen cannot first move its PT or YT to another wallet.

The issuer's authority is required for the other kind of action: creating a market, changing its fees, and recovering a frozen account's positions.

## SEP-8 regulated assets

A SEP-8 asset is a classic Stellar asset whose issuer approves each payment through an approval server. Its holders usually sit unauthorized and are authorized only for the length of one approved transaction.

That pattern cannot wrap a Soroban contract call, which is a single operation. Principal reads the authorization flag as it stands when the contract runs, so a holder who is only ever authorized inside an approved transaction is refused. For a SEP-8 asset to work with Principal, the issuer must leave approved holders **authorized at rest**. The issuer's off-chain approval rules (limits per payment, jurisdiction checks) are not seen by the contracts.

## SEP-57 tokens

A SEP-57 (T-REX) token has no Stellar asset contract and no admin. Principal checks that an account is not frozen and that the token's identity verifier accepts it; any failure counts as "not allowed". The issuer's authority is proven by its operator role.

The token's own compliance modules (transfer limits, country rules) run only when SY is wrapped or unwrapped, because only then does the token itself move. When PT, YT or LP move between users, only the freeze and identity checks apply from the token's side.

## The market's allow-list

Each market is also wired to a second list, a Permissioning contract. It is shared infrastructure, reused across markets, and only its admin can change it; on Testnet that admin is the test USDY's issuer account. It has an account-level list, plus a separate list per token, so PT and YT can have different audiences.

In the contracts as deployed, this check always runs, and an account that is not on the list is refused. It can only narrow access: you need the issuer's authorization **and** a place on the list, never one without the other.

On Testnet, the app's "Get test tokens" action authorizes your account on the test USDY and adds it to the allow-list for your account and for each market's PT and YT (see [Getting started](/using-the-app/)). The test USDY has authorization required, revocable and clawback enabled, so these controls are live on Testnet.

## If your account is frozen

If the issuer revokes your authorization (or freezes you, for a SEP-57 token), every Principal operation on your account is refused: you cannot transfer, trade, split, recombine, claim, redeem, or add or remove liquidity. Your positions stay where they are. If the issuer restores your authorization, you carry on as before.

## Clawback and recovery

An issuer's native clawback takes underlying tokens from a wallet. It cannot reach SY, PT, YT or LP, which are balances inside Principal's contracts. For those, the issuer uses the market's RecoveryEscrow contract:

1. The issuer revokes the account first. The escrow refuses to act against an account that is still authorized, so the issuer's key alone cannot drain a holder.
2. The issuer, checked live, moves that account's positions into the escrow:
   - **SY** is unwrapped into the underlying at once;
   - **LP** is burned for its PT and SY; the SY is unwrapped, the PT is kept;
   - **PT and YT** are kept, fully backed, until maturity, then redeemed into the underlying. Yield the YT had earned moves with it.
3. The issuer finishes with its native clawback on the underlying the escrow holds.

Only that account's positions move; no other holder is touched. Each recovery writes an on-chain record of what was taken, from whom and when. The escrow has no key of its own and works even while a market is paused.

For the full set of controls, see [Safety controls](/technical/security). For what this means as a risk, see [Risks](/guide/risks).

**Next:** [Architecture](/technical/), how the contracts fit together.
