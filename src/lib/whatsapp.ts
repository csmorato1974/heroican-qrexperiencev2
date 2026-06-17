export const WA_NUMBER = "59161212107";

export interface WaTemplateVars {
  petName: string;
  lifeStage: string;
  breedSize: string;
  recommendedProduct: string;
  leadName: string;
  city: string;
}

export function buildWhatsappUrl(vars: WaTemplateVars): string {
  const msg = `Hola Heroican, escaneé el QR y quiero asesoría personalizada. Mi mascota es ${vars.petName}, etapa ${vars.lifeStage}, tamaño ${vars.breedSize}. Me recomendaron ${vars.recommendedProduct}. Soy ${vars.leadName} de ${vars.city}.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}
