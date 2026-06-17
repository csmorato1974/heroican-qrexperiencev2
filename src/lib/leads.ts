import type { Lead } from "@/types/domain";

const LEADS_KEY = "heroican.leads";

export function readLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LEADS_KEY) ?? "[]") as Lead[];
  } catch {
    return [];
  }
}

export function saveLead(lead: Lead): void {
  if (typeof window === "undefined") return;
  const all = readLeads();
  all.push(lead);
  window.localStorage.setItem(LEADS_KEY, JSON.stringify(all));
}
