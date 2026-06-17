import { PRODUCTS } from "./products";
import type { BreedSize, LifeStage, Product } from "@/types/domain";

export function recommend(lifeStage: LifeStage, breedSize: BreedSize): Product {
  const match = PRODUCTS.find((p) => p.lifeStage === lifeStage && p.breedSize === breedSize);
  if (!match) throw new Error("No matching product");
  return match;
}

export const PRESENTATION_GUIDE = {
  3: "Ideal para una prueba inicial.",
  15: "Recomendado para consumo regular.",
  22: "Pensado para hogares con mayor consumo o recompra planificada.",
} as const;
