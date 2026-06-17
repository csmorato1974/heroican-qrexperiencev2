import { PRODUCTS } from "@/lib/products";

export function ProductsMatrix() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="flex items-center gap-3">
        <span className="hud-chip">SECTOR · 05</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <h2 className="mt-4 text-3xl sm:text-4xl font-semibold">
        Arsenal Heroican<span className="text-accent">.</span>
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Cobertura del 100% del ciclo de vida. Precios referenciales.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="hud-panel corner-frame rounded-md p-5">
            <div className="flex items-start justify-between">
              <p className="font-display text-xl">{p.name}</p>
              <span className="hud-chip" style={{ color: "var(--cyan)" }}>
                {p.lifeStage} · {p.breedSize}
              </span>
            </div>
            <ul className="mt-5 space-y-1.5 text-sm font-mono">
              {p.presentations.map((pr) => (
                <li
                  key={pr.sizeKg}
                  className="flex items-center justify-between border-b border-dashed border-border/60 py-1.5"
                >
                  <span className="text-muted-foreground">
                    {String(pr.sizeKg).padStart(2, "0")} KG
                  </span>
                  <span className="text-accent font-semibold">
                    S/ {pr.pricePen.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              {p.ingredientsSummary}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
