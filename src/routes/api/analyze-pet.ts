import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const RequestSchema = z.object({
  image: z
    .string()
    .startsWith("data:image/")
    .max(900_000, "Imagen demasiado grande"),
});

const FocusEnum = z.enum([
  "digestion",
  "energy",
  "skin_coat",
  "palatability",
  "weight",
  "general",
]);

const AnalysisSchema = z.object({
  detected_animal: z.string().min(1).max(40),
  size_guess: z.string().min(1).max(40),
  coat_color: z.string().min(1).max(60),
  coat_length: z.string().min(1).max(40),
  visual_tags: z.array(z.string().min(1).max(40)).max(6),
  short_comment: z.string().min(1).max(280),
  recommended_focus: FocusEnum,
});

export type PetAnalysis = z.infer<typeof AnalysisSchema>;

const FALLBACK: PetAnalysis = {
  detected_animal: "no_identificado",
  size_guess: "desconocido",
  coat_color: "no_identificado",
  coat_length: "desconocido",
  visual_tags: [],
  short_comment:
    "No pudimos analizar la foto ahora mismo. Igual podemos orientarte con la nutrición ideal para tu mascota.",
  recommended_focus: "general",
};

const SYSTEM_PROMPT = `Eres un asistente que describe únicamente rasgos VISIBLES de mascotas en fotos para una marca de alimento premium para perros.

Reglas estrictas:
- Nunca hagas diagnóstico médico ni veterinario.
- Nunca afirmes raza específica salvo confianza muy alta; si dudas, usa categorías generales (ej. "mestizo pequeño", "perro mediano de pelo corto").
- Sé prudente y no categórico ("parece", "se observa").
- "short_comment" debe tener máximo 2 frases breves, en español.
- "visual_tags" máximo 6, palabras cortas en español.
- "recommended_focus" debe ser uno de: digestion, energy, skin_coat, palatability, weight, general.
- Si no puedes identificar al animal, usa detected_animal "no_identificado" y valores "desconocido".
- Devuelve SOLO el JSON pedido.`;

const JSON_SCHEMA = {
  name: "pet_visual_analysis",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      detected_animal: { type: "string" },
      size_guess: { type: "string" },
      coat_color: { type: "string" },
      coat_length: { type: "string" },
      visual_tags: { type: "array", items: { type: "string" } },
      short_comment: { type: "string" },
      recommended_focus: {
        type: "string",
        enum: [
          "digestion",
          "energy",
          "skin_coat",
          "palatability",
          "weight",
          "general",
        ],
      },
    },
    required: [
      "detected_animal",
      "size_guess",
      "coat_color",
      "coat_length",
      "visual_tags",
      "short_comment",
      "recommended_focus",
    ],
  },
} as const;

function jsonResponse(
  body: { ok: true; analysis: PetAnalysis; fallback?: boolean } | { ok: false },
  status = 200,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function fallbackResponse() {
  return jsonResponse({ ok: true, analysis: FALLBACK, fallback: true });
}

// Simple in-memory per-IP rate limiter (best-effort; resets on cold start).
const RATE_LIMIT_MAX = 8; // requests
const RATE_LIMIT_WINDOW_MS = 60_000; // per minute
const ipHits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const source = origin ?? referer;
  if (!source) return false;
  try {
    const url = new URL(source);
    const host = url.hostname;
    return (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".lovable.app") ||
      host.endsWith(".lovableproject.com") ||
      host.endsWith("heroican.com")
    );
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/analyze-pet")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) return fallbackResponse();

        // Same-origin check — blocks scripted calls from third-party origins.
        if (!isAllowedOrigin(request)) {
          return jsonResponse({ ok: false }, 403);
        }

        // Per-IP rate limit — caps worst-case abuse cost.
        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "unknown";
        if (rateLimited(ip)) {
          return jsonResponse({ ok: false }, 429);
        }

        let payload: z.infer<typeof RequestSchema>;
        try {
          const json = await request.json();
          payload = RequestSchema.parse(json);
        } catch {
          return jsonResponse({ ok: false }, 400);
        }


        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12_000);

        try {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              temperature: 0.4,
              max_tokens: 350,
              response_format: {
                type: "json_schema",
                json_schema: JSON_SCHEMA,
              },
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text:
                        "Analiza esta foto y devuelve el JSON con los rasgos visibles de la mascota. Recuerda: sin diagnóstico, sin raza categórica salvo confianza alta, short_comment máximo 2 frases.",
                    },
                    {
                      type: "image_url",
                      image_url: { url: payload.image, detail: "low" },
                    },
                  ],
                },
              ],
            }),
          });

          if (!res.ok) return fallbackResponse();

          const data = (await res.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const content = data?.choices?.[0]?.message?.content;
          if (!content) return fallbackResponse();

          let parsed: unknown;
          try {
            parsed = JSON.parse(content);
          } catch {
            return fallbackResponse();
          }

          const safe = AnalysisSchema.safeParse(parsed);
          if (!safe.success) return fallbackResponse();

          return jsonResponse({ ok: true, analysis: safe.data });
        } catch {
          return fallbackResponse();
        } finally {
          clearTimeout(timeout);
        }
      },
    },
  },
});
