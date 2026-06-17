import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, Sparkles, Wind, Zap, Camera } from "lucide-react";
import { track } from "@/lib/tracker";
import { BlueprintCamera } from "./blueprint/BlueprintCamera";
import type { QrParams } from "@/types/domain";
import heroicanPack from "@/assets/heroican-pack.png.asset.json";

const facets = [
  { icon: Wind, title: "Confort digestivo" },
  { icon: Zap, title: "Vitalidad y energía" },
  { icon: Sparkles, title: "Piel y pelaje" },
  { icon: Activity, title: "Palatabilidad" },
];

export function ARPreview({ qrParams }: { qrParams: QrParams }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="hud-panel rounded-3xl p-8 sm:p-12" style={{ background: "var(--gradient-hero)" }}>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="hud-chip">Experiencia con cámara</span>
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold">
              Conoce a tu engreído por dentro<span className="text-accent">.</span>
            </h2>
            <p className="mt-2 max-w-xl text-base text-muted-foreground">
              Toma una foto de tu mascota y descubre, sobre la imagen, los beneficios
              Heroican que la cuidan cada día.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {facets.map((f) => (
                <div key={f.title} className="hud-panel rounded-2xl p-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <f.icon className="h-5 w-5 text-primary" />
                  </span>
                  <p className="mt-3 font-display text-base">{f.title}</p>
                </div>
              ))}
            </div>

            <Button
              className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 h-12 font-bold"
              onClick={() => {
                setOpen(true);
                track("blueprint_camera_opened", qrParams);
              }}
            >
              <Camera className="mr-2 h-5 w-5" />
              Tomar foto a mi mascota
            </Button>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-primary/5 blur-2xl" aria-hidden />
            <img
              src={heroicanPack.url}
              alt="Empaque Heroican con interfaz de Realidad Aumentada mostrando scanpoints e ingredientes"
              className="relative w-full h-auto rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <BlueprintCamera open={open} onOpenChange={setOpen} qrParams={qrParams} />
    </section>
  );
}
