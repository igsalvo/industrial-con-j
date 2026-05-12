import { notFound } from "next/navigation";
import { ContactForm } from "@/components/forms/contact-form";
import { BackgroundMediaLoop } from "@/components/media/background-media-loop";
import { getMediaItems, getSiteConfig } from "@/lib/queries";

export default async function DonationsPage() {
  const [config, mediaItems] = await Promise.all([getSiteConfig(), getMediaItems("donations.collage")]);
  if (!config.showDonationsSection) {
    notFound();
  }

  return (
    <section className="dark bg-[#111312] text-white">
      <div className="shell grid gap-6 py-9 lg:grid-cols-[1.06fr_0.98fr] lg:items-stretch">
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <BackgroundMediaLoop
            items={mediaItems}
            title="Tu apoyo impulsa historias en movimiento"
            description="Con tu donación, amplificamos voces, conectamos personas y creamos espacios de aprendizaje que fortalecen a la comunidad de Ingeniería Industrial."
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.18)]">
          <div className="mb-6 flex items-center gap-3">
            <div>
              <p className="pill !border-[color:var(--accent)]/30 !bg-[color:var(--accent-soft)]">Donaciones</p>
              <h1 className="mt-4 text-3xl font-black">{config.donationsContactTitle || "Donaciones y alianzas"}</h1>
            </div>
          </div>
          <p className="mb-6 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
            {config.donationsContactDescription || "Déjanos tus datos y cuéntanos cómo te gustaría colaborar. Nos pondremos en contacto contigo para coordinar los próximos pasos."}
          </p>
          <ContactForm type="DONATION" hideHeader submitLabel={config.donationsContactSubmitLabel || "Quiero apoyar"} className="[&_.btn-primary]:w-full [&_.btn-primary]:justify-between !border-0 !bg-transparent !p-0 !shadow-none" />
        </div>
      </div>
    </section>
  );
}
