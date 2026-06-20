Cambiar el texto visible del botón de compra en el chatbot de `heroican.pe` a `heroican.com`.

## Archivo a modificar
- `src/components/chatbot/ChatbotPanel.tsx` — Línea 440

## Cambio exacto
```
Comprar en heroican.pe   →   Comprar en heroican.com
```

No se toca ninguna URL real (la prop `href` usa `recommended.storeUrl` que ya apunta a `https://heroican.com/tienda/` según `src/lib/products.ts`). Solo se corrige el texto visible del botón.
