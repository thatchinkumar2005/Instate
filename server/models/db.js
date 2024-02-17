import pg from "pg";

const db = new pg.Pool({
  user: "postgres",
  password: "123456",
  database: "instate_v1",
  host: "localhost",
  port: 5433,
});

export async function query(query, dependancies, callback) {
  return await db.query(query, dependancies, callback);
}
