import { useI18n } from "@/i18n";
import { useCurrentLocale } from "@/lib/locale";
import { useTale } from "@/api/queries";
import { sanitizeTaleForClient, selectTaleTranslations } from "@/api/adapters";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { LanguageChip } from "@/components/ui/LanguageChip";
import TaleDetailView from "@/components/tales/TaleDetailView";

export default function TaleDetailPage() {
  // Router params are handled inside TaleDetailView via URL parsing
  return <TaleDetailView />;
}
