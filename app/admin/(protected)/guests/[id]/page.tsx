import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GuestForm } from "@/components/admin/guest-form";

export default async function EditGuestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guest = await prisma.guest.findUnique({ where: { id } });

  if (!guest) {
    notFound();
  }

  return (
    <div className="card p-8">
      <h2 className="text-3xl font-black">Editar invitado</h2>
      <div className="mt-6">
        <GuestForm mode="edit" guest={guest} />
      </div>
    </div>
  );
}
