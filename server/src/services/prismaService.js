const { PrismaClient } = require("@prisma/client");
const path = require("path");
const dotenv = require("dotenv");

// Force load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Log the DATABASE_URL to confirm it's loaded correctly (remove in production)
console.log("Environment loading debug:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log(
  "DATABASE_URL preview:",
  process.env.DATABASE_URL
    ? process.env.DATABASE_URL.substring(0, 20) + "..."
    : "undefined"
);

// Validate DATABASE_URL format
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

if (
  !process.env.DATABASE_URL.startsWith("postgresql://") &&
  !process.env.DATABASE_URL.startsWith("postgres://")
) {
  throw new Error(
    `Invalid DATABASE_URL format. Expected postgresql:// or postgres://, got: ${process.env.DATABASE_URL.substring(
      0,
      20
    )}...`
  );
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

module.exports = prisma;
