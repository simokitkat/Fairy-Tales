import type { TaleCard } from "@/lib/types";
import { TaleCard as TaleCardComp } from "@/components/TaleCard";

export function TaleGrid({
  tales,
  loading,
  locale,
}: {
  tales: TaleCard[];
  loading: boolean;
  locale: string;
}) {
  if (loading) {
    return <div className="text-sm text-gray-500">Loading stories…</div>;
  }
  if (tales.length === 0) {
    return <div className="text-sm text-gray-500">No stories found.</div>;
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {tales.map((tale) => (
        <TaleCardComp key={tale.slug} tale={tale} locale={locale} />
      ))}
    </div>
  );
}
