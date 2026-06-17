import { PRODUCTS } from "@/lib/products";

export function ProductsMatrix() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="flex items-center gap-3">
        <span className="hud-chip">Productos</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <h2 className="mt-4 text-3xl sm:text-4xl font-semibold">
        Familia Heroican<span className="text-accent">.</span>
      </h2>
      <p className="mt-2 text-base text-muted-foreground">
        Cobertura para todo el ciclo de vida. Precios referenciales.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="hud-panel rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-xl">{p.name}</p>
              <span className="hud-chip">
                {p.lifeStage} · {p.breedSize}
              </span>
            </div>
            <ul className="mt-5 space-y-1.5 text-sm">
              {p.presentations.map((pr) => (
                <li
                  key={pr.sizeKg}
                  className="flex items-center justify-between border-b border-dashed border-border py-1.5"
                >
                  <span className="text-muted-foreground">
                    {pr.sizeKg} kg
                  </span>
                  <span className="text-primary font-bold">
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
