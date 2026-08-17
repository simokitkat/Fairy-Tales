import { useI18n } from "@/i18n";
import type { TaleListItem } from "@/api/adapters";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import StoryCard from "./StoryCard";

interface StoryGridProps {
  tales: TaleListItem[];
  locale: string;
  loading?: boolean;
}

export default function StoryGrid({ tales, locale, loading }: StoryGridProps) {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-border bg-white">
            <Skeleton variant="rectangular" className="aspect-video w-full" />
            <div className="p-4 space-y-3">
              <Skeleton variant="text" className="h-5 w-3/4" />
              <Skeleton variant="text" className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tales.length === 0) {
    return (
      <EmptyState
        title={t("stories.empty")}
        description={t("stories.emptyTryAdjusting")}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tales.map((tale) => (
        <StoryCard key={tale.slug} tale={tale} locale={locale} />
      ))}
    </div>
  );
}
