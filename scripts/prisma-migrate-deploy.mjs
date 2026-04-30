import { spawn } from "node:child_process";
import { loadLocalEnv } from "./load-env.mjs";

loadLocalEnv();

const migrateUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!migrateUrl) {
  console.error("DIRECT_URL or DATABASE_URL is required to run Prisma migrations.");
  process.exit(1);
}

const child = spawn("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: migrateUrl
  }
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`prisma migrate deploy exited with signal ${signal}`);
    process.exit(1);
  }

  process.exit(code ?? 1);
});
