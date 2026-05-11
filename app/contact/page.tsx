import { Lightbulb, Mic2, MessageCircle, Users } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { MediaCollage } from "@/components/media/media-collage";
import { getMediaItems, getSiteConfig } from "@/lib/queries";

const participationItems = [
  { title: "Ideas para episodios", icon: Lightbulb },
  { title: "Invitados/as sugeridos", icon: Mic2 },
  { title: "Comentarios para la comunidad", icon: MessageCircle }
];

export default async function ContactPage() {
  const [config, mediaItems] = await Promise.all([getSiteConfig(), getMediaItems("contact.collage")]);

  return (
    <section className="dark bg-[#202020] text-white">
      <div className="shell grid gap-8 py-10 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-6 lg:sticky lg:top-32">
          <MediaCollage
            items={mediaItems}
            title="Tu voz también"
            accent="es parte"
            description="Cada mensaje, idea o sugerencia nos ayuda a crear mejores conversaciones."
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {participationItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                    <Icon size={18} />
                  </div>
                  <h2 className="text-base font-bold leading-tight">{item.title}</h2>
                </article>
              );
            })}
          </div>
        </div>

        <div className="space-y-7">
          <div className="max-w-2xl">
            <p className="brand-kicker text-sm text-[color:var(--accent)]">{config.contactPageEyebrow || "Contacto"}</p>
            <h1 className="mt-4 text-5xl font-black sm:text-6xl">Queremos escucharte</h1>
            <p className="mt-5 max-w-xl text-lg text-[color:var(--muted)]">
              Déjanos tu comentario, idea o propuesta. Nos pondremos en contacto contigo si necesitamos más información o si podemos avanzar juntos.
            </p>
          </div>

          <div className="card p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--accent)] text-white">
                <Users size={19} />
              </div>
              <div>
                <p className="pill">Comunidad</p>
                <h2 className="mt-2 text-2xl font-black">Tu voz también es parte de Industrial con J</h2>
              </div>
            </div>
            <ContactForm showMotive hideHeader submitLabel="Enviar mensaje" className="!border-0 !bg-transparent !p-0 !shadow-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
