import { Errors } from "../constants.js";

export function bigIntToBase64(bigInt: bigint) {
  // Convert BigInt to hex string without the '0x' prefix
  let hex = bigInt.toString(16);

  // Ensure the hex string is even-length by padding if needed
  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }

  if (!hex) throw Errors.SerializerFailed;

  const matchedBytes = hex.match(/.{1,2}/g);

  if (!matchedBytes) throw Errors.SerializerFailed;

  // Convert hex string to Uint8Array (byte array)
  const byteArray = new Uint8Array(
    matchedBytes.map((byte) => parseInt(byte, 16))
  );

  // Convert byte array to binary string
  let binary = "";
  for (let byte of byteArray) {
    binary += String.fromCharCode(byte);
  }

  // Convert binary string to Base64
  return btoa(binary);
}


export function base64ToBigInt(base64: string): bigint {
  // Decode the Base64 string into a binary string
  const binary = atob(base64);

  // Convert the binary string into a Uint8Array (byte array)
  const byteArray = new Uint8Array(
    Array.from(binary).map((char) => char.charCodeAt(0))
  );

  // Convert the Uint8Array to a hex string
  let hex = Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  // Convert the hex string to BigInt
  return BigInt("0x" + hex);
}
