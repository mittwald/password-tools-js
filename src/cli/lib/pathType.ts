import { statSync } from "node:fs";

/** What a path points at, or `false` when it points at nothing. */
export const pathType = (path: string): "file" | "dir" | false => {
  try {
    const stats = statSync(path);

    if (stats.isFile()) {
      return "file";
    }
    if (stats.isDirectory()) {
      return "dir";
    }

    return false;
  } catch {
    return false;
  }
};
