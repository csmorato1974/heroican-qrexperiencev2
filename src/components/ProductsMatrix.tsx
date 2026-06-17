import { PRODUCTS } from "@/lib/products";

export function ProductsMatrix() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-3xl sm:text-4xl font-semibold text-center">Productos Heroican</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Precios referenciales editables por el equipo comercial.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-6">
            <p className="font-display text-xl">{p.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {p.lifeStage} · {p.breedSize}
            </p>
            <ul className="mt-4 space-y-1 text-sm">
              {p.presentations.map((pr) => (
                <li key={pr.sizeKg} className="flex justify-between border-b border-dashed border-border py-1">
                  <span>{pr.sizeKg} kg</span>
                  <span className="font-semibold">S/{pr.pricePen}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">{p.ingredientsSummary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
