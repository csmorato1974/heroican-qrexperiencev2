import { Leaf, Fish, Drumstick, Sparkles, Layers, ShieldCheck } from "lucide-react";

const items = [
  { icon: Leaf, code: "B01", title: "Canela funcional", desc: "Efecto carminativo. Apoyo al confort digestivo." },
  { icon: Fish, code: "B02", title: "Hidrolizados", desc: "Mejor palatabilidad para perros exigentes." },
  { icon: Drumstick, code: "B03", title: "20% mín. proteína", desc: "Vitalidad y mantenimiento muscular." },
  { icon: Sparkles, code: "B04", title: "Vitaminas y minerales", desc: "Aminoácidos clave para el bienestar." },
  { icon: Layers, code: "B05", title: "Fórmulas segmentadas", desc: "Etapa × tamaño de raza." },
  { icon: ShieldCheck, code: "B06", title: "Bienestar animal", desc: "Compromiso con tenencia responsable." },
];

export function Benefits() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex items-center gap-3">
          <span className="hud-chip">SECTOR · 03</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <h2 className="mt-4 text-3xl sm:text-4xl font-semibold">
          Loadout Nutricional<span className="text-accent">.</span>
        </h2>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.code}
              className="hud-panel rounded-md p-5 transition-all hover:-translate-y-0.5 hover:border-accent/60"
            >
              <div className="flex items-center justify-between">
                <it.icon className="h-6 w-6 text-accent" />
                <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
                  {it.code}
                </span>
              </div>
              <p className="mt-4 font-display text-lg">{it.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
