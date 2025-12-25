"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AgentRunner_1 = require("../agent/AgentRunner");
const MemoryStore_1 = require("../memory/MemoryStore");
// adjust path if your data folder is named differently
const invoices_extracted_json_1 = __importDefault(require("../data/invoices_extracted.json"));
function runDemo() {
    console.log("========== FLOWBIT AI AGENT DEMO ==========");
    const memory = new MemoryStore_1.MemoryStore();
    const agent = new AgentRunner_1.AgentRunner(memory);
    // For now, run only the first invoice
    const invoice = invoices_extracted_json_1.default[0];
    console.log("\n--- INPUT INVOICE ---");
    console.log(JSON.stringify(invoice, null, 2));
    const output = agent.run(invoice);
    console.log("\n--- AGENT OUTPUT ---");
    console.log(JSON.stringify(output, null, 2));
    console.log("\n========== DEMO END ==========");
}
// Execute immediately
runDemo();
