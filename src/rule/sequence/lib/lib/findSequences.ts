export const findSequences = (
    pw: string,
    maxLength: number,
    charFollowsAfterLastChar: (char: string, lastChar: string) => boolean,
): string[] => {
    const sequences: string[] = [];

    let lastChar = "";
    let currentSequence = "";
    let iterations = pw.length;

    for (const char of pw) {
        if (charFollowsAfterLastChar(char, lastChar)) {
            currentSequence += char;

            if (iterations === 1 && currentSequence.length > maxLength) {
                sequences.push(currentSequence);
            }
        } else {
            if (currentSequence.length > maxLength) {
                sequences.push(currentSequence);
            }

            currentSequence = char;
        }
        lastChar = char;

        !--iterations;
    }

    return sequences;
};
