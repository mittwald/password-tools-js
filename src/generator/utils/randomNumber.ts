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

  const range = max - min + 1;
  if (range <= 0) {
    throw new RangeError("Range must be positive and safe");
  }

  const byteCount = Math.ceil(Math.log2(range) / 8);
  const maxNum = 2 ** (byteCount * 8);

  const cryptoObj = getCryptoApi();
  let randNum: number;

  do {
    const bytes = new Uint8Array(byteCount);
    cryptoObj.getRandomValues(bytes);
    randNum = 0;
    for (let i = 0; i < byteCount; i++) {
      randNum = (randNum << 8) + bytes[i];
    }
  } while (randNum >= maxNum - (maxNum % range));

  return min + (randNum % range);
};

export const getRandomArrayIndex = (array: unknown[] | string): number => {
  return getRandomNumber(0, array.length - 1);
};

export const getRandomArrayItem = <A extends string | Array<unknown>>(
  array: A,
): GetElementType<A> => {
  return array[getRandomArrayIndex(array)] as GetElementType<A>;
};
