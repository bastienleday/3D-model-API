// require dotenv
require("dotenv").config();
const debug = require("debug")("3db: clientConnect");


/**
 * @description - connect to database
 * @returns {object} - database connection
 */
const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PG_DATABASE,
});
pool.connect;

/**
 * @description - export pool
 */
module.exports = pool;
