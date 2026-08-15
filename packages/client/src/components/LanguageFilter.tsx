interface LanguageFilterProps {
  languages: string[];
  selected: string[];
  onChange: (langs: string[]) => void;
}

export function LanguageFilter({ languages, selected, onChange }: LanguageFilterProps) {
  const toggle = (lang: string) => {
    const next = selected.includes(lang)
      ? selected.filter((l) => l !== lang)
      : [...selected, lang];
    onChange(next);
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">Languages</legend>
      {languages.map((lang) => (
        <label key={lang} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected.includes(lang)}
            onChange={() => toggle(lang)}
          />
          <span>{lang.toUpperCase()}</span>
        </label>
      ))}
    </fieldset>
  );
}
