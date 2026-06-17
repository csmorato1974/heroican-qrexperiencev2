import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, Sparkles, Wind, Zap, Camera } from "lucide-react";
import { track } from "@/lib/tracker";
import { BlueprintCamera } from "./blueprint/BlueprintCamera";
import type { QrParams } from "@/types/domain";

const facets = [
  { icon: Wind, code: "F01", title: "Confort digestivo" },
  { icon: Zap, code: "F02", title: "Vitalidad y energía" },
  { icon: Sparkles, code: "F03", title: "Piel y pelaje" },
  { icon: Activity, code: "F04", title: "Palatabilidad" },
];

export function ARPreview({ qrParams }: { qrParams: QrParams }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="hud-panel scanline corner-frame rounded-lg p-8 sm:p-12">
        <div className="flex items-center gap-3">
          <span className="hud-chip">SECTOR · 04</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-cyan blink">
            ● CAM_READY
          </span>
        </div>
        <h2 className="mt-4 text-3xl sm:text-4xl font-semibold">
          Blueprint Interno<span className="text-accent">.</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Saca una foto de tu mascota y desbloquea badges con los beneficios
          Heroican anclados directamente sobre la imagen.
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
          className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 font-mono uppercase tracking-[0.18em] text-xs pulse-glow"
          onClick={() => {
            setOpen(true);
            track("blueprint_camera_opened", qrParams);
          }}
        >
          <Camera className="mr-2 h-4 w-4" />
          Escanear a mi mascota
        </Button>
      </div>

      <BlueprintCamera open={open} onOpenChange={setOpen} qrParams={qrParams} />
    </section>
  );
}
