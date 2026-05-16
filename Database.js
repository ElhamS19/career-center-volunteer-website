// database.jsgit 
import mysql from "mysql2/promise";

class Database {
  // Private static instance global instance
  static #instance = null;

  // Private constructor prevents direct instantiation
  constructor() {
    if (Database.#instance) {
      throw new Error("Use Database.getInstance() to get the database instance.");
    }
    this.connection = null;
  }

  async connect() {
    if (!this.connection) {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      console.log("✅ Connected to Railway MySQL!");
    }
    return this.connection;
  }

  // Global access point  the only way to get the instance
  static getInstance() {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }
}

export default Database;