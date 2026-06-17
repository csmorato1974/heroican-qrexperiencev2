import { Leaf, Fish, Drumstick, Sparkles, Layers, ShieldCheck } from "lucide-react";

const items = [
  { icon: Leaf, title: "Canela funcional", desc: "Efecto carminativo. Apoyo al confort digestivo." },
  { icon: Fish, title: "Hidrolizados", desc: "Mejor palatabilidad para perros exigentes." },
  { icon: Drumstick, title: "20% mín. proteína", desc: "Vitalidad y mantenimiento muscular." },
  { icon: Sparkles, title: "Vitaminas y minerales", desc: "Aminoácidos clave para el bienestar." },
  { icon: Layers, title: "Fórmulas segmentadas", desc: "Etapa de vida × tamaño de raza." },
  { icon: ShieldCheck, title: "Bienestar animal", desc: "Compromiso con tenencia responsable." },
];

export function Benefits() {
  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex items-center gap-3">
          <span className="hud-chip">Beneficios</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <h2 className="mt-4 text-3xl sm:text-4xl font-semibold">
          Lo que come tu engreído<span className="text-accent">.</span>
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="hud-panel rounded-2xl p-5 transition hover:-translate-y-0.5"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                <it.icon className="h-5 w-5 text-primary" />
              </span>
              <p className="mt-4 font-display text-lg">{it.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
