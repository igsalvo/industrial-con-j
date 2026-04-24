import Link from "next/link";
import { clearAdminCookie } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/episodes/new", label: "Nuevo episodio" },
  { href: "/admin/guests/new", label: "Nuevo invitado" },
  { href: "/admin/sponsors/new", label: "Nuevo sponsor" },
  { href: "/admin/surveys/new", label: "Nueva encuesta" }
];

export function AdminShell({
  children,
  email
}: {
  children: React.ReactNode;
  email: string;
}) {
  async function logout() {
    "use server";
    await clearAdminCookie();
  }

  return (
    <div className="shell py-10">
      <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-[color:var(--line)] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="pill">Admin</p>
          <h1 className="mt-4 text-3xl font-black">Panel de gestion</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">{email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {links.map((link: { href: string; label: string }) => (
            <Link key={link.href} href={link.href} className="btn-secondary !px-4 !py-2 text-sm">
              {link.label}
            </Link>
          ))}
          <form action={logout}>
            <button className="btn-primary !px-4 !py-2 text-sm" type="submit">
              Cerrar sesion
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
