import { useEffect, useState } from "react";
import { Camera, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QrParams } from "@/types/domain";
import heroicanOrbit from "@/assets/heroican-orbit.png.asset.json";

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

      {/* Parallax pattern background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        style={{ transform: `translate3d(0, ${scrollY * 0.25}px, 0)` }}
      >
        <img
          src={heroicanOrbit.url}
          alt=""
          className="w-[140%] max-w-none opacity-20 blur-[1px] select-none"
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:pt-16 sm:pb-24 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>

        <h1 className="font-display text-4xl sm:text-6xl font-semibold leading-[1.02] max-w-3xl">
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 h-12 font-bold"
          >
            <a href="#experiencia-camara">
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
          <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl" aria-hidden />
          <img
            src={heroicanOrbit.url}
            alt="Empaque Heroican con órbitas de beneficios nutricionales"
            className="relative w-full h-auto select-none"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
