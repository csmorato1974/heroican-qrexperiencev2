import { ScanLine, MessageSquareHeart, Sparkles, PawPrint } from "lucide-react";

const steps = [
  { icon: ScanLine, n: "1", title: "Escanea", desc: "Conecta con el QR del empaque. Sin apps, fricción cero." },
  { icon: MessageSquareHeart, n: "2", title: "Conversa", desc: "El asistente conoce a tu engreído: etapa, raza y necesidad." },
  { icon: Sparkles, n: "3", title: "Descubre", desc: "Explora los ingredientes y beneficios de Heroican." },
  { icon: PawPrint, n: "4", title: "Acompañamiento", desc: "Asesoría continua por WhatsApp para ti y tu mascota." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="flex items-center gap-3">
        <span className="hud-chip">Cómo funciona</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <h2 className="mt-4 text-3xl sm:text-4xl font-semibold">
        Tu viaje con Heroican<span className="text-accent">.</span>
      </h2>
      <p className="mt-2 text-base text-muted-foreground max-w-xl">
        Del empaque a la recomendación, sin fricción.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="hud-panel rounded-2xl p-5 transition hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-lg text-primary">
                {s.n}
              </span>
              <s.icon className="h-5 w-5 text-primary/70" />
            </div>
            <p className="mt-4 font-display text-xl">{s.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
