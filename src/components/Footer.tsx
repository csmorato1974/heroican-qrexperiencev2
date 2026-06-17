import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/50 mt-12">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <p className="font-display text-2xl text-primary">Heroican</p>
          <p className="mt-2 text-muted-foreground">
            Nutrición premium para perros. Pocollay, Tacna · Perú.
          </p>
        </div>
        <div className="space-y-1">
          <p className="font-bold text-foreground">Contacto</p>
          <p className="text-muted-foreground">ventas@heroican.com</p>
          <p className="text-muted-foreground">WhatsApp · +591 6121 2107</p>
        </div>
        <div className="space-y-1">
          <p className="font-bold text-foreground">Legal</p>
          <a className="block text-muted-foreground hover:text-primary" href="#">
            Privacidad
          </a>
          <a className="block text-muted-foreground hover:text-primary" href="#">
            Términos
          </a>
          <a className="block text-muted-foreground hover:text-primary" href="#">
            Libro de reclamaciones
          </a>
          <Link
            to="/metrics"
            className="block mt-3 text-primary/80 hover:text-primary"
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
