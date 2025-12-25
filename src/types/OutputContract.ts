export interface AuditEntry {
  step: "recall" | "apply" | "decide" | "learn";
  timestamp: string;
  details: string;
}

export interface AgentOutput {
  normalizedInvoice: Record<string, any>;
  proposedCorrections: string[];
  requiresHumanReview: boolean;
  reasoning: string;
  confidenceScore: number;
  memoryUpdates: string[];
  auditTrail: AuditEntry[];
}
