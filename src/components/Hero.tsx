import { ChevronsRight } from "lucide-react";
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
      <div
        className="absolute inset-0 -z-10 opacity-[0.07] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, var(--accent), transparent 35%), radial-gradient(circle at 80% 70%, var(--cyan), transparent 40%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:pt-16 sm:pb-24">
        <div className="flex flex-wrap items-center gap-2">
          <span className="hud-chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-glow" />
            SYS · ONLINE
          </span>
          <span className="hud-chip" style={{ color: "var(--cyan)" }}>
            QR_ID · {qrId}
          </span>
          <span className="hud-chip" style={{ color: "var(--cyan)" }}>
            LOTE · {lote}
          </span>
          <span className="hud-chip">CAMPAÑA · {campania}</span>
        </div>

        <h1 className="mt-8 font-display text-4xl sm:text-6xl font-semibold leading-[1.02] max-w-3xl">
          MISIÓN 01<span className="text-accent">·</span>
          <br />
          Diagnóstico Nutricional para tu{" "}
          <span className="italic text-primary">engreído</span>.
        </h1>

        <p className="mt-5 max-w-xl text-sm sm:text-base text-muted-foreground">
          Tu asistente de campo ya está activo. Responde la secuencia en el panel
          de la derecha y recibe la recomendación Heroican en menos de 60s.
        </p>

        <div className="mt-8 flex items-center gap-3 text-xs font-mono uppercase tracking-[0.18em] text-accent">
          <ChevronsRight className="h-4 w-4 animate-pulse" />
          <span>Panel del asistente: activo</span>
        </div>

        {/* HUD stats row */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
          {[
            { k: "TASA QR", v: "34.6%" },
            { k: "ENGAGEMENT", v: "00:27" },
            { k: "RECOMPRA", v: "99.6%" },
            { k: "ROI ADQ.", v: "-40%" },
          ].map((s) => (
            <div
              key={s.k}
              className="hud-panel corner-frame rounded-md p-3"
            >
              <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
                {s.k}
              </p>
              <p className="mt-1 font-display text-2xl text-accent">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
