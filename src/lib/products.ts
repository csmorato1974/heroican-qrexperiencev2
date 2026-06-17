import type { Product } from "@/types/domain";

// Editable por el equipo comercial. Precios referenciales.
export const PRODUCTS: Product[] = [
  {
    id: "adulto-grande",
    name: "Heroican Perro Adulto Raza Grande",
    lifeStage: "Adulto",
    breedSize: "Raza grande",
    presentations: [
      { sizeKg: 3, pricePen: 25 },
      { sizeKg: 15, pricePen: 115 },
      { sizeKg: 22, pricePen: 160 },
    ],
    benefits: ["Mínimo 20% de proteína", "Canela funcional", "Vitaminas y minerales"],
    ingredientsSummary:
      "Maíz, arroz, harina de carne, harina de pescado, trigo, torta de soja, aceite de pollo, hidrolizado enzimático de hígado de pollo, premezcla vitamínico mineral, canela, DL metionina.",
  },
  {
    id: "adulto-pequena",
    name: "Heroican Perro Adulto Raza Pequeña",
    lifeStage: "Adulto",
    breedSize: "Raza pequeña",
    presentations: [
      { sizeKg: 3, pricePen: 25 },
      { sizeKg: 15, pricePen: 115 },
      { sizeKg: 22, pricePen: 150 },
    ],
    benefits: ["Proteína de alta digestibilidad", "Hidrolizados palatables", "Canela funcional"],
    ingredientsSummary:
      "Base nutricional con proteína animal, cereales, hidrolizados, vitaminas, minerales y canela funcional.",
  },
  {
    id: "cachorro-grande",
    name: "Heroican Perro Cachorro Raza Grande",
    lifeStage: "Cachorro",
    breedSize: "Raza grande",
    presentations: [
      { sizeKg: 3, pricePen: 27 },
      { sizeKg: 15, pricePen: 120 },
      { sizeKg: 22, pricePen: 160 },
    ],
    benefits: ["Soporte de crecimiento", "Leche incluida", "Canela funcional"],
    ingredientsSummary:
      "Base nutricional con proteína, cereales, hidrolizados, leche, vitaminas, minerales y canela.",
  },
  {
    id: "cachorro-pequena",
    name: "Heroican Perro Cachorro Raza Pequeña",
    lifeStage: "Cachorro",
    breedSize: "Raza pequeña",
    presentations: [
      { sizeKg: 3, pricePen: 27 },
      { sizeKg: 15, pricePen: 120 },
      { sizeKg: 22, pricePen: 160 },
    ],
    benefits: ["Crecimiento saludable", "Hidrolizados palatables", "Leche incluida"],
    ingredientsSummary:
      "Maíz, arroz, harina de carne, harina de pescado, trigo, torta de soja, aceite de pollo, hidrolizado enzimático de hígado de pollo, leche, premezcla vitamínico mineral, canela, DL metionina.",
  },
];
