import { useEffect, useRef, useState } from "react";
import { Camera, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QrParams } from "@/types/domain";
import heroSeq01 from "@/assets/hero-seq-01.png.asset.json";
import heroVideo from "@/assets/hero-video.mp4.asset.json";


interface Props {
  qrParams: QrParams;
}

export function Hero({ qrParams: _qrParams }: Props) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-20"
        style={{ background: "var(--gradient-hero)" }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        style={{ transform: `translate3d(0, ${scrollY * 0.25}px, 0)` }}
      >
        <img
          src={heroSeq01.url}
          alt=""
          className="w-[140%] max-w-none opacity-20 blur-[1px] select-none"
        />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 pt-10 pb-16 sm:pt-16 sm:pb-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.02] font-semibold sm:text-6xl">
            Diagnóstico nutricional para tu{" "}
            <span className="italic text-primary">engreído</span>
            <span className="text-accent">.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-muted-foreground">
            Tu asistente Heroican ya está listo. Responde unas preguntas en el
            panel y recibe la recomendación ideal en menos de 60 segundos.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="h-12 rounded-full bg-primary px-6 font-bold text-primary-foreground hover:bg-primary/90"
            >
              <a href="#foto-mascota">
                <Camera className="mr-2 h-5 w-5" />
                Probar la experiencia con cámara
              </a>
            </Button>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <ChevronsRight className="h-4 w-4 animate-pulse" />
              Toma una foto de tu mascota
            </span>
          </div>
        </div>

        <div
          className="relative"
          style={{ transform: `translate3d(0, ${scrollY * -0.08}px, 0)` }}
        >
          <div
            className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl"
            aria-hidden
          />

          <div
            role="img"
            aria-label="Animación del empaque Heroican"
            className="hero-video-wrap relative mx-auto aspect-[16/9] w-full max-w-[860px]"
          >
            <video
              ref={videoRef}
              src={heroVideo.url}
              poster={heroSeq01.url}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="hero-video absolute inset-0 h-full w-full select-none object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

