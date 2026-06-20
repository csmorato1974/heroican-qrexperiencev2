import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, ScanLine, ShieldCheck, X } from "lucide-react";

interface Props {
  open: boolean;
  onCancel: () => void;
  onReady: () => void;
}

const STEPS = [
  "Detectando contorno…",
  "Preparando análisis visual…",
  "Listo para capturar",
];

const AUTO_READY_MS = 2500;
const STEP_INTERVAL_MS = 800;

export function PetScannerOverlay({ open, onCancel, onReady }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) {
      setStep(0);
      return;
    }
    const stepTimer = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, STEP_INTERVAL_MS);
    const readyTimer = setTimeout(onReady, AUTO_READY_MS);
    return () => {
      clearInterval(stepTimer);
      clearTimeout(readyTimer);
    };
  }, [open, onReady]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent
        showCloseButton={false}
        className="p-0 border-0 bg-transparent shadow-none max-w-[100vw] w-screen h-[100svh] sm:max-w-md sm:h-auto sm:rounded-3xl overflow-hidden"
      >
        <div
          className="relative flex flex-col h-[100svh] sm:h-[80svh] sm:rounded-3xl overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between px-4 pt-4 sm:pt-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <ScanLine className="h-4 w-4 text-primary" />
              </span>
              <p className="font-display text-base leading-tight">
                Preparando escaneo
              </p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              aria-label="Cancelar escaneo"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/80 border border-border text-foreground hover:bg-card transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scanner frame */}
          <div className="relative flex-1 flex items-center justify-center px-6">
            <div
              className="relative w-full max-w-[320px] mx-auto"
              style={{ aspectRatio: "3 / 4" }}
            >
              {/* Inner viewfinder background */}
              <div className="absolute inset-0 rounded-2xl bg-background/40 backdrop-blur-sm border border-primary/20 overflow-hidden">
                {/* Scanning line */}
                <div className="absolute inset-x-3 top-0 h-px scan-line">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
                  <div className="h-6 w-full bg-gradient-to-b from-primary/30 to-transparent blur-sm -mt-px" />
                </div>

                {/* Pulsing center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inset-0 rounded-full bg-primary/40 pulse-glow" />
                    <span className="relative m-auto h-2 w-2 rounded-full bg-primary border border-background" />
                  </span>
                </div>
              </div>

              {/* Corner brackets */}
              {(
                [
                  ["top-0 left-0", "border-t-2 border-l-2 rounded-tl-2xl"],
                  ["top-0 right-0", "border-t-2 border-r-2 rounded-tr-2xl"],
                  ["bottom-0 left-0", "border-b-2 border-l-2 rounded-bl-2xl"],
                  ["bottom-0 right-0", "border-b-2 border-r-2 rounded-br-2xl"],
                ] as const
              ).map(([pos, border], i) => (
                <span
                  key={i}
                  className={`absolute ${pos} h-8 w-8 ${border} border-primary scan-corner`}
                />
              ))}

              {/* Status label */}
              <div className="absolute -bottom-12 inset-x-0 flex justify-center">
                <span className="text-[12px] font-bold text-foreground/90 bg-card/85 backdrop-blur border border-border rounded-full px-3 py-1.5 shadow-sm">
                  {STEPS[step]}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="relative z-10 px-5 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-3">
            <Button
              onClick={onReady}
              className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            >
              <Camera className="mr-2 h-5 w-5" />
              Capturar ahora
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Auto-captura en breve. Apunta a tu mascota dentro del marco.
            </p>
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              Procesamos la foto solo para este análisis. No la guardamos.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
