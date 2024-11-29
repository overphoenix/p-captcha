import { getRandomValues } from "crypto";

export function getRandomBigInt(bits: number) {
  const bytes = Math.ceil(bits / 8);
  const array = new Uint8Array(bytes);
  getRandomValues(array);

  // Convert to BigInt and ensure it's positive
  let num = BigInt(
    "0x" +
      Array.from(array)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
  );

  // Ensure the number has exactly 'bits' bits
  num = num | (1n << BigInt(bits - 1)); // Set highest bit
  num = num & ((1n << BigInt(bits)) - 1n); // Mask to bits length

  return num;
}