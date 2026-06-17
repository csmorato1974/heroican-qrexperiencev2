import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <p className="font-display text-xl text-primary">HEROICAN</p>
          <p className="mt-2 text-muted-foreground">
            Nutrición premium para perros. Pocollay, Tacna · Perú.
          </p>
        </div>
        <div className="space-y-1">
          <p className="font-semibold">Contacto</p>
          <p className="text-muted-foreground">ventas@heroican.com</p>
          <p className="text-muted-foreground">WhatsApp: +51 942 799 091</p>
        </div>
        <div className="space-y-1">
          <p className="font-semibold">Legal</p>
          <a className="block text-muted-foreground hover:text-primary" href="#">Políticas de privacidad</a>
          <a className="block text-muted-foreground hover:text-primary" href="#">Términos</a>
          <a className="block text-muted-foreground hover:text-primary" href="#">Libro de reclamaciones</a>
          <Link to="/metrics" className="block text-xs text-muted-foreground/70 hover:text-primary mt-3">
            · Métricas del piloto
          </Link>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground pb-6 px-4">
        Esta orientación es informativa y no reemplaza la evaluación de un veterinario.
      </p>
    </footer>
  );
}
