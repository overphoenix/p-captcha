import { Errors } from "../../constants.ts";
import { power } from "./modularExponentiation.ts";

// Tonelli–Shanks algorithm for modular square root
export function tonelliShanks(n: bigint, p: bigint): bigint {
  n = BigInt(n);
  p = BigInt(p);

  // Step 1: Check if n is a quadratic residue modulo p
  if (power(n, (p - 1n) / 2n, p) !== 1n) {
    throw Errors.TonelliShanksNoSolution;
  }

  // Step 2: Handle simple cases
  if (p % 4n === 3n) {
    // If p ≡ 3 (mod 4), we can use a shortcut
    return power(n, (p + 1n) / 4n, p);
  }

  // Step 3: Find Q and S such that p - 1 = Q * 2^S with Q odd
  let Q = p - 1n;
  let S = 0n;
  while (Q % 2n === 0n) {
    Q /= 2n;
    S += 1n;
  }

  // Step 4: Find a non-residue z
  let z = 2n;
  while (power(z, (p - 1n) / 2n, p) === 1n) {
    z += 1n;
  }

  // Initialize variables
  let M = S;
  let c = power(z, Q, p);
  let t = power(n, Q, p);
  let R = power(n, (Q + 1n) / 2n, p);

  // Step 5: Loop to find the solution
  while (t !== 0n && t !== 1n) {
    let i = 1n;
    let t2i = (t * t) % p;

    while (t2i !== 1n && i < M) {
      t2i = (t2i * t2i) % p;
      i += 1n;
    }

    if (i === M) {
      throw Errors.TonelliShanksNoSolution; // No solution found
    }

    const b = power(c, 1n << (M - i - 1n), p);
    M = i;
    c = (b * b) % p;
    t = (t * c) % p;
    R = (R * b) % p;
  }

  if (t === 0n) {
    return 0n;
  }

  return R;
}
