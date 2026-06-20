import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FOCUS_COPY, type PetAnalysis } from "@/lib/petAnalysis";

interface Props {
  analysis: PetAnalysis;
  fallback: boolean;
  onWhatsapp: () => void;
}

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function PetInsightCard({ analysis, fallback, onWhatsapp }: Props) {
  const focus = FOCUS_COPY[analysis.recommended_focus] ?? FOCUS_COPY.general;

  const chips = [
    analysis.detected_animal,
    analysis.size_guess,
    analysis.coat_color,
    analysis.coat_length,
  ]
    .filter((v) => v && v !== "desconocido" && v !== "no_identificado")
    .map(capitalize);

  return (
    <div className="hud-panel rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </span>
        <p className="font-display text-base leading-tight">
          {fallback ? "Orientación general" : "Lo que observamos en tu mascota"}
        </p>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="text-[11px] font-bold text-foreground bg-card/80 border border-border rounded-full px-2.5 py-1"
            >
              {c}
            </span>
          ))}
        </div>
      )}

      {analysis.visual_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {analysis.visual_tags.slice(0, 6).map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="text-[10px] text-primary bg-primary/10 rounded-full px-2 py-0.5"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-foreground leading-snug">{analysis.short_comment}</p>

      <div className="rounded-xl bg-primary/5 border border-primary/15 p-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
          {focus.label}
        </p>
        <p className="mt-1 text-sm text-foreground/90 leading-snug">
          {focus.recommendation}
        </p>
      </div>

      <Button
        onClick={onWhatsapp}
        className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-11"
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        Recibir recomendación por WhatsApp
      </Button>

      <p className="text-[10px] text-muted-foreground text-center">
        Orientación informativa basada en rasgos visibles. No reemplaza la
        evaluación de un veterinario.
      </p>
    </div>
  );
}
