import { Invoice } from "../types/Invoice";
import { AgentOutput, AuditEntry } from "../types/OutputContract";
import { MemoryStore } from "../memory/MemoryStore";

function extractGermanDate(rawText: string): string | null {
  const match = rawText.match(/\b\d{2}\.\d{2}\.\d{4}\b/);
  if (!match) return null;

  const [day, month, year] = match[0].split(".");
  return `${year}-${month}-${day}`; // normalize to ISO
}

export class AgentRunner {
  constructor(private memory: MemoryStore) { }

  run(invoice: Invoice): AgentOutput {
    const auditTrail: AuditEntry[] = [];

    const vendorMemories = this.memory.getVendorMemory(invoice.vendor);
    // ---- RECALL ----
    auditTrail.push({
      step: "recall",
      timestamp: new Date().toISOString(),
      details: `Recalled memory for vendor ${invoice.vendor}`
    });

    this.memory.logAudit(invoice.invoiceId, "recall", "Memory recalled");

    // ---- APPLY ----
    const proposedCorrections: string[] = [];
    const normalizedInvoice = { ...invoice.fields };

    for (const mem of vendorMemories) {
      // We only handle serviceDate for now
      if (
        mem.key === "serviceDate" &&
        normalizedInvoice.serviceDate == null &&
        invoice.rawText.includes(mem.value) &&
        mem.confidence >= 0.6
      ) {
        const extractedDate = extractGermanDate(invoice.rawText);

        if (extractedDate) {
          normalizedInvoice.serviceDate = extractedDate;

          proposedCorrections.push(
            `serviceDate filled using vendor memory (${mem.value})`
          );

          auditTrail.push({
            step: "apply",
            timestamp: new Date().toISOString(),
            details: `Applied vendor memory: ${mem.value} → serviceDate`
          });
        }
      }
    }

    if (proposedCorrections.length === 0) {
      auditTrail.push({
        step: "apply",
        timestamp: new Date().toISOString(),
        details: "No applicable vendor memory found"
      });
    }

    this.memory.logAudit(invoice.invoiceId, "apply", "No changes applied");

    // ---- DECIDE ----
    const requiresHumanReview = proposedCorrections.length === 0;

    auditTrail.push({
      step: "decide",
      timestamp: new Date().toISOString(),
      details: requiresHumanReview
        ? "No confident memory → escalated for human review"
        : "High-confidence vendor memory applied → no review required"
    });

    this.memory.logAudit(invoice.invoiceId, "decide", "Requires human review");

    return {
      normalizedInvoice,
      proposedCorrections,
      requiresHumanReview,
      reasoning:
        proposedCorrections.length > 0
          ? "Vendor-specific learned pattern applied (Leistungsdatum → serviceDate)"
          : "No high-confidence vendor memory available",
      confidenceScore:
        proposedCorrections.length > 0
          ? Math.min(1, invoice.confidence + 0.1)
          : invoice.confidence,
      memoryUpdates: [],
      auditTrail
    };
  }
}
