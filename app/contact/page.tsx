import { CalendarDays, Instagram, Linkedin, Mail, MessageCircle, Mic2, Play, Sparkles, Users, Youtube } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";

const contactMediaItems = [
  // Replace these src values with uploaded community, podcast, event, and alumni images when available.
  { src: "/logo-podcast.jpg", label: "Podcast", alt: "Persona hablando con micrófono" },
  { src: "/logo-podcast.jpg", label: "Eventos", alt: "Evento o charla de la comunidad" },
  { src: "/logo-podcast.jpg", label: "Comunidad", alt: "Personas conversando" },
  { src: "/logo-podcast.jpg", label: "Conversaciones", alt: "Conversaciones industriales" },
  { src: "/logo-podcast.jpg", label: "Impacto", alt: "Grupo de alumni" }
];

const helpItems = [
  {
    title: "Propuestas de contenido",
    text: "Ideas para el podcast o colaboraciones.",
    icon: Mic2
  },
  {
    title: "Eventos y activaciones",
    text: "Participar, patrocinar o postular una actividad.",
    icon: CalendarDays
  },
  {
    title: "Comunidad",
    text: "Alumni, alianzas o iniciativas conjuntas.",
    icon: Users
  },
  {
    title: "Otros",
    text: "Dudas, sugerencias o comentarios.",
    icon: MessageCircle
  }
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/ingenieriaindustrialuchile/", icon: Instagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/ingenieria-industrial-uchile/posts/?feedView=all", icon: Linkedin },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCIk3G6moIvN8JzMt4p1H5wQ", icon: Youtube },
  { label: "Correo directo", href: "mailto:contacto@industrialconj.com", icon: Mail }
];

export default function ContactPage() {
  return (
    <section className="dark bg-[#202020] text-white">
      <div className="shell grid gap-8 py-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <aside className="contact-story relative overflow-hidden rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.16)] sm:p-5 lg:sticky lg:top-32">
          <div className="pointer-events-none absolute -left-16 top-14 h-52 w-52 rounded-full bg-[color:var(--accent)]/20 blur-3xl" />
          <div className="pointer-events-none absolute right-8 top-10 h-24 w-24 rounded-full border border-dashed border-[color:var(--accent)]/45" />
          <div className="pointer-events-none absolute left-8 top-44 h-28 w-28 rounded-full border border-dashed border-white/15" />

          <div className="relative grid min-h-[460px] grid-cols-6 grid-rows-[1fr_0.8fr_1fr] gap-3 sm:min-h-[540px]">
            {contactMediaItems.map((item, index) => (
              <figure
                key={item.label}
                className={`contact-media-card group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#151515] shadow-[0_18px_50px_rgba(0,0,0,0.24)] ${getMediaCardClass(index)}`}
              >
                <img src={item.src} alt={item.alt} className="h-full w-full object-cover opacity-70 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-90 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" />
                <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {item.label}
                </span>
              </figure>
            ))}

            <div className="absolute left-[48%] top-[41%] z-20 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[color:var(--accent)] text-white shadow-[0_0_38px_rgba(226,33,28,0.35)]">
              <Play size={24} fill="currentColor" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-20 rounded-[1.5rem] border border-white/10 bg-black/45 p-5 text-white backdrop-blur-md">
              <div className="mb-4 flex items-center gap-2">
                {contactMediaItems.map((item, index) => (
                  <span key={item.label} className={`h-1.5 rounded-full bg-white/35 ${index === 0 ? "w-8 bg-[color:var(--accent)]" : "w-3"}`} />
                ))}
              </div>
              <h2 className="max-w-xs text-4xl font-black sm:text-5xl">
                Historias
                <span className="block text-[color:var(--accent)]">en movimiento</span>
              </h2>
              <p className="mt-3 max-w-sm text-sm text-white/75 sm:text-base">Personas, ideas e iniciativas que impulsan a la comunidad industrial.</p>
            </div>
          </div>
        </aside>

        <div className="space-y-7">
          <div className="max-w-2xl">
            <p className="brand-kicker text-sm text-[color:var(--accent)]">CONTÁCTANOS</p>
            <h1 className="mt-4 text-5xl font-black sm:text-6xl">Contáctanos</h1>
            <p className="mt-5 max-w-xl text-lg text-[color:var(--muted)]">
              ¿Tienes una idea, propuesta o quieres ser parte de Industrial con J? Escríbenos y conversemos.
            </p>
          </div>

          <ContactForm showSubject showMotive hideHeader submitLabel="Enviar mensaje" className="shadow-[0_18px_70px_rgba(0,0,0,0.16)]" />

          <section className="space-y-4">
            <h2 className="text-2xl font-black">¿En qué podemos ayudarte?</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {helpItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="card group p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--accent)]/60 hover:shadow-[0_18px_48px_rgba(0,0,0,0.14)]">
                    <div className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                      <Icon size={19} />
                    </div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm text-[color:var(--muted)]">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--accent)] text-white">
                <Sparkles size={19} />
              </div>
              <h2 className="text-xl font-black">Conversemos también por aquí</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a key={link.label} href={link.href} target={link.href.startsWith("mailto:") ? undefined : "_blank"} rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"} className="btn-secondary gap-2 !px-4 !py-2.5 text-sm">
                    <Icon size={16} />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function getMediaCardClass(index: number) {
  const classes = [
    "col-span-4 row-span-2 contact-float-one",
    "col-span-2 row-span-1 contact-float-two",
    "col-span-2 row-span-2 contact-float-three",
    "col-span-3 row-span-1 contact-float-four",
    "col-span-3 row-span-1 contact-float-five"
  ];

  return classes[index] || "";
}
