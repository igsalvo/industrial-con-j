import { GuestForm } from "@/components/admin/guest-form";

export default function NewGuestPage() {
  return (
    <div className="card p-8">
      <h2 className="text-3xl font-black">Nuevo invitado</h2>
      <div className="mt-6">
        <GuestForm mode="create" />
      </div>
    </div>
  );
}
