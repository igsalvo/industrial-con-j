import { ContactForm } from "@/components/forms/contact-form";
import { BackgroundMediaLoop } from "@/components/media/background-media-loop";
import { getMediaItems, getSiteConfig } from "@/lib/queries";

export default async function ContactPage() {
  const [config, mediaItems] = await Promise.all([getSiteConfig(), getMediaItems("contact.collage")]);

  return (
    <section className="dark bg-[#111312] text-white">
      <div className="shell grid gap-8 py-8 sm:py-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <BackgroundMediaLoop
            items={mediaItems}
            title="Nuestra comunidad en movimiento"
            description="Personas, ideas e iniciativas que impulsan a la ingeniería industrial."
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
        </div>
      </div>
    </section>
  );
}
