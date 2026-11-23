const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

let connectionString = (process.env.DATABASE_URL || '').trim();

// Normalize connection string: remove extraneous wrapping quotes if present
if ((connectionString.startsWith('"') && connectionString.endsWith('"')) ||
    (connectionString.startsWith("'") && connectionString.endsWith("'"))) {
  connectionString = connectionString.slice(1, -1);
}

// Fix empty password syntax (postgres:@) which causes node-postgres to fallback to OS username
connectionString = connectionString.replace('postgres:@', 'postgres@');

const isLocal = !connectionString ||
  connectionString.includes('localhost') ||
  connectionString.includes('127.0.0.1');

const poolConfig = {
  connectionString,
  connectionTimeoutMillis: 10000,
};

// Cloud databases (Render PostgreSQL, Supabase, Neon, etc.) require SSL with self-signed certificate allowance
if (!isLocal) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
