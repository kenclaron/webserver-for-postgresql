const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "node_postgres_minidb_test",
  password: "root",
  port: 5432,
});

module.exports = pool;