import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Benefits } from "@/components/Benefits";
import { ARPreview } from "@/components/ARPreview";
import { ProductsMatrix } from "@/components/ProductsMatrix";
import { Footer } from "@/components/Footer";
import { ChatbotModal } from "@/components/chatbot/ChatbotModal";
import { parseQrParams } from "@/lib/qrParams";
import { track } from "@/lib/tracker";
import { WA_NUMBER } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heroican · Diagnóstico nutricional para tu perro" },
      {
        name: "description",
        content:
          "Escanea, responde unas preguntas y recibe una recomendación Heroican según la etapa y tamaño de tu perro.",
      },
      { property: "og:title", content: "Heroican · Diagnóstico nutricional para tu perro" },
      {
        property: "og:description",
        content: "Experiencia desde el empaque. Asistencia por WhatsApp.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [open, setOpen] = useState(false);
  const qrParams = useMemo(() => {
    if (typeof window === "undefined") return {};
    return parseQrParams(window.location.search);
  }, []);

  useEffect(() => {
    track("qr_landing_loaded", qrParams);
  }, [qrParams]);

  return (
    <main className="min-h-screen">
      <Hero
        onStart={() => setOpen(true)}
        onWhatsapp={() => {
          track("whatsapp_clicked", qrParams, { source: "hero" });
          window.open(
            `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
              "Hola Heroican, quiero asesoría sobre los productos.",
            )}`,
            "_blank",
            "noopener",
          );
        }}
      />
      <HowItWorks />
      <Benefits />
      <ARPreview qrParams={qrParams} />
      <ProductsMatrix />
      <Footer />
      <ChatbotModal open={open} onOpenChange={setOpen} qrParams={qrParams} />
    </main>
  );
}
