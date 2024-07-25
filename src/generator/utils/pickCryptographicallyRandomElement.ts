import { lib as cryptoLib } from "crypto-js/core";

type GetElementType<T extends any[]> = T extends Array<infer U> ? U : never;

const max = Math.pow(2, 32);
export const mathRandomCrypto = (): number => cryptoLib.WordArray.random(4).words[0] / max;

export const getCryptographicallyRandomIndex = <T>(arr: T[]): number => {
    return (mathRandomCrypto() * arr.length) | 0;
};

export const pickCryptographicallyRandomElement = <T extends any[]>(arr: GetElementType<T>): GetElementType<T> => {
    return arr[getCryptographicallyRandomIndex(arr)];
};
