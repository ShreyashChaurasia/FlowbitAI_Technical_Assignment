"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStore = void 0;
const Database = require("better-sqlite3");
class MemoryStore {
    constructor() {
        this.db = new Database("memory.db");
        this.init();
    }
    init() {
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS vendor_memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor TEXT,
        key TEXT,
        value TEXT,
        confidence REAL,
        updatedAt TEXT
      )
    `).run();
        this.db.prepare(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoiceId TEXT,
        step TEXT,
        details TEXT,
        timestamp TEXT
      )
    `).run();
    }
    getVendorMemory(vendor) {
        return this.db.prepare(`
      SELECT * FROM vendor_memory
      WHERE vendor = ?
    `).all(vendor);
    }
    logAudit(invoiceId, step, details) {
        this.db.prepare(`
      INSERT INTO audit_logs (invoiceId, step, details, timestamp)
      VALUES (?, ?, ?, ?)
    `).run(invoiceId, step, details, new Date().toISOString());
    }
}
exports.MemoryStore = MemoryStore;
