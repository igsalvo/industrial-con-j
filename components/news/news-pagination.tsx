import Link from "next/link";

export function NewsPagination({
  basePath,
  page,
  totalPages
}: {
  basePath: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="mt-8 flex flex-wrap items-center gap-2" aria-label="Paginación de noticias">
      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        const href = pageNumber === 1 ? basePath : `${basePath}?page=${pageNumber}`;

        return (
          <Link
            key={pageNumber}
            href={href}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              pageNumber === page
                ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white"
                : "border-[color:var(--line)] text-[color:var(--muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--foreground)]"
            }`}
            aria-current={pageNumber === page ? "page" : undefined}
          >
            Página {pageNumber}
          </Link>
        );
      })}
    </nav>
  );
}
