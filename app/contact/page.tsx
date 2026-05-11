import { CalendarDays, HelpCircle, Instagram, Linkedin, Mail, Mic2, Users, Youtube } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { MediaCollage } from "@/components/media/media-collage";
import { getMediaItems, getSiteConfig } from "@/lib/queries";

const helpItems = [
  { title: "Propuestas de contenido", description: "Ideas para el podcast o colaboraciones.", icon: Mic2 },
  { title: "Eventos y activaciones", description: "Participar, patrocinar o postular tu evento.", icon: CalendarDays },
  { title: "Comunidad", description: "Alumni, alianzas o iniciativas conjuntas.", icon: Users },
  { title: "Otros", description: "Dudas, sugerencias o comentarios.", icon: HelpCircle }
];

const socialItems = [
  { label: "Instagram", href: "https://www.instagram.com/industrialconj", icon: Instagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/industrial-con-j", icon: Linkedin },
  { label: "YouTube", href: "https://www.youtube.com/@industrialconj", icon: Youtube },
  { label: "Correo directo", href: "mailto:hola@industrialconj.cl", icon: Mail }
];

export default async function ContactPage() {
  const [config, mediaItems] = await Promise.all([getSiteConfig(), getMediaItems("contact.collage")]);

  return (
    <section className="dark bg-[#111312] text-white">
      <div className="shell grid gap-8 py-8 sm:py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <MediaCollage
            items={mediaItems}
            title="Historias"
            accent="en movimiento"
            description="Personas, ideas e iniciativas que impulsan a la ingeniería industrial."
            className="!border-0 !bg-transparent !p-0 !shadow-none"
          />
        </div>

        <div className="space-y-7">
          <div className="max-w-2xl">
            <p className="brand-kicker text-sm text-[color:var(--accent)]">{config.contactPageEyebrow || "Contacto"}</p>
            <h1 className="mt-3 text-4xl font-black sm:text-5xl">{config.contactPageTitle || "Contáctanos"}</h1>
            <p className="mt-4 max-w-xl text-sm leading-5 text-[color:var(--muted)]">
              {config.contactPageDescription || "¿Tienes una idea, propuesta o quieres ser parte de Industrial con J? Escríbenos y conversemos."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.2)]">
            <ContactForm showSubject hideHeader submitLabel="Enviar mensaje" className="!border-0 !bg-transparent !p-0 !shadow-none" />
          </div>

          <section>
            <h2 className="text-sm font-bold">¿En qué podemos ayudarte?</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {helpItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <Icon className="text-[color:var(--accent)]" size={20} />
                    <h3 className="mt-4 text-sm font-black leading-tight">{item.title}</h3>
                    <p className="mt-1 text-xs leading-4 text-[color:var(--muted)]">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-sm font-bold">Conversemos también por aquí</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {socialItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-white">
                    <Icon className="text-[color:var(--accent)]" size={18} />
                    {item.label}
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
