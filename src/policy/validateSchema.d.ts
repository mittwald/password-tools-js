// validateSchema.mjs.d.ts
interface ValidatorFn {
    (data: any): boolean;
    errors?: Error[] | null;
}

export const ValidatePolicyDeclaration: ValidatorFn;
