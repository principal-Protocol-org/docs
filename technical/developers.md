---
title: Developers
description: "Where to find Principal's contract source, API reference, integration guide and contribution workflow on GitHub, and how to build and test the contracts."
order: 3
---

Principal's contract source is public, under the Apache 2.0 licence stated in its README, in the [principal repository](https://github.com/principal-Protocol-org/principal) on GitHub. Its documentation is written for contract developers and integrators, and it describes the protocol as deployed on Stellar Testnet. This page points to the right document for each need.

## Where to start

| Document | What you find there |
|---|---|
| [README](https://github.com/principal-Protocol-org/principal/blob/main/README.md) | The protocol in one page: the contracts and their roles, the main user flows with the functions they call, the settlement math, the repository layout and a quick start. Its tables of contracts predate `MarketFactory`: for what is shared and what is per market, see [Architecture](/technical/). |
| [API reference](https://github.com/principal-Protocol-org/principal/blob/main/docs/API_REFERENCE.md) | Every public function of every contract except `MarketFactory` (see the integration guide): what it does, which signature it needs, and which errors it can return. Also the events and the shared types. |
| [Dapp integration guide](https://github.com/principal-Protocol-org/principal/blob/main/docs/DAPP_SMART_CONTRACT_INTEGRATION_GUIDE.md) | How a front end creates a market with `MarketFactory` and integrates the AMM through `MarketPool` and the `Router`, with worked examples run on Testnet and an error reference. |
| [Contributing](https://github.com/principal-Protocol-org/principal/blob/main/docs/CONTRIBUTING.md) | Prerequisites, build and test commands, code style and the pull-request checklist. |
| [Full technical documentation](https://github.com/principal-Protocol-org/principal/tree/main/docs) | Everything else: the protocol specification, architecture and call sequences, yield math and fees, AMM design, compliance (SAC, SEP-8, SEP-57), security, market creation and deployment. |

A few conventions help when you read them. Amounts are raw `i128` integers in the token's smallest unit (seven decimals for the Testnet tokens), and rates are USDC per unit of the underlying at `SCALE = 10_000_000`. Errors surface as `Error(Contract, #n)`; when one contract calls another and the callee reverts, the code you see is the callee's.

## Build and test

You need Rust stable 1.91 or later and the `wasm32v1-none` target; to deploy or call contracts, also the Stellar CLI 22.0 or later.

```bash
# Add the WASM target (once)
rustup target add wasm32v1-none

# Build every contract to WASM
cargo build --workspace --release --target wasm32v1-none

# Unit tests and the cross-contract integration suite
cargo test --workspace
```

Build first: one test checks the pool's CPU budget on the built WASM and is skipped otherwise. The WASM files land in `target/wasm32v1-none/release/`, one per contract. Before opening a pull request, run `cargo fmt --all` and make `cargo clippy --workspace --all-targets --locked -- -D warnings` pass with no warnings. The contributing guide has the rest of the checklist.

## Integrating with the contracts

Start with the [Architecture](/technical/) page for the twelve contracts and how one market is wired, then use the API reference for exact signatures. A few points save time:

- Most user flows go through the `Router`, which takes the market's `MarketPool` address and finds the other contracts from it; a plain deposit calls `SYWrapper.deposit` directly. Each `Router` flow that trades or moves liquidity takes a `deadline` and a minimum output.
- Every call is made as the user, and every contract checks the user's compliance on the underlying, on both sides of a transfer. Simulate a call before you ask the user to sign it: a deauthorized account fails in simulation.
- Contract addresses change with each deployment. The Principal app lists the Testnet addresses of the shared contracts and the first market in its network manifest, `config/manifests/testnet.json` on the `testnet` branch of the public `principal-Protocol-org/dapp` repository.

**Next:** back to [Architecture](/technical/). Related: [Safety controls](/technical/security), [How it works](/how-it-works/).
