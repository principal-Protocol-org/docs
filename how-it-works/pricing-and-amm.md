---
title: Pricing and the AMM
sidebarTitle: Pricing and AMM
description: "The PT/SY yield-curve pool: its formula, the implied fixed rate, how PT converges to par, and how YT trades through the same pool."
order: 3
---

Each market has one pool, the MarketPool, that trades PT against SY. Its price for PT sets the fixed rate a PT buyer locks in. YT has no pool of its own: it is bought and sold through the same pool, in a single transaction.

## The curve

The pool uses a constant-power-sum curve (the "Yield Space" curve):

```
x^a + y^a = k          a = 1 − τ / S
```

- `x` is the SY reserve **valued in notional**: `SY × r / SCALE`, the same rate that sizes PT when you split, so SY value and PT face value compare directly.
- `y` is the PT reserve.
- `τ` is the time left to maturity, and `S` is the pool's **time stretch**, a fixed setting chosen when the pool is created (1 to 20 years). The Testnet pool uses 4 years.

A trade keeps `k` constant: put SY in, and the equation gives the PT that comes out. The contract solves it exactly, in integer arithmetic.

## PT price and the implied rate

The price of one PT, in SY value, at the current reserves:

```
p = (x / y)^(τ / S)
```

PT trades below par (`p` below 1) while the pool holds more PT value than SY value. The discount is the fixed yield. The pool reports it as a simple annual rate:

```
implied_rate = (1 / p − 1) × year / τ
```

**Example** (from Principal's yield guide, 4-year stretch, 180 days to maturity). The pool holds 999.5 PT and SY worth 950. The exponent is `a = 1 − (180/365)/4 = 0.8767`, so `p = (950 / 999.5)^0.1233 = 0.99376`. Buying PT at that price and holding to maturity earns `(1/0.99376 − 1) × 365/180`, about **1.27% a year**.

## Time decay: PT converges to par

As maturity approaches, `τ` shrinks, `a` rises toward 1, and the curve flattens into `x + y = k`. At that point `p = (x/y)^0 = 1` for any reserves: PT is worth exactly par. No keeper is needed.

The same example with no trading at all, only time passing:

| Day | 0 | 60 | 90 | 120 | 150 | 179 |
|---|---|---|---|---|---|---|
| PT price | 0.99376 | 0.99583 | 0.99687 | 0.99792 | 0.99896 | 0.99997 |

The price climbs to par while the implied rate stays at about 1.27%. Liquidity providers hold a fixed basket of PT and SY, so the climb is a gain for them, not an impermanent loss.

At maturity, swaps close. PT then redeems at par through the PrincipalManager, whatever the pool's reserves (see [Maturity](/how-it-works/maturity)).

The exponent may not drop below 0.25, so a market's remaining life must be under 75% of the stretch when its pool is created: with a 4-year stretch, at most 3 years.

## Price impact

Each trade moves the reserves, and so the price: the larger the trade, the worse its average price. In a fee-free version of the same pool (1,000 PT against 950 SY), selling 100 PT, a tenth of the pool, returns 98.13 SY, where the opening price of about 0.9937 alone would give about 99.37.

Every swap through the Router carries a minimum output and a deadline: if the price moves past your limit before the transaction is included, it reverts and nothing changes. In the app this is the "Minimum received" line when you review a trade (see [Trade PT and YT](/using-the-app/trade)).

## Buying YT: flash-mint

To buy YT, the Router does two things in one transaction, both as you:

1. It splits your SY into PT + YT.
2. It sells all of that PT into the pool for SY.

You keep the YT and the SY the PT fetched. Your net cost for the YT is `sy_in − sy_back`. Nothing is borrowed and the Router holds nothing.

**Example** (from Principal's yield guide: the fee-free pool above, rate 1.0). 100 SY splits into 100 PT + 100 YT. The 100 PT sell for 98.1284 SY. The 100 YT cost 1.8716 SY, under 2 cents each: a small outlay carries the yield of a large notional. On Testnet the tokenization fee and the swap fee on the PT sale also apply.

## Selling YT: flash-redeem

To sell YT, the pool does the reverse inside its own call (`swap_yt_for_sy`). It takes your YT, pairs it with the same amount of PT from its own reserve, and recombines the pair into SY. It keeps the curve price of that PT plus the swap fee, and pays you the rest. In the example above, selling the 100 YT straight back returns the 1.8716 SY.

If the recombined SY does not cover the PT's price, the call reverts. That happens near maturity, when PT is almost at par and YT is worth almost nothing: you then hold the YT and claim its yield or redeem it.

The pool does all this inside its own call because Soroban does not let a contract be called back by a contract it is calling. Keeping YT out of a pool of its own also keeps all liquidity in one place.

## Safety rules

- Rounding always goes against the trader and toward the pool.
- Prices come from the pool's own recorded reserves, so tokens sent straight to the pool change nothing.
- Every swap needs a fresh oracle value (see [Oracle](/how-it-works/oracle)).
- A large trade can move the spot price within a block, so it is not an oracle.

Swap fees are charged on top of the curve price; see [Fees](/how-it-works/fees).

**Next:** [Maturity](/how-it-works/maturity), what PT and YT pay at the end. For providing liquidity in the app, see [Add and remove liquidity](/using-the-app/liquidity).
