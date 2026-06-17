import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, MessageCircle, Check, Minus, ChevronUp } from "lucide-react";
import { recommend, PRESENTATION_GUIDE } from "@/lib/recommendation";
import { track, getSessionId } from "@/lib/tracker";
import { saveLead } from "@/lib/leads";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { leadSchema } from "@/lib/validators";
import {
  NEEDS,
  type AgeRange,
  type BreedSize,
  type LifeStage,
  type Need,
  type QrParams,
  type SessionAnswers,
} from "@/types/domain";

type Step =
  | "welcome"
  | "petName"
  | "lifeStage"
  | "breedSize"
  | "age"
  | "needs"
  | "result"
  | "lead"
  | "whatsapp";

interface Props {
  qrParams: QrParams;
}

const AGES: AgeRange[] = [
  "Menos de 1 año",
  "1 a 7 años",
  "Más de 7 años",
  "No estoy seguro",
];

const ORDER: Step[] = [
  "welcome",
  "petName",
  "lifeStage",
  "breedSize",
  "age",
  "needs",
  "result",
  "lead",
  "whatsapp",
];

const SESSION_KEY = "heroican.session";
const MINIMIZED_KEY = "heroican.panel.minimized";

interface Persisted {
  step: Step;
  answers: SessionAnswers;
  leadForm: {
    tutorName: string;
    phone: string;
    city: string;
    consentWhatsApp: boolean;
    consentLocation: boolean;
  };
}

function loadPersisted(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
}

export function ChatbotPanel({ qrParams }: Props) {
  const persisted = useMemo(() => loadPersisted(), []);
  const [step, setStep] = useState<Step>(persisted?.step ?? "welcome");
  const [answers, setAnswers] = useState<SessionAnswers>(persisted?.answers ?? {});
  const [leadForm, setLeadForm] = useState(
    persisted?.leadForm ?? {
      tutorName: "",
      phone: "",
      city: qrParams.ciudad_url ?? "",
      consentWhatsApp: false,
      consentLocation: false,
    },
  );
  const [minimized, setMinimized] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coords, setCoords] = useState<{ lat: number; lng: number } | undefined>();

  const recommended = useMemo(() => {
    if (!answers.lifeStage || !answers.breedSize) return null;
    return recommend(answers.lifeStage, answers.breedSize);
  }, [answers.lifeStage, answers.breedSize]);

  // Persist
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ step, answers, leadForm }),
    );
  }, [step, answers, leadForm]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMinimized(window.localStorage.getItem(MINIMIZED_KEY) === "1");
    track("landing_panel_mounted", qrParams);
  }, [qrParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(MINIMIZED_KEY, minimized ? "1" : "0");
  }, [minimized]);

  const goto = (s: Step) => setStep(s);
  const answer = (
    field: keyof SessionAnswers,
    value: SessionAnswers[keyof SessionAnswers],
  ) => {
    setAnswers((a) => ({ ...a, [field]: value }));
    track("question_answered", qrParams, { field, value });
  };

  const startQuiz = () => {
    track("quiz_started", qrParams);
    goto("petName");
  };

  const onResultEnter = () => {
    if (recommended) {
      track("recommendation_generated", qrParams, { product: recommended.id });
    }
  };

  const submitLead = () => {
    const parsed = leadSchema.safeParse(leadForm);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        e[i.path[0] as string] = i.message;
      });
      setErrors(e);
      return;
    }
    setErrors({});
    if (!recommended || !answers.lifeStage || !answers.breedSize || !answers.petName)
      return;

    const leadId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    saveLead({
      id: leadId,
      sessionId: getSessionId(),
      tutorName: leadForm.tutorName.trim(),
      phone: leadForm.phone.trim(),
      city: leadForm.city.trim(),
      petName: answers.petName,
      lifeStage: answers.lifeStage,
      breedSize: answers.breedSize,
      ageRange: answers.ageRange,
      needs: answers.needs ?? [],
      recommendedProduct: recommended.name,
      consentWhatsApp: true,
      consentLocation: !!leadForm.consentLocation,
      locationLat: coords?.lat,
      locationLng: coords?.lng,
      createdAt: new Date().toISOString(),
      qrParams,
    });
    track("lead_submitted", qrParams, { product: recommended.id });
    goto("whatsapp");
  };

  const requestLocation = (checked: boolean) => {
    setLeadForm((f) => ({ ...f, consentLocation: checked }));
    if (!checked) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    track("geolocation_requested", qrParams);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        track("geolocation_granted", qrParams);
      },
      () => track("geolocation_denied", qrParams),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  const openWhatsapp = () => {
    if (!recommended || !answers.petName || !answers.lifeStage || !answers.breedSize)
      return;
    const url = buildWhatsappUrl({
      petName: answers.petName,
      lifeStage: answers.lifeStage,
      breedSize: answers.breedSize,
      recommendedProduct: recommended.name,
      leadName: leadForm.tutorName,
      city: leadForm.city,
    });
    track("whatsapp_clicked", qrParams, { product: recommended.id });
    track("session_completed", qrParams);
    window.open(url, "_blank", "noopener");
  };

  const progressIndex = ORDER.indexOf(step);
  const progressPct = Math.round((progressIndex / (ORDER.length - 1)) * 100);

  // ===== Minimized bar =====
  if (minimized) {
    return (
      <button
        onClick={() => {
          setMinimized(false);
          track("panel_restored", qrParams);
        }}
        className="hud-panel fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[360px] z-50 rounded-md px-4 py-3 flex items-center gap-3 group"
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-display pulse-glow">
          H
        </span>
        <span className="flex-1 text-left">
          <span className="block font-mono text-[10px] tracking-[0.2em] text-accent">
            ASISTENTE · STANDBY
          </span>
          <span className="block text-xs text-muted-foreground truncate">
            Reanudar misión ({progressPct}%)
          </span>
        </span>
        <ChevronUp className="h-4 w-4 text-accent group-hover:-translate-y-0.5 transition-transform" />
      </button>
    );
  }

  // ===== Full panel =====
  return (
    <aside
      className="hud-panel scanline fixed z-40 flex flex-col overflow-hidden
        inset-x-2 bottom-2 top-auto h-[78svh] rounded-lg
        sm:inset-x-auto sm:right-4 sm:bottom-4 sm:top-24 sm:w-[420px] sm:h-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 bg-secondary/50">
        {step !== "welcome" && step !== "whatsapp" && (
          <button
            aria-label="Atrás"
            onClick={() => {
              const i = ORDER.indexOf(step);
              if (i > 0) goto(ORDER[i - 1]);
            }}
            className="rounded p-1 hover:bg-muted text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground font-display pulse-glow">
          H
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] tracking-[0.2em] text-accent">
            ASISTENTE · ONLINE
          </p>
          <p className="text-xs text-muted-foreground truncate">
            Misión 01 — Diagnóstico
          </p>
        </div>
        <button
          aria-label="Minimizar panel"
          onClick={() => {
            setMinimized(true);
            track("panel_minimized", qrParams);
          }}
          className="rounded p-1.5 hover:bg-muted text-muted-foreground"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-border">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${progressPct}%`, boxShadow: "var(--shadow-glow)" }}
        />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {step === "welcome" && (
          <Bubble>
            <span className="font-mono text-[10px] tracking-[0.18em] text-accent block mb-2">
              [ INIT_SEQUENCE ]
            </span>
            Hola, soy tu <strong className="text-accent">Asistente Heroican</strong>.
            Te guío en una secuencia rápida para recomendar el alimento ideal para
            tu engreído.
          </Bubble>
        )}

        {step === "petName" && (
          <>
            <Bubble>¿Cómo se llama tu engreído?</Bubble>
            <Input
              autoFocus
              placeholder="Nombre de tu mascota"
              value={answers.petName ?? ""}
              onChange={(e) =>
                setAnswers((a) => ({ ...a, petName: e.target.value }))
              }
            />
          </>
        )}

        {step === "lifeStage" && (
          <>
            <Bubble>¿En qué etapa está {answers.petName ?? "tu mascota"}?</Bubble>
            <OptionGrid
              options={["Cachorro", "Adulto"]}
              value={answers.lifeStage}
              onSelect={(v) => answer("lifeStage", v as LifeStage)}
            />
          </>
        )}

        {step === "breedSize" && (
          <>
            <Bubble>¿Qué tamaño de raza tiene?</Bubble>
            <OptionGrid
              options={["Raza pequeña", "Raza grande"]}
              value={answers.breedSize}
              onSelect={(v) => answer("breedSize", v as BreedSize)}
            />
          </>
        )}

        {step === "age" && (
          <>
            <Bubble>¿Qué edad tiene? (opcional)</Bubble>
            <OptionGrid
              options={AGES as unknown as string[]}
              value={answers.ageRange}
              onSelect={(v) => answer("ageRange", v as AgeRange)}
            />
          </>
        )}

        {step === "needs" && (
          <>
            <Bubble>¿Cuál es tu necesidad principal? Puedes elegir varias.</Bubble>
            <div className="grid gap-2">
              {NEEDS.map((n) => {
                const checked = answers.needs?.includes(n) ?? false;
                return (
                  <button
                    key={n}
                    onClick={() => {
                      const cur = answers.needs ?? [];
                      const next = checked
                        ? cur.filter((x) => x !== n)
                        : [...cur, n];
                      answer("needs", next as Need[]);
                    }}
                    className={`text-left rounded-md border px-3 py-2.5 transition text-sm ${
                      checked
                        ? "border-accent bg-accent/10 text-foreground"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span>{n}</span>
                      {checked && <Check className="h-4 w-4 text-accent" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === "result" && recommended && (
          <>
            <Bubble>
              <span className="font-mono text-[10px] tracking-[0.18em] text-accent block mb-2">
                [ MATCH_FOUND ]
              </span>
              Para <strong>{answers.petName}</strong> el loadout óptimo es:
            </Bubble>
            <div className="hud-panel corner-frame rounded-md p-4">
              <p className="font-display text-lg text-accent">
                {recommended.name}
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-cyan">
                {recommended.lifeStage} · {recommended.breedSize}
              </p>
              <ul className="mt-4 space-y-2 text-sm font-mono">
                {recommended.presentations.map((p) => (
                  <li
                    key={p.sizeKg}
                    className="flex justify-between border-b border-dashed border-border/60 pb-1"
                  >
                    <span>
                      <strong className="text-accent">{p.sizeKg} KG</strong>{" "}
                      <span className="text-muted-foreground">
                        — S/ {p.pricePen}
                      </span>
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {PRESENTATION_GUIDE[p.sizeKg]}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Transición gradual. Agua fresca disponible. Si hay síntomas
                persistentes, consulta a un veterinario.
              </p>
            </div>
          </>
        )}

        {step === "lead" && (
          <>
            <Bubble>Déjanos tus datos para asesoría por WhatsApp.</Bubble>
            <div className="space-y-3">
              <Field label="Nombre" error={errors.tutorName}>
                <Input
                  value={leadForm.tutorName}
                  onChange={(e) =>
                    setLeadForm((f) => ({ ...f, tutorName: e.target.value }))
                  }
                  placeholder="Tu nombre"
                />
              </Field>
              <Field label="WhatsApp" error={errors.phone}>
                <Input
                  inputMode="tel"
                  value={leadForm.phone}
                  onChange={(e) =>
                    setLeadForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="9XXXXXXXX o +51..."
                />
              </Field>
              <Field label="Ciudad" error={errors.city}>
                <Input
                  value={leadForm.city}
                  onChange={(e) =>
                    setLeadForm((f) => ({ ...f, city: e.target.value }))
                  }
                  placeholder="Tu ciudad"
                />
              </Field>
              <label className="flex items-start gap-3 rounded-md border border-border bg-card p-3">
                <Checkbox
                  checked={leadForm.consentWhatsApp}
                  onCheckedChange={(v) =>
                    setLeadForm((f) => ({ ...f, consentWhatsApp: v === true }))
                  }
                />
                <span className="text-xs">
                  Acepto que Heroican me contacte por WhatsApp.
                </span>
              </label>
              {errors.consentWhatsApp && (
                <p className="text-xs text-destructive">
                  {errors.consentWhatsApp}
                </p>
              )}
              <label className="flex items-start gap-3 rounded-md border border-border bg-card p-3">
                <Checkbox
                  checked={leadForm.consentLocation}
                  onCheckedChange={(v) => requestLocation(v === true)}
                />
                <span className="text-xs">
                  (Opcional) Compartir mi ubicación aproximada para mapas de
                  demanda.
                </span>
              </label>
            </div>
          </>
        )}

        {step === "whatsapp" && recommended && (
          <>
            <Bubble>
              <span className="font-mono text-[10px] tracking-[0.18em] text-accent block mb-2">
                [ MISSION_COMPLETE ]
              </span>
              Misión completada. A un mensaje de distancia.
            </Bubble>
            <div className="hud-panel rounded-md p-4 text-sm">
              Te derivaremos al WhatsApp comercial con la información de{" "}
              <strong>{answers.petName}</strong> y la recomendación de{" "}
              <strong className="text-accent">{recommended.name}</strong>.
            </div>
          </>
        )}
      </div>

      {/* Footer actions */}
      <div className="border-t border-border px-4 py-3 bg-card">
        <FooterActions
          step={step}
          answers={answers}
          onStart={startQuiz}
          onNext={(next) => {
            if (next === "lead") track("lead_form_viewed", qrParams);
            if (next === "result") onResultEnter();
            goto(next);
          }}
          onSubmitLead={submitLead}
          onOpenWhatsapp={openWhatsapp}
          consentWhatsApp={leadForm.consentWhatsApp}
        />
      </div>
    </aside>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[92%] rounded-md rounded-tl-sm border border-border bg-muted/60 px-3.5 py-2.5 text-sm">
      {children}
    </div>
  );
}

function OptionGrid({
  options,
  value,
  onSelect,
}: {
  options: string[];
  value: string | undefined;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="grid gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onSelect(o)}
          className={`text-left rounded-md border px-3 py-2.5 transition text-sm ${
            value === o
              ? "border-accent bg-accent/10 text-foreground"
              : "border-border bg-card hover:bg-muted"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function FooterActions({
  step,
  answers,
  onStart,
  onNext,
  onSubmitLead,
  onOpenWhatsapp,
  consentWhatsApp,
}: {
  step: Step;
  answers: SessionAnswers;
  onStart: () => void;
  onNext: (s: Step) => void;
  onSubmitLead: () => void;
  onOpenWhatsapp: () => void;
  consentWhatsApp: boolean;
}) {
  const cta =
    "w-full font-mono uppercase tracking-[0.18em] text-xs bg-accent text-accent-foreground hover:bg-accent/90";

  if (step === "welcome")
    return (
      <Button className={cta} onClick={onStart}>
        ▸ Iniciar secuencia
      </Button>
    );
  if (step === "petName")
    return (
      <Button
        className={cta}
        disabled={!answers.petName?.trim()}
        onClick={() => onNext("lifeStage")}
      >
        Continuar ▸
      </Button>
    );
  if (step === "lifeStage")
    return (
      <Button
        className={cta}
        disabled={!answers.lifeStage}
        onClick={() => onNext("breedSize")}
      >
        Continuar ▸
      </Button>
    );
  if (step === "breedSize")
    return (
      <Button
        className={cta}
        disabled={!answers.breedSize}
        onClick={() => onNext("age")}
      >
        Continuar ▸
      </Button>
    );
  if (step === "age")
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 font-mono uppercase tracking-[0.18em] text-xs"
          onClick={() => onNext("needs")}
        >
          Omitir
        </Button>
        <Button
          className={cta + " flex-1"}
          disabled={!answers.ageRange}
          onClick={() => onNext("needs")}
        >
          Continuar ▸
        </Button>
      </div>
    );
  if (step === "needs")
    return (
      <Button
        className={cta}
        disabled={!(answers.needs && answers.needs.length > 0)}
        onClick={() => onNext("result")}
      >
        ▸ Generar recomendación
      </Button>
    );
  if (step === "result")
    return (
      <Button className={cta} onClick={() => onNext("lead")}>
        Continuar a asesoría ▸
      </Button>
    );
  if (step === "lead")
    return (
      <Button className={cta} onClick={onSubmitLead}>
        Guardar y continuar ▸
      </Button>
    );
  if (step === "whatsapp")
    return (
      <Button
        className="w-full bg-[#25D366] text-white hover:bg-[#1ebe57] font-mono uppercase tracking-[0.18em] text-xs"
        disabled={!consentWhatsApp}
        onClick={onOpenWhatsapp}
      >
        <MessageCircle className="mr-2 h-4 w-4" /> Abrir WhatsApp
      </Button>
    );
  return null;
}
