import { existsSync, readFileSync } from "node:fs";

export function loadLocalEnv() {
  if (!existsSync(".env")) {
    return;
  }

  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);
    if (!match || process.env[match[1]]) {
      continue;
    }

    process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}
