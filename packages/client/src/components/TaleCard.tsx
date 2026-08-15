import { Link } from "@tanstack/react-router";
import type { TaleCard } from "@/lib/types";

const LANGUAGE_LABELS: Record<string, string> = { en: "English", ru: "Russian" };

export function TaleCard({ tale, locale }: { tale: TaleCard; locale: string }) {
  const title = tale.title;
  const thumb = tale.thumbnailUrl || "https://via.placeholder.com/480x360?text=No+Image";
  return (
    <Link
      to="/$locale/tales/$slug"
      params={{ locale, slug: tale.slug }}
      className="group block"
    >
      <div className="overflow-hidden rounded-lg border">
        <img src={thumb} alt={title} className="h-48 w-full object-cover group-hover:opacity-90" />
        <div className="p-3">
          <h3 className="font-semibold">{title}</h3>
          <div className="mt-1 flex gap-1">
            {tale.availableLanguages.map((lang) => (
              <span
                key={lang}
                title={LANGUAGE_LABELS[lang] ?? lang}
                className="inline-block h-2 w-2 rounded-full bg-yellow-400"
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
