import { Button } from "@/components/ui/button";
import { QrCode, MessageCircle } from "lucide-react";

interface Props {
  onStart: () => void;
  onWhatsapp: () => void;
}

export function Hero({ onStart, onWhatsapp }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--accent) 25%, transparent), transparent 70%), linear-gradient(180deg, color-mix(in oklab, var(--primary) 8%, transparent), transparent 40%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:pt-20 sm:pb-24 text-center">
        <p className="font-display text-2xl tracking-wide text-primary">HEROICAN</p>
        <h1 className="mt-6 text-4xl sm:text-6xl font-semibold leading-tight">
          Alimenta su lealtad con una <span className="text-primary">experiencia</span> hecha para tu engreído
        </h1>
        <p className="mt-5 mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground">
          Escanea, responde unas preguntas y recibe una recomendación Heroican según la etapa y tamaño de tu perro.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={onStart} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
            <QrCode className="mr-2 h-5 w-5" /> Iniciar diagnóstico rápido
          </Button>
          <Button size="lg" variant="outline" onClick={onWhatsapp}>
            <MessageCircle className="mr-2 h-5 w-5" /> Hablar por WhatsApp
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Sin descargar apps · Experiencia desde el empaque · Asistencia por WhatsApp
        </p>
        <p className="mt-2 text-xs text-muted-foreground/80">
          Esta orientación es informativa y no reemplaza la evaluación de un veterinario.
        </p>
      </div>
    </section>
  );
}
