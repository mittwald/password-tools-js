// validateSchema.mjs.d.ts
interface ValidatorFn {
  (data: unknown): boolean;
  errors?: Error[] | null;
}

export const ValidatePolicyDeclaration: ValidatorFn;
