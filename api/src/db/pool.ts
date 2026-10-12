import pg from 'pg';

const { Pool } = pg;

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : undefined,
);

export default pool;