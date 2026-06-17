import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Download, MessageCircle } from "lucide-react";
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

  async function download() {
    if (!photo || !imgRef.current) return;
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

    // Draw badges
    const scale = W / 560;
    BLUEPRINT_BADGES.forEach((b) => {
      const px = (b.x / 100) * W;
      const py = (b.y / 100) * H;
      // hotspot
      ctx.beginPath();
      ctx.arc(px, py, 14 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(245, 180, 60, 0.35)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, 7 * scale, 0, Math.PI * 2);
      ctx.fillStyle = "#f5b43c";
      ctx.fill();
      // label
      ctx.font = `${14 * scale}px "JetBrains Mono", monospace`;
      ctx.fillStyle = "#f5b43c";
      ctx.fillText(`${b.code} · ${b.title.toUpperCase()}`, px + 18 * scale, py + 5 * scale);
    });
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "heroican-blueprint.png";
      a.click();
      URL.revokeObjectURL(url);
      track("blueprint_photo_downloaded", qrParams);
    }, "image/png");
  }

  function shareWhatsapp() {
    const url = buildWhatsappUrl({
      petName: "mi mascota",
      lifeStage: "—",
      breedSize: "—",
      recommendedProduct: "Heroican",
      leadName: "Tutor",
      city: qrParams.ciudad_url ?? "Perú",
    });
    track("blueprint_share_whatsapp", qrParams);
    window.open(url, "_blank");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(560px,96vw)] hud-panel border-accent/30 p-4 sm:p-6 max-h-[95svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase tracking-[0.18em] text-xs text-accent">
            [ BLUEPRINT · CAM_MODE ]
          </DialogTitle>
        </DialogHeader>

        {!photo ? (
          <div className="mt-4 corner-frame scanline rounded-md p-6 text-center" style={{ background: "var(--gradient-hero)" }}>
            <Camera className="h-10 w-10 mx-auto text-accent" />
            <p className="mt-3 font-display text-xl">Escanea a tu mascota</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Toma una foto y revela los beneficios Heroican anclados sobre la imagen.
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
              className="mt-5 bg-accent text-accent-foreground hover:bg-accent/90 font-mono uppercase tracking-[0.18em] text-xs"
              onClick={() => {
                inputRef.current?.click();
                track("blueprint_camera_opened", qrParams);
              }}
            >
              <Camera className="mr-2 h-4 w-4" />
              Tomar foto
            </Button>
            <p className="mt-3 text-[10px] font-mono text-muted-foreground tracking-[0.15em]">
              [ NO_UPLOAD · LA IMAGEN NO SALE DE TU DISPOSITIVO ]
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="relative w-full corner-frame rounded-md overflow-hidden border border-accent/30" style={{ aspectRatio: "3 / 4", background: "#000" }}>
              <img
                ref={imgRef}
                src={photo}
                alt="Mascota escaneada"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 scanline pointer-events-none" />
              {/* Scan corner labels */}
              <span className="absolute top-2 left-2 hud-chip !text-[9px] !py-1 !px-2">SCAN · OK</span>
              <span className="absolute top-2 right-2 hud-chip !text-[9px] !py-1 !px-2 blink">● LIVE</span>

              {BLUEPRINT_BADGES.map((b) => (
                <Hotspot
                  key={b.code}
                  badge={b}
                  active={activeBadge === b.code}
                  onToggle={() => setActiveBadge((a) => (a === b.code ? null : b.code))}
                />
              ))}
            </div>

            {/* Badge details panel */}
            <div className="grid grid-cols-2 gap-2">
              {BLUEPRINT_BADGES.map((b) => (
                <button
                  key={b.code}
                  onClick={() => setActiveBadge(b.code)}
                  className={`hud-panel rounded-md p-3 text-left transition-all ${
                    activeBadge === b.code ? "border-accent neon-glow" : "hover:border-accent/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-cyan">{b.code}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
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
                className="font-mono uppercase tracking-[0.15em] text-[10px] border-accent/40"
              >
                <RotateCcw className="mr-1.5 h-3 w-3" />
                Repetir
              </Button>
              <Button
                size="sm"
                onClick={download}
                className="font-mono uppercase tracking-[0.15em] text-[10px] bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Download className="mr-1.5 h-3 w-3" />
                Descargar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={shareWhatsapp}
                className="font-mono uppercase tracking-[0.15em] text-[10px] border-accent/40 ml-auto"
              >
                <MessageCircle className="mr-1.5 h-3 w-3" />
                WhatsApp
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
      <span className="relative flex h-4 w-4 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-accent/40 pulse-glow" />
        <span className="relative h-2 w-2 rounded-full bg-accent" />
      </span>
      <span
        className={`absolute top-1/2 -translate-y-1/2 ${
          badge.side === "right" ? "left-5" : "right-5"
        } whitespace-nowrap font-mono text-[9px] tracking-[0.18em] uppercase text-accent bg-background/70 backdrop-blur px-1.5 py-0.5 rounded border border-accent/40 ${
          active ? "opacity-100" : "opacity-90 group-hover:opacity-100"
        }`}
      >
        {badge.code}
      </span>
    </button>
  );
}
