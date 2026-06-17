import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40 mt-12">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <p className="font-display text-xl text-primary tracking-wider">
            HEROICAN
          </p>
          <p className="mt-2 text-muted-foreground">
            Nutrición premium para perros. Pocollay, Tacna · Perú.
          </p>
          <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-accent">
            [ SYS · ONLINE · v0.1-ENTRY ]
          </p>
        </div>
        <div className="space-y-1 font-mono text-xs">
          <p className="font-semibold text-foreground uppercase tracking-[0.18em] text-[11px]">
            Contacto
          </p>
          <p className="text-muted-foreground">ventas@heroican.com</p>
          <p className="text-muted-foreground">WA · +51 942 799 091</p>
        </div>
        <div className="space-y-1 font-mono text-xs">
          <p className="font-semibold text-foreground uppercase tracking-[0.18em] text-[11px]">
            Legal
          </p>
          <a className="block text-muted-foreground hover:text-accent" href="#">
            Privacidad
          </a>
          <a className="block text-muted-foreground hover:text-accent" href="#">
            Términos
          </a>
          <a className="block text-muted-foreground hover:text-accent" href="#">
            Libro de reclamaciones
          </a>
          <Link
            to="/metrics"
            className="block mt-3 text-accent/80 hover:text-accent"
          >
            · Métricas del piloto ▸
          </Link>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground pb-6 px-4">
        Esta orientación es informativa y no reemplaza la evaluación de un
        veterinario.
      </p>
    </footer>
  );
}
