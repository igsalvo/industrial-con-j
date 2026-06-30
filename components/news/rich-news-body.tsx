import type { ReactNode } from "react";

const imageUrlPattern = /^https?:\/\/\S+\.(?:png|jpe?g|webp|gif|svg)(?:\?\S*)?$/i;
const colorPattern = /^(#[0-9a-f]{3}(?:[0-9a-f]{3})?|[a-z]+)$/i;

function isSafeHref(value: string) {
  return value.startsWith("/") || /^https?:\/\//i.test(value);
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let index = 0;
  const tokenPattern = /(\*\*[^*]+\*\*|\[color=([^\]]+)\][\s\S]+?\[\/color\]|\[[^\]]+\]\([^)]+\))/g;

  for (const match of text.matchAll(tokenPattern)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > index) {
      nodes.push(text.slice(index, matchIndex));
    }

    const token = match[0];
    const nodeKey = `${keyPrefix}-${matchIndex}`;

    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(<strong key={nodeKey} className="font-black text-[color:var(--foreground)]">{renderInline(token.slice(2, -2), `${nodeKey}-bold`)}</strong>);
    } else if (token.startsWith("[color=")) {
      const colorMatch = token.match(/^\[color=([^\]]+)\]([\s\S]+)\[\/color\]$/);
      const color = colorMatch?.[1]?.trim() || "";
      const content = colorMatch?.[2] || "";
      nodes.push(
        <span key={nodeKey} style={colorPattern.test(color) ? { color } : undefined}>
          {renderInline(content, `${nodeKey}-color`)}
        </span>
      );
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const label = linkMatch?.[1] || "";
      const href = linkMatch?.[2]?.trim() || "";
      nodes.push(
        isSafeHref(href) ? (
          <a key={nodeKey} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="font-bold text-[color:var(--accent)] underline underline-offset-4">
            {renderInline(label, `${nodeKey}-link`)}
          </a>
        ) : (
          label
        )
      );
    }

    index = matchIndex + token.length;
  }

  if (index < text.length) {
    nodes.push(text.slice(index));
  }

  return nodes;
}

export function RichNewsBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className="mt-8 space-y-6 text-base leading-8 text-[color:var(--muted)]">
      {blocks.map((block, index) => {
        if (imageUrlPattern.test(block)) {
          return (
            <figure key={`${block}-${index}`} className="overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)]">
              <img src={block} alt="" className="aspect-video w-full object-cover" />
            </figure>
          );
        }

        if (block.startsWith("### ")) {
          return <h3 key={`${block}-${index}`} className="pt-2 text-2xl font-black leading-tight text-[color:var(--accent)]">{renderInline(block.slice(4), `h3-${index}`)}</h3>;
        }

        if (block.startsWith("## ")) {
          return <h2 key={`${block}-${index}`} className="pt-2 text-3xl font-black leading-tight text-[color:var(--accent)]">{renderInline(block.slice(3), `h2-${index}`)}</h2>;
        }

        return <p key={`${block}-${index}`} className="whitespace-pre-line">{renderInline(block, `p-${index}`)}</p>;
      })}
    </div>
  );
}
