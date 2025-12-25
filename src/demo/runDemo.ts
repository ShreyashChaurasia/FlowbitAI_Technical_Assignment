import { AgentRunner } from "../agent/AgentRunner";
import { MemoryStore } from "../memory/MemoryStore";

// adjust path if your data folder is named differently
import invoices from "../data/invoices_extracted.json";

function runDemo() {
  console.log("========== FLOWBIT AI AGENT DEMO ==========");

  const memory = new MemoryStore();
  const agent = new AgentRunner(memory);

  // For now, run only the first invoice
  const invoice = invoices[0] as any;

  console.log("\n--- INPUT INVOICE ---");
  console.log(JSON.stringify(invoice, null, 2));

  const output = agent.run(invoice);

  console.log("\n--- AGENT OUTPUT ---");
  console.log(JSON.stringify(output, null, 2));

  console.log("\n========== DEMO END ==========");
}

// Execute immediately
runDemo();
