import { Leaf, Fish, Drumstick, Sparkles, Layers, ShieldCheck } from "lucide-react";

const items = [
  { icon: Leaf, title: "Canela funcional", desc: "Apoyo al confort digestivo y efecto carminativo." },
  { icon: Fish, title: "Hidrolizados", desc: "Mejor palatabilidad para perros exigentes." },
  { icon: Drumstick, title: "20% mínimo de proteína", desc: "Soporte de vitalidad y mantenimiento muscular." },
  { icon: Sparkles, title: "Vitaminas y minerales", desc: "Aminoácidos clave para el bienestar general." },
  { icon: Layers, title: "Fórmulas por etapa y tamaño", desc: "Cachorro/adulto · raza pequeña/grande." },
  { icon: ShieldCheck, title: "Bienestar animal", desc: "Compromiso con tenencia responsable." },
];

export function Benefits() {
  return (
    <section className="bg-secondary/40 border-y border-border">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center">Beneficios Heroican</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="rounded-2xl bg-card border border-border p-6">
              <it.icon className="h-6 w-6 text-accent" />
              <p className="mt-3 font-semibold">{it.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
