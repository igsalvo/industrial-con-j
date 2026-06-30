export const newsFields = [
  { name: "title", label: "Título", required: true },
  { name: "slug", label: "Slug opcional" },
  { name: "excerpt", label: "Bajada / resumen", type: "textarea", required: true },
  { name: "body", label: "Contenido", type: "rich-news", required: true },
  { name: "imageUrl", label: "Imagen opcional", type: "image" },
  { name: "imagePositionX", label: "Encuadre horizontal", type: "select", options: [{ label: "Izquierda", value: "left" }, { label: "Centro", value: "center" }, { label: "Derecha", value: "right" }] },
  { name: "imagePositionY", label: "Encuadre vertical", type: "select", options: [{ label: "Arriba", value: "top" }, { label: "Centro", value: "center" }, { label: "Abajo", value: "bottom" }] },
  { name: "tags", label: "Tags separados por coma" },
  { name: "ctaText", label: "Texto botón" },
  { name: "ctaLink", label: "Link botón", type: "url" },
  { name: "publishedAt", label: "Fecha de publicación", type: "datetime-local" },
  { name: "order", label: "Orden", type: "number" },
  { name: "isPinned", label: "Fijar en loop de noticias", type: "checkbox", defaultChecked: false },
  { name: "placement", label: "Dónde se muestra", type: "select", options: [{ label: "Noticias", value: "NEWS" }, { label: "Noticias Alumni", value: "ALUMNI" }, { label: "Ambas secciones", value: "BOTH" }] },
  { name: "isVisible", label: "Visible", type: "checkbox" }
] as const;
