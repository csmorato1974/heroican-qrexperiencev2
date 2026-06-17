export interface BlueprintBadge {
  code: string;
  title: string;
  body: string;
  /** Position on the photo, percentage (0-100) */
  x: number;
  y: number;
  /** Side of the card relative to the hotspot */
  side: "left" | "right";
}

export const BLUEPRINT_BADGES: BlueprintBadge[] = [
  {
    code: "F01",
    title: "Confort digestivo",
    body: "Canela funcional con efecto carminativo. Menos gases, mejor confort.",
    x: 38,
    y: 58,
    side: "left",
  },
  {
    code: "F02",
    title: "Vitalidad",
    body: "Mín. 20% de proteína para energía diaria y mantenimiento muscular.",
    x: 64,
    y: 42,
    side: "right",
  },
  {
    code: "F03",
    title: "Piel y pelaje",
    body: "Aceites, vitaminas y minerales que apoyan un manto brillante.",
    x: 52,
    y: 22,
    side: "right",
  },
  {
    code: "F04",
    title: "Palatabilidad",
    body: "Hidrolizado enzimático de hígado de pollo. Aceptación superior.",
    x: 44,
    y: 78,
    side: "left",
  },
];
