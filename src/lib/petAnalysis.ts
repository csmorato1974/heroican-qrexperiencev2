export type PetFocus =
  | "digestion"
  | "energy"
  | "skin_coat"
  | "palatability"
  | "weight"
  | "general";

export interface PetAnalysis {
  detected_animal: string;
  size_guess: string;
  coat_color: string;
  coat_length: string;
  visual_tags: string[];
  short_comment: string;
  recommended_focus: PetFocus;
}

export interface PetAnalysisResult {
  analysis: PetAnalysis;
  fallback: boolean;
}

export const FALLBACK_ANALYSIS: PetAnalysis = {
  detected_animal: "no_identificado",
  size_guess: "desconocido",
  coat_color: "no_identificado",
  coat_length: "desconocido",
  visual_tags: [],
  short_comment:
    "No pudimos analizar la foto ahora mismo. Igual podemos orientarte con la nutrición ideal para tu mascota.",
  recommended_focus: "general",
};

const MAX_SIDE = 768;
const JPEG_QUALITY = 0.78;

async function rescaleImage(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
      const w = Math.max(1, Math.round(width * scale));
      const h = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export async function analyzePet(photoDataUrl: string): Promise<PetAnalysisResult> {
  const image = await rescaleImage(photoDataUrl);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch("/api/analyze-pet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
      signal: controller.signal,
    });
    if (!res.ok) return { analysis: FALLBACK_ANALYSIS, fallback: true };
    const data = (await res.json()) as
      | { ok: true; analysis: PetAnalysis; fallback?: boolean }
      | { ok: false };
    if (!("ok" in data) || !data.ok) {
      return { analysis: FALLBACK_ANALYSIS, fallback: true };
    }
    return { analysis: data.analysis, fallback: Boolean(data.fallback) };
  } catch {
    return { analysis: FALLBACK_ANALYSIS, fallback: true };
  } finally {
    clearTimeout(timeout);
  }
}

export const FOCUS_COPY: Record<PetFocus, { label: string; recommendation: string }> = {
  digestion: {
    label: "Confort digestivo",
    recommendation:
      "Una fórmula Heroican enfocada en digestión suave puede ser una buena opción a considerar.",
  },
  energy: {
    label: "Vitalidad y energía",
    recommendation:
      "Heroican con proteína de calidad puede ayudar a sostener su energía día a día.",
  },
  skin_coat: {
    label: "Piel y pelaje",
    recommendation:
      "Una receta Heroican rica en ácidos grasos puede acompañar el cuidado de su pelaje.",
  },
  palatability: {
    label: "Palatabilidad",
    recommendation:
      "Te podemos recomendar una receta Heroican especialmente sabrosa para perros exigentes.",
  },
  weight: {
    label: "Peso saludable",
    recommendation:
      "Hay opciones Heroican pensadas para acompañar un peso saludable; te orientamos por WhatsApp.",
  },
  general: {
    label: "Bienestar integral",
    recommendation:
      "Te ayudamos a elegir la receta Heroican que mejor acompañe su bienestar día a día.",
  },
};
