/**
 * If invalid, returns the failingBoundary
 *
 * @param value
 * @param min
 * @param max
 */
export const valueObeysMinAndMax = (
    value: number,
    { min, max }: { min: number | undefined; max: number | undefined },
): "min" | "max" | true => {
    if (min !== undefined && max !== undefined) {
        if (min > max) {
            return "min";
        }

        if (value >= min && value <= max) {
            return true;
        }

        if (value > max) {
            return "max";
        }

        return value < min ? "min" : true;
    }
    if (min !== undefined && max === undefined) {
        return value >= min ? true : "min";
    }
    if (min === undefined && max !== undefined) {
        return value <= max ? true : "max";
    }

    return true;
};
