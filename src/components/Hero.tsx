import { ChevronsRight, PawPrint } from "lucide-react";
import type { QrParams } from "@/types/domain";

interface Props {
  qrParams: QrParams;
}

export function Hero({ qrParams }: Props) {
  const qrId = qrParams.qr_id ?? "QR-DEMO-0001";
  const lote = qrParams.lote ?? "LT-2026-06";
  const campania = qrParams.campania ?? "ENTRY-PILOT";

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:pt-16 sm:pb-24">
        <div className="flex flex-wrap items-center gap-2">
          <span className="hud-chip">
            <PawPrint className="h-3.5 w-3.5" />
            Asistente activo
          </span>
          <span className="hud-chip">QR · {qrId}</span>
          <span className="hud-chip">Lote · {lote}</span>
          <span className="hud-chip">Campaña · {campania}</span>
        </div>

        <h1 className="mt-8 font-display text-4xl sm:text-6xl font-semibold leading-[1.02] max-w-3xl">
          Misión 01:
          <br />
          Diagnóstico nutricional para tu{" "}
          <span className="italic text-primary">engreído</span>
          <span className="text-accent">.</span>
        </h1>

        <p className="mt-5 max-w-xl text-base text-muted-foreground">
          Tu asistente Heroican ya está listo. Responde unas preguntas en el
          panel y recibe la recomendación ideal en menos de 60 segundos.
        </p>

        <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-primary">
          <ChevronsRight className="h-4 w-4 animate-pulse" />
          <span>Mira el panel del asistente →</span>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
          {[
            { k: "Tasa QR", v: "34.6%" },
            { k: "Engagement", v: "00:27" },
            { k: "Recompra", v: "99.6%" },
            { k: "ROI adquisición", v: "-40%" },
          ].map((s) => (
            <div key={s.k} className="hud-panel rounded-2xl p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {s.k}
              </p>
              <p className="mt-1 font-display text-2xl text-primary">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
