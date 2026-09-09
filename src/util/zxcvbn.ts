import type { OptionsType } from "@zxcvbn-ts/core";

let zxcvbn: ReturnType<typeof createZxcvbn> | undefined;

const createZxcvbn = async () => {
  const commonPackage = await import("@zxcvbn-ts/language-common");
  const englishPackage = await import("@zxcvbn-ts/language-en");
  const germanPackage = await import("@zxcvbn-ts/language-de");
  const { ZxcvbnFactory } = await import("@zxcvbn-ts/core");

  const options: OptionsType = {
    dictionary: {
      ...commonPackage.dictionary,
      ...englishPackage.dictionary,
      ...germanPackage.dictionary,
    },
    graphs: commonPackage.adjacencyGraphs,
    useLevenshteinDistance: true,
  };

  const factory = new ZxcvbnFactory(options);

  return (password: string) => factory.checkAsync(password);
};

/**
 * The factory is built once and reused: its options never change, while
 * assembling it costs roughly a quarter of a full check. Generating a password
 * validates every candidate, so this sits in a hot loop.
 *
 * Memoised lazily rather than at module scope, which keeps the dictionaries in
 * their own lazily loaded chunks.
 */
export const loadZxcvb = () => (zxcvbn ??= createZxcvbn());

export default loadZxcvb;
