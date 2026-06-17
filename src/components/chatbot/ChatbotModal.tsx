import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, MessageCircle, Check } from "lucide-react";
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

type Step = "welcome" | "petName" | "lifeStage" | "breedSize" | "age" | "needs" | "result" | "lead" | "whatsapp";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  qrParams: QrParams;
}

const AGES: AgeRange[] = ["Menos de 1 año", "1 a 7 años", "Más de 7 años", "No estoy seguro"];

export function ChatbotModal({ open, onOpenChange, qrParams }: Props) {
  const [step, setStep] = useState<Step>("welcome");
  const [answers, setAnswers] = useState<SessionAnswers>({});
  const [leadForm, setLeadForm] = useState({
    tutorName: "",
    phone: "",
    city: qrParams.ciudad_url ?? "",
    consentWhatsApp: false,
    consentLocation: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coords, setCoords] = useState<{ lat: number; lng: number } | undefined>();

  const recommended = useMemo(() => {
    if (!answers.lifeStage || !answers.breedSize) return null;
    return recommend(answers.lifeStage, answers.breedSize);
  }, [answers.lifeStage, answers.breedSize]);

  useEffect(() => {
    if (open) {
      track("modal_opened", qrParams);
      setStep("welcome");
    }
  }, [open, qrParams]);

  const goto = (s: Step) => setStep(s);
  const answer = (field: keyof SessionAnswers, value: SessionAnswers[keyof SessionAnswers]) => {
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
    if (!recommended || !answers.lifeStage || !answers.breedSize || !answers.petName) return;

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
    if (!recommended || !answers.petName || !answers.lifeStage || !answers.breedSize) return;
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

  // step viewers
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-lg p-0 gap-0 h-[100svh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden rounded-none sm:rounded-2xl">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4 bg-secondary/40">
          {step !== "welcome" && step !== "whatsapp" && (
            <button
              aria-label="Atrás"
              onClick={() => {
                const order: Step[] = ["welcome", "petName", "lifeStage", "breedSize", "age", "needs", "result", "lead", "whatsapp"];
                const i = order.indexOf(step);
                if (i > 0) goto(order[i - 1]);
              }}
              className="rounded-full p-1 hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-display">
              H
            </span>
            <div>
              <p className="text-sm font-semibold">Asistente Heroican</p>
              <p className="text-xs text-muted-foreground">Recomendación en menos de 1 minuto</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {step === "welcome" && (
            <Bubble>
              Hola, soy el <strong>Asistente Heroican</strong>. Te ayudaré a encontrar una recomendación
              orientativa para tu perro en menos de 1 minuto.
            </Bubble>
          )}

          {step === "petName" && (
            <>
              <Bubble>¿Cómo se llama tu engreído?</Bubble>
              <Input
                autoFocus
                placeholder="Nombre de tu mascota"
                value={answers.petName ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, petName: e.target.value }))}
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
              <p className="text-xs text-muted-foreground">Elige según el tamaño esperado o actual.</p>
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
                        const next = checked ? cur.filter((x) => x !== n) : [...cur, n];
                        answer("needs", next as Need[]);
                      }}
                      className={`text-left rounded-xl border px-4 py-3 transition ${
                        checked
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        <span className="text-sm">{n}</span>
                        {checked && <Check className="h-4 w-4 text-primary" />}
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
                Para {answers.petName} te recomendamos:
              </Bubble>
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
                <p className="font-display text-xl text-primary">{recommended.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {recommended.lifeStage} · {recommended.breedSize}
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {recommended.presentations.map((p) => (
                    <li key={p.sizeKg} className="flex justify-between">
                      <span>
                        <strong>{p.sizeKg} kg</strong> — S/{p.pricePen}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {PRESENTATION_GUIDE[p.sizeKg]}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">
                  Para cambios de alimento, realiza una transición gradual y mantén agua fresca disponible.
                  Si tu mascota tiene síntomas persistentes, consulta con un veterinario.
                </p>
              </div>
            </>
          )}

          {step === "lead" && (
            <>
              <Bubble>Déjanos tus datos para una asesoría personalizada por WhatsApp.</Bubble>
              <div className="space-y-3">
                <Field label="Nombre" error={errors.tutorName}>
                  <Input
                    value={leadForm.tutorName}
                    onChange={(e) => setLeadForm((f) => ({ ...f, tutorName: e.target.value }))}
                    placeholder="Tu nombre"
                  />
                </Field>
                <Field label="WhatsApp" error={errors.phone}>
                  <Input
                    inputMode="tel"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="9XXXXXXXX o +51..."
                  />
                </Field>
                <Field label="Ciudad" error={errors.city}>
                  <Input
                    value={leadForm.city}
                    onChange={(e) => setLeadForm((f) => ({ ...f, city: e.target.value }))}
                    placeholder="Tu ciudad"
                  />
                </Field>
                <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
                  <Checkbox
                    checked={leadForm.consentWhatsApp}
                    onCheckedChange={(v) =>
                      setLeadForm((f) => ({ ...f, consentWhatsApp: v === true }))
                    }
                  />
                  <span className="text-xs">
                    Acepto que Heroican me contacte por WhatsApp para recibir asesoría personalizada.
                  </span>
                </label>
                {errors.consentWhatsApp && (
                  <p className="text-xs text-destructive">{errors.consentWhatsApp}</p>
                )}
                <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
                  <Checkbox
                    checked={leadForm.consentLocation}
                    onCheckedChange={(v) => requestLocation(v === true)}
                  />
                  <span className="text-xs">
                    (Opcional) Acepto compartir mi ubicación aproximada para conocer disponibilidad y demanda por zona.
                  </span>
                </label>
              </div>
            </>
          )}

          {step === "whatsapp" && recommended && (
            <>
              <Bubble>¡Listo! Estamos a un mensaje de distancia.</Bubble>
              <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5 text-sm">
                <p>
                  Te derivaremos al WhatsApp comercial con la información de <strong>{answers.petName}</strong> y
                  la recomendación de <strong>{recommended.name}</strong>.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-border px-5 py-4 bg-card sticky bottom-0">
          <Footer
            step={step}
            answers={answers}
            onStart={startQuiz}
            onNext={(next) => {
              if (next === "lead") {
                track("lead_form_viewed", qrParams);
              }
              if (next === "result") onResultEnter();
              goto(next);
            }}
            onSubmitLead={submitLead}
            onOpenWhatsapp={openWhatsapp}
            consentWhatsApp={leadForm.consentWhatsApp}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Bubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm">{children}</div>
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
          className={`text-left rounded-xl border px-4 py-3 transition ${
            value === o ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"
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
      <Label className="text-xs">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Footer({
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
  if (step === "welcome")
    return (
      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={onStart}>
        Comenzar
      </Button>
    );
  if (step === "petName")
    return (
      <Button
        className="w-full"
        disabled={!answers.petName?.trim()}
        onClick={() => onNext("lifeStage")}
      >
        Continuar
      </Button>
    );
  if (step === "lifeStage")
    return (
      <Button className="w-full" disabled={!answers.lifeStage} onClick={() => onNext("breedSize")}>
        Continuar
      </Button>
    );
  if (step === "breedSize")
    return (
      <Button className="w-full" disabled={!answers.breedSize} onClick={() => onNext("age")}>
        Continuar
      </Button>
    );
  if (step === "age")
    return (
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => onNext("needs")}>
          Omitir
        </Button>
        <Button className="flex-1" disabled={!answers.ageRange} onClick={() => onNext("needs")}>
          Continuar
        </Button>
      </div>
    );
  if (step === "needs")
    return (
      <Button
        className="w-full"
        disabled={!(answers.needs && answers.needs.length > 0)}
        onClick={() => onNext("result")}
      >
        Ver recomendación
      </Button>
    );
  if (step === "result")
    return (
      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => onNext("lead")}>
        Continuar a asesoría
      </Button>
    );
  if (step === "lead")
    return (
      <Button className="w-full" onClick={onSubmitLead}>
        Guardar y continuar
      </Button>
    );
  if (step === "whatsapp")
    return (
      <Button
        className="w-full bg-[#25D366] text-white hover:bg-[#1ebe57]"
        disabled={!consentWhatsApp}
        onClick={onOpenWhatsapp}
      >
        <MessageCircle className="mr-2 h-5 w-5" /> Hablar con un asesor por WhatsApp
      </Button>
    );
  return null;
}
