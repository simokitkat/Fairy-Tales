import { useLocation, useNavigate } from "@tanstack/react-router";

const LOCALES = ["en", "ru"] as const;

export function LanguageSwitcher() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const switchTo = (next: (typeof LOCALES)[number]) => {
    const segments = pathname.split("/");
    segments[1] = next;
    navigate({ to: segments.join("/") || "/en" });
  };

  return (
    <div className="flex gap-2">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className="rounded border px-2 py-1 text-sm"
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
