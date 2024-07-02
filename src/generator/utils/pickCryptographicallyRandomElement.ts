import crypto from "crypto";

type GetElementType<T extends any[]> = T extends Array<infer U> ? U : never;

const max = Math.pow(2, 32);

const mathRandomCrypto = (): number => crypto.randomBytes(4).readUInt32BE(0) / max;

export const getCryptographicallyRandomIndex = <T>(arr: T[]): number => {
    return (mathRandomCrypto() * arr.length) | 0;
};

export const pickCryptographicallyRandomElement = <T extends any[]>(arr: GetElementType<T>): GetElementType<T> => {
    return arr[getCryptographicallyRandomIndex(arr)];
};
