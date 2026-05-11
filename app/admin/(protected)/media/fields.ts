export const mediaSections = [
  { label: "Home hero", value: "home.hero" },
  { label: "Home collage", value: "home.collage" },
  { label: "Contacto collage", value: "contact.collage" },
  { label: "Comunidad collage", value: "community.collage" },
  { label: "Donaciones collage", value: "donations.collage" },
  { label: "Eventos destacado", value: "events.featured" },
  { label: "Tiendita hero", value: "tiendiita.hero" },
  { label: "Podcast visual", value: "podcast.hero" },
  { label: "Invitados visual", value: "guests.hero" },
  { label: "Aliados visual", value: "partners.hero" }
] as const;

export const mediaItemFields = [
  { name: "section", label: "Sección", type: "select", required: true, options: mediaSections },
  { name: "src", label: "Imagen", type: "image", required: true },
  { name: "alt", label: "Texto alternativo", required: true },
  { name: "label", label: "Etiqueta visible opcional" },
  { name: "href", label: "Link opcional", type: "url" },
  {
    name: "positionX",
    label: "Posición horizontal",
    type: "select",
    options: [
      { label: "Izquierda", value: "left" },
      { label: "Centro", value: "center" },
      { label: "Derecha", value: "right" }
    ]
  },
  {
    name: "positionY",
    label: "Posición vertical",
    type: "select",
    options: [
      { label: "Arriba", value: "top" },
      { label: "Centro", value: "center" },
      { label: "Abajo", value: "bottom" }
    ]
  },
  { name: "order", label: "Orden", type: "number" },
  { name: "isFeatured", label: "Destacada", type: "checkbox", defaultChecked: false },
  { name: "isVisible", label: "Visible", type: "checkbox" }
] as const;
