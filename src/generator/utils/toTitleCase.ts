export const toTitleCase = (s: string): string => {
    const firstChar = s[0];
    if (firstChar) {
        return firstChar.toUpperCase() + s.slice(1);
    }
    return s;
};
