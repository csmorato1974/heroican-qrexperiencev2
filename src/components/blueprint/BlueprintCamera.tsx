import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Download, MessageCircle, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { track } from "@/lib/tracker";
import { BLUEPRINT_BADGES, type BlueprintBadge } from "./badges";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import type { QrParams } from "@/types/domain";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  qrParams: QrParams;
}

export function BlueprintCamera({ open, onOpenChange, qrParams }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [activeBadge, setActiveBadge] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      track("blueprint_photo_captured", qrParams, { size: file.size });
    };
    reader.readAsDataURL(file);
  }

  function reset() {
    setPhoto(null);
    setActiveBadge(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function buildAnnotatedBlob(): Promise<Blob | null> {
    if (!photo) return null;
    const img = new Image();
    img.src = photo;
    await new Promise((r) => (img.onload = r));
    const W = img.naturalWidth;
    const H = img.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const scale = W / 560;
    BLUEPRINT_BADGES.forEach((b) => {
      const px = (b.x / 100) * W;
      const py = (b.y / 100) * H;
      ctx.beginPath();
      ctx.arc(px, py, 16 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(193, 116, 60, 0.35)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, 8 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "#c1743c";
      ctx.fill();
      ctx.font = `bold ${14 * scale}px Nunito, system-ui, sans-serif`;
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "rgba(40,20,10,0.6)";
      ctx.lineWidth = 3 * scale;
      const label = `${b.code} · ${b.title}`;
      ctx.strokeText(label, px + 20 * scale, py + 5 * scale);
      ctx.fillText(label, px + 20 * scale, py + 5 * scale);
    });

    return await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png"),
    );
  }

  function triggerDownload(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "heroican-mi-mascota.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function download() {
    const blob = await buildAnnotatedBlob();
    if (!blob) return;
    triggerDownload(blob);
    track("blueprint_photo_downloaded", qrParams);
  }

  async function sendPhotoViaWhatsapp() {
    if (sending) return;
    setSending(true);
    try {
      const blob = await buildAnnotatedBlob();
      if (!blob) return;
      triggerDownload(blob);

      toast.success("Foto descargada 📸", {
        description:
          "Adjúntala en el chat de WhatsApp que se acaba de abrir (toca el clip 📎 y elige la foto).",
        duration: 8000,
      });

      await new Promise((r) => setTimeout(r, 700));

      const msg =
        "Hola Heroican 👋 Te comparto la foto de mi mascota (adjunta en este chat) para que me ayudes a identificar su raza y darme una recomendación personalizada. ¡Gracias!";
      const url = `https://wa.me/59164280437?text=${encodeURIComponent(msg)}`;
      track("blueprint_share_whatsapp", qrParams, { withPhoto: true });
      window.open(url, "_blank");
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(560px,96vw)] hud-panel p-4 sm:p-6 max-h-[95svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Mira cómo cuidamos a tu engreído&nbsp; 🐶
          </DialogTitle>
        </DialogHeader>

        {!photo ? (
          <div className="mt-4 rounded-2xl p-6 text-center" style={{ background: "var(--gradient-hero)" }}>
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Camera className="h-7 w-7 text-primary" />
            </span>
            <p className="mt-4 font-display text-xl">Toma una foto de tu mascota</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Te mostraremos sobre la imagen los beneficios Heroican que la cuidan.
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFile}
            />
            <Button
              className="mt-5 rounded-full h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              onClick={() => {
                inputRef.current?.click();
                track("blueprint_camera_opened", qrParams);
              }}
            >
              <Camera className="mr-2 h-5 w-5" />
              Tomar foto
            </Button>
            <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              La foto no sale de tu dispositivo
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="relative w-full rounded-2xl overflow-hidden border border-border" style={{ aspectRatio: "3 / 4", background: "#000" }}>
              <img
                ref={imgRef}
                src={photo}
                alt="Mi mascota"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {BLUEPRINT_BADGES.map((b) => (
                <Hotspot
                  key={b.code}
                  badge={b}
                  active={activeBadge === b.code}
                  onToggle={() => setActiveBadge((a) => (a === b.code ? null : b.code))}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {BLUEPRINT_BADGES.map((b) => (
                <button
                  key={b.code}
                  onClick={() => setActiveBadge(b.code)}
                  className={`hud-panel rounded-2xl p-3 text-left transition ${
                    activeBadge === b.code ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary">{b.code}</span>
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p className="mt-1 font-display text-sm leading-tight">{b.title}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-snug">{b.body}</p>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
                className="rounded-full font-bold"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Repetir
              </Button>
              <Button
                size="sm"
                onClick={download}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Descargar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={sendPhotoViaWhatsapp}
                disabled={sending}
                className="rounded-full font-bold ml-auto"
              >
                {sending ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                )}
                Enviar por WhatsApp
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Hotspot({
  badge,
  active,
  onToggle,
}: {
  badge: BlueprintBadge;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${badge.x}%`, top: `${badge.y}%` }}
      aria-label={badge.title}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-primary/40 pulse-glow" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-primary border-2 border-white" />
      </span>
      <span
        className={`absolute top-1/2 -translate-y-1/2 ${
          badge.side === "right" ? "left-6" : "right-6"
        } whitespace-nowrap text-[10px] font-bold text-foreground bg-card/95 backdrop-blur px-2 py-1 rounded-full border border-border shadow-sm ${
          active ? "opacity-100" : "opacity-95 group-hover:opacity-100"
        }`}
      >
        {badge.title}
      </span>
    </button>
  );
}
