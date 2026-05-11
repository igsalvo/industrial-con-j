import { notFound } from "next/navigation";
import { HeartHandshake, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { MediaCollage } from "@/components/media/media-collage";
import { getMediaItems, getSiteConfig } from "@/lib/queries";

export default async function DonationsPage() {
  const [config, mediaItems] = await Promise.all([getSiteConfig(), getMediaItems("donations.collage")]);
  if (!config.showDonationsSection) {
    notFound();
  }

  return (
    <section className="dark bg-[#202020] text-white">
      <div className="shell grid gap-8 py-10 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-6 lg:sticky lg:top-32">
          <MediaCollage
            items={mediaItems}
            title="Historias"
            accent="en movimiento"
            description="Podcast, eventos, comunidad, alumni y alianzas que crecen con apoyo compartido."
          />
          <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-[color:var(--accent)] text-white">
              <Sparkles size={19} />
            </div>
            <h1 className="text-4xl font-black">Tu apoyo impulsa historias en movimiento</h1>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
              Con tu donación, amplificamos voces, conectamos personas y creamos espacios de aprendizaje que fortalecen a la comunidad de Ingeniería Industrial.
            </p>
          </article>
        </div>

        <div className="card p-6 shadow-[0_18px_70px_rgba(0,0,0,0.16)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--accent)] text-white">
              <HeartHandshake size={19} />
            </div>
            <div>
              <p className="pill">Donaciones</p>
              <h2 className="mt-2 text-3xl font-black">Donaciones y alianzas</h2>
            </div>
          </div>
          <p className="mb-6 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
            Déjanos tus datos y cuéntanos cómo te gustaría colaborar. Nos pondremos en contacto contigo para coordinar los próximos pasos.
          </p>
          <ContactForm type="DONATION" hideHeader submitLabel="Quiero apoyar" className="!border-0 !bg-transparent !p-0 !shadow-none" />
        </div>
      </div>
    </section>
  );
}
