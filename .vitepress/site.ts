/**
 * The public origin the docs link to and declare in canonical and Open Graph tags. A Vercel branch
 * URL sits behind Vercel Authentication, so production uses principalmarket.fi and every other
 * build the public testnet domain (same rule as the app, org/dapp/lib/app/site.ts).
 */
export const PRODUCTION_ORIGIN = 'https://principalmarket.fi'
export const TESTNET_ORIGIN = 'https://testnet.principalmarket.fi'

export function siteOrigin(env: Record<string, string | undefined> = process.env): string {
  return env.VERCEL_ENV === 'production' ? PRODUCTION_ORIGIN : TESTNET_ORIGIN
}

export const docsUrl = (origin: string): string => `${origin}/docs`
export const appUrl = (origin: string): string => `${origin}/app`
