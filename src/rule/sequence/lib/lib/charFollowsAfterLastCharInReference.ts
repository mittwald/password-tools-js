export const charFollowsAfterLastCharInReference = (
    char: string,
    lastChar: string,
    referenceSequence: string,
): boolean => {
    const indexLastChar = referenceSequence.indexOf(lastChar);
    const indexChar = referenceSequence.indexOf(char);

    return indexChar - 1 === indexLastChar && indexLastChar !== -1;
};
