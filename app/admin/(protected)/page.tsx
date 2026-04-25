export default function AdminDashboardPage() {
  return (
    <div className="card max-w-3xl p-8">
      <p className="pill">Admin MVP</p>
      <h1 className="mt-4 text-4xl font-black">Acceso administrativo activo</h1>
      <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
        Este panel ya permite iniciar sesion y proteger rutas internas. El siguiente paso es volver a conectar CRUD, Prisma y formularios de gestion sobre esta base.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--line)] p-5">
          <h2 className="text-xl font-bold">Estado actual</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Login admin activo con JWT y sesion por cookie.</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--line)] p-5">
          <h2 className="text-xl font-bold">Siguiente fase</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Reactivar gestion de episodios, invitados, sponsors y encuestas.</p>
        </div>
      </div>
    </div>
  );
}
