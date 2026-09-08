import { getCryptoApi } from "../../util/crypto";

type GetElementType<T> =
  T extends Array<infer U> ? (T extends string ? string : U) : unknown;

/** Returns a cryptographically secure random integer in [min, max] inclusive. */
export const getRandomNumber = (
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER,
): number => {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max) {
    throw new RangeError("Invalid min/max");
  }
  if (min === max) {
    return min;
  }

  // BigInt throughout: "<<" operates on 32-bit signed integers, so accumulating
  // more than three bytes with it silently overflows into negative values.
  const range = BigInt(max) - BigInt(min) + 1n;

  let byteCount = Math.ceil(Math.log2(Number(range)) / 8);
  // Guards against log2 rounding on very large ranges; maxNum must cover range.
  while (2n ** BigInt(byteCount * 8) < range) {
    byteCount++;
  }

  const maxNum = 2n ** BigInt(byteCount * 8);
  // Largest multiple of range that fits; anything above it would skew the
  // distribution, so it is rejected and redrawn.
  const limit = maxNum - (maxNum % range);

  const cryptoObj = getCryptoApi();
  let randNum: bigint;

  do {
    const bytes = new Uint8Array(byteCount);
    cryptoObj.getRandomValues(bytes);
    randNum = 0n;
    for (const byte of bytes) {
      randNum = (randNum << 8n) + BigInt(byte);
    }
  } while (randNum >= limit);

  return min + Number(randNum % range);
};

export const getRandomArrayIndex = (array: unknown[] | string): number => {
  return getRandomNumber(0, array.length - 1);
};

export const getRandomArrayItem = <A extends string | Array<unknown>>(
  array: A,
): GetElementType<A> => {
  return array[getRandomArrayIndex(array)] as GetElementType<A>;
};
