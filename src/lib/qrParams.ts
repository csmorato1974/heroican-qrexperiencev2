import type { QrParams } from "@/types/domain";

export function parseQrParams(search: string | URLSearchParams): QrParams {
  const sp = typeof search === "string" ? new URLSearchParams(search) : search;
  return {
    qr_id: sp.get("qr_id") ?? undefined,
    producto: sp.get("producto") ?? undefined,
    lote: sp.get("lote") ?? undefined,
    campania: sp.get("campania") ?? sp.get("campaña") ?? sp.get("campaign") ?? undefined,
    ciudad_url: sp.get("ciudad") ?? sp.get("ciudad_url") ?? undefined,
  };
}
