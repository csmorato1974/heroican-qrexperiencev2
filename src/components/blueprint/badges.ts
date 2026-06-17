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
    x: 50,
    y: 68,
    side: "right",
  },
  {
    code: "F02",
    title: "Vitalidad",
    body: "Mín. 20% de proteína para energía diaria y mantenimiento muscular.",
    x: 50,
    y: 82,
    side: "left",
  },
  {
    code: "F03",
    title: "Piel y pelaje",
    body: "Aceites, vitaminas y minerales que apoyan un manto brillante.",
    x: 65,
    y: 40,
    side: "right",
  },
  {
    code: "F04",
    title: "Palatabilidad",
    body: "Hidrolizado enzimático de hígado de pollo. Aceptación superior.",
    x: 50,
    y: 22,
    side: "left",
  },
];
