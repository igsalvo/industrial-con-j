import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/sections/section-heading";
import { getSiteConfig } from "@/lib/queries";

export default async function ContactPage() {
  const siteConfig = await getSiteConfig();

  return (
    <main className="shell grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
      <SectionHeading
        eyebrow={siteConfig.contactPageEyebrow || "Contacto"}
        title={siteConfig.contactPageTitle || "Contáctanos"}
        description={siteConfig.contactPageDescription || "¿Tienes una idea, propuesta o quieres ser parte? Escríbenos y conversemos."}
      />
      <ContactForm showSubject showMotive />
    </main>
  );
}
