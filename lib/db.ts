export const dbConfig = {
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  name: process.env.DB_NAME ?? "web_kelulusan",
  url: process.env.DATABASE_URL ?? "",
};

export function getDbConfig() {
  return dbConfig;
}
