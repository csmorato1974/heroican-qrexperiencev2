import { ScanLine, MessageSquareCode, Sparkles, Crosshair } from "lucide-react";

const steps = [
  { icon: ScanLine, code: "01", title: "Conexión", desc: "Escanea el QR del empaque. Sin apps, fricción cero." },
  { icon: MessageSquareCode, code: "02", title: "Interacción IA", desc: "El asistente perfila a tu mascota: etapa, raza, necesidad." },
  { icon: Sparkles, code: "03", title: "Experiencia AR", desc: "Visualización educativa de los ingredientes locales." },
  { icon: Crosshair, code: "04", title: "Fidelización", desc: "Captura del lead y asesoría continua por WhatsApp." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="flex items-center gap-3">
        <span className="hud-chip">SECTOR · 02</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <h2 className="mt-4 text-3xl sm:text-4xl font-semibold">
        Customer Journey<span className="text-accent">.</span>
      </h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-xl">
        Fricción cero desde el producto físico hasta la recompra.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.code} className="hud-panel corner-frame rounded-md p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-[0.2em] text-cyan">
                STEP_{s.code}
              </span>
              <s.icon className="h-5 w-5 text-accent" />
            </div>
            <p className="mt-4 font-display text-xl">{s.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            <div className="mt-4 h-px bg-gradient-to-r from-accent/60 via-accent/10 to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
}
