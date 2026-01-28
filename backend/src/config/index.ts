import dotenv from "dotenv";

dotenv.config();

export const config = {
  database: {
    url: process.env.DATABASE_URL,
  },
  app: {
    environment: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "3000", 10),
  },
  sync: {
    batchSize: 100,
  },
};

export default config;
