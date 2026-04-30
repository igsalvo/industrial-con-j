import { PrismaClient } from "@prisma/client";
import { loadLocalEnv } from "./load-env.mjs";

loadLocalEnv();

const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

function inspectConnection(name, value) {
  if (!value) {
    return { name, configured: false };
  }

  const url = new URL(value);

  return {
    name,
    configured: true,
    provider: url.hostname.includes("supabase.com")
      ? "supabase"
      : url.hostname.includes("neon.tech")
        ? "neon"
        : "other",
    host: url.hostname,
    port: url.port || "(default)",
    user: url.username,
    database: url.pathname.replace("/", "") || "(none)",
    params: Array.from(url.searchParams.keys()).sort()
  };
}

function printInspection(info) {
  if (!info.configured) {
    console.log(`${info.name}: not configured`);
    return;
  }

  console.log(`${info.name}: ${info.provider}`);
  console.log(`  host: ${info.host}`);
  console.log(`  port: ${info.port}`);
  console.log(`  user: ${info.user}`);
  console.log(`  database: ${info.database}`);
  console.log(`  params: ${info.params.length ? info.params.join(", ") : "(none)"}`);
}

if (!databaseUrl) {
  console.error("DATABASE_URL is not configured.");
  process.exit(1);
}

printInspection(inspectConnection("DATABASE_URL", databaseUrl));
printInspection(inspectConnection("DIRECT_URL", directUrl));

const prisma = new PrismaClient({
  log: ["error"]
});

try {
  const startedAt = Date.now();
  await prisma.$queryRaw`select 1`;
  console.log(`Prisma connection: ok (${Date.now() - startedAt}ms)`);
} catch (error) {
  console.error("Prisma connection: failed");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
