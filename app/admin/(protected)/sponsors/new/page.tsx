import { SponsorForm } from "@/components/admin/sponsor-form";

export default function NewSponsorPage() {
  return (
    <div className="card p-8">
      <h2 className="text-3xl font-black">Nuevo sponsor</h2>
      <div className="mt-6">
        <SponsorForm mode="create" />
      </div>
    </div>
  );
}
