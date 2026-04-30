import Link from "next/link";
import { ContactForm } from "@/components/forms/contact-form";
import { getSiteConfig } from "@/lib/queries";

export default async function DonationsPage() {
  const config = await getSiteConfig();

  return (
    <section className="shell py-12">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card p-8">
          <p className="pill">{config.donationsSectionEyebrow || "Donaciones"}</p>
          <h1 className="mt-4 text-4xl font-black">{config.donationsSectionTitle || "Apoya nuevas conversaciones industriales"}</h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
            {config.donationsSectionDescription || "Deja tus datos para coordinar una donacion, alianza o apoyo al proyecto."}
          </p>
          {config.donationUrl ? (
            <a href={config.donationUrl} target="_blank" rel="noreferrer" className="btn-primary mt-6">
              Ir a donar
            </a>
          ) : (
            <Link href="/community" className="btn-secondary mt-6">
              Ver comunidad
            </Link>
          )}
        </div>

        <ContactForm
          type="DONATION"
          title={config.donationsContactTitle || "Dejar datos para donar"}
          description={config.donationsContactDescription || "Completa el formulario y quedara en la bandeja del administrador para responderte."}
          submitLabel={config.donationsContactSubmitLabel || "Enviar datos"}
        />
      </div>
    </section>
  );
}
