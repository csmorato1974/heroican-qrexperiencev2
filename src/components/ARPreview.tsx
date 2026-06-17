import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Activity, Sparkles, Wind, Zap, Radar } from "lucide-react";
import { track } from "@/lib/tracker";
import type { QrParams } from "@/types/domain";

const facets = [
  { icon: Wind, code: "F01", title: "Digestión y confort" },
  { icon: Activity, code: "F02", title: "Motilidad intestinal" },
  { icon: Sparkles, code: "F03", title: "Piel y pelaje" },
  { icon: Zap, code: "F04", title: "Energía diaria" },
];

export function ARPreview({ qrParams }: { qrParams: QrParams }) {
  const [open, setOpen] = useState(false);
  const supportsXR =
    typeof navigator !== "undefined" && "xr" in navigator;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="hud-panel scanline corner-frame rounded-lg p-8 sm:p-12">
        <div className="flex items-center gap-3">
          <span className="hud-chip">SECTOR · 04</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-cyan blink">
            ● SCANNING
          </span>
        </div>
        <h2 className="mt-4 text-3xl sm:text-4xl font-semibold">
          Blueprint Interno<span className="text-accent">.</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Visualización educativa de lo que Heroican apoya en el organismo
          de tu perro.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {facets.map((f) => (
            <div key={f.code} className="hud-panel rounded-md p-4">
              <div className="flex items-center justify-between">
                <f.icon className="h-6 w-6 text-accent" />
                <span className="font-mono text-[10px] tracking-[0.18em] text-cyan">
                  {f.code}
                </span>
              </div>
              <p className="mt-3 font-display text-base">{f.title}</p>
            </div>
          ))}
        </div>

        <Button
          className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 font-mono uppercase tracking-[0.18em] text-xs"
          onClick={() => {
            setOpen(true);
            track("ar_preview_opened", qrParams, { supportsXR });
          }}
        >
          <Radar className="mr-2 h-4 w-4" />
          Iniciar previsualización
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg hud-panel border-none">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase tracking-[0.18em] text-sm text-accent">
              [ PREVIEW_MODE ]
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-square rounded-md scanline border border-accent/30 flex items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
            <div className="text-center px-6">
              <Sparkles className="h-10 w-10 mx-auto text-accent" />
              <p className="mt-3 font-display text-xl">Render educativo</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {supportsXR ? "AR soportado. " : "AR no soportado. "}
                La experiencia inmersiva completa se activa en la fase
                Immersive.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
