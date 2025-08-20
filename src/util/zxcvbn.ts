import type { OptionsType } from "@zxcvbn-ts/core";

export const loadZxcvb = async () => {
  const commonPackage = await import("@zxcvbn-ts/language-common");
  const englishPackage = await import("@zxcvbn-ts/language-en");
  const germanPackage = await import("@zxcvbn-ts/language-de");
  const core = await import("@zxcvbn-ts/core");

  const options: OptionsType = {
    dictionary: {
      ...commonPackage.dictionary,
      ...englishPackage.dictionary,
      ...germanPackage.dictionary,
    },
    graphs: commonPackage.adjacencyGraphs,
    useLevenshteinDistance: true,
  };
  core.zxcvbnOptions.setOptions(options);

  return core.zxcvbnAsync;
};

export default loadZxcvb;
