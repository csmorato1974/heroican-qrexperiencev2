import { ScanLine, Dog, HeartHandshake } from "lucide-react";

const steps = [
  { icon: ScanLine, title: "Escanea el QR", desc: "Apunta tu cámara al QR del empaque Heroican." },
  { icon: Dog, title: "Cuéntanos sobre tu mascota", desc: "Etapa, tamaño y necesidad principal." },
  { icon: HeartHandshake, title: "Recibe recomendación", desc: "Y habla con un asesor por WhatsApp." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-3xl sm:text-4xl font-semibold text-center">¿Cómo funciona?</h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="rounded-2xl bg-card border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </span>
              <span className="font-display text-lg">{i + 1}. {s.title}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
