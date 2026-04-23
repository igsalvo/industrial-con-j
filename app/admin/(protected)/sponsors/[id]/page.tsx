import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SponsorForm } from "@/components/admin/sponsor-form";

export default async function EditSponsorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sponsor = await prisma.sponsor.findUnique({ where: { id } });

  if (!sponsor) {
    notFound();
  }

  return (
    <div className="card p-8">
      <h2 className="text-3xl font-black">Editar sponsor</h2>
      <div className="mt-6">
        <SponsorForm mode="edit" sponsor={sponsor} />
      </div>
    </div>
  );
}
