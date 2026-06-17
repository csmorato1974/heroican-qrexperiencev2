import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Activity, Sparkles, Wind, Zap } from "lucide-react";
import { track } from "@/lib/tracker";
import type { QrParams } from "@/types/domain";

const facets = [
  { icon: Wind, title: "Digestión y confort intestinal", color: "from-amber-200 to-orange-300" },
  { icon: Activity, title: "Motilidad", color: "from-orange-200 to-rose-300" },
  { icon: Sparkles, title: "Piel y pelaje", color: "from-yellow-200 to-amber-300" },
  { icon: Zap, title: "Energía diaria", color: "from-rose-200 to-amber-200" },
];

export function ARPreview({ qrParams }: { qrParams: QrParams }) {
  const [open, setOpen] = useState(false);
  const supportsXR =
    typeof navigator !== "undefined" && "xr" in navigator;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 text-center shadow-sm">
        <h2 className="text-3xl sm:text-4xl font-semibold">Explora los beneficios internos</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Una visualización educativa de lo que Heroican apoya en el organismo de tu perro.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facets.map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl p-6 bg-gradient-to-br ${f.color} text-graphite shadow-sm`}
            >
              <f.icon className="h-7 w-7 mx-auto" />
              <p className="mt-3 font-semibold text-sm">{f.title}</p>
            </div>
          ))}
        </div>
        <Button
          className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => {
            setOpen(true);
            track("ar_preview_opened", qrParams, { supportsXR });
          }}
        >
          Ver previsualización
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Previsualización educativa</DialogTitle>
          </DialogHeader>
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent/40 via-primary/20 to-secondary flex items-center justify-center">
            <div className="text-center px-6">
              <Sparkles className="h-10 w-10 mx-auto text-primary" />
              <p className="mt-3 font-display text-xl">Animación 2D educativa</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {supportsXR
                  ? "Tu dispositivo soporta AR. "
                  : "Tu dispositivo no soporta AR. "}
                La experiencia AR completa se activará en una fase posterior.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
