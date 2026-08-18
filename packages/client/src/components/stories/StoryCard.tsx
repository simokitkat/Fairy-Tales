import { useI18n } from "@/i18n";
import type { TaleListItem } from "@/api/adapters";
import { Card } from "@/components/ui/Card";
import { LanguageChip } from "@/components/ui/LanguageChip";

interface StoryCardProps {
  tale: TaleListItem;
  locale: string;
}

export default function StoryCard({ tale, locale }: StoryCardProps) {
  const { t } = useI18n();

  return (
    <Card className="group overflow-hidden" hoverable>
      <a href={`/${locale}/tales/${tale.slug}`} className="block">
        <div className="aspect-video overflow-hidden bg-cloud">
          <img
            src={
              tale.thumbnailUrl ||
              "https://via.placeholder.com/480x360?text=No+Image"
            }
            alt={t("accessibility.storyCard", { title: tale.title })}
            className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold leading-snug text-ink line-clamp-2">
            {tale.title}
          </h3>
          <div
            className="mt-3 flex flex-wrap gap-1.5"
            aria-label={t("stories.languageChipsLabel")}
          >
            {tale.availableLanguages.map((lang) => (
              <LanguageChip key={lang} language={lang} size="sm" />
            ))}
          </div>
        </div>
      </a>
    </Card>
  );
}
