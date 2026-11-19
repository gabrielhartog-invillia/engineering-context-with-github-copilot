import { useId, useState } from "react";

type TagAutocompleteProps = {
  availableTags: readonly string[];
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export function TagAutocomplete({
  availableTags,
  label,
  placeholder,
  value,
  onChange,
}: TagAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const inputId = useId();
  const listboxId = useId();
  const tokens = value.split(",");
  const currentToken = tokens.at(-1)?.trim() ?? "";
  const selectedTags = tokens
    .slice(0, -1)
    .map((tag) => tag.trim().toLocaleLowerCase())
    .filter(Boolean);
  const suggestions = currentToken
    ? availableTags.filter((tag) => {
        const normalizedTag = tag.toLocaleLowerCase();
        return (
          normalizedTag.startsWith(currentToken.toLocaleLowerCase()) &&
          !selectedTags.includes(normalizedTag)
        );
      })
    : [];
  const showSuggestions = isOpen && suggestions.length > 0;
  const activeIndex = showSuggestions && activeTag !== null
    ? suggestions.indexOf(activeTag)
    : -1;

  function closeSuggestions() {
    setIsOpen(false);
    setActiveTag(null);
  }

  function selectTag(tag: string) {
    const previousTags = tokens
      .slice(0, -1)
      .map((previousTag) => previousTag.trim())
      .filter(Boolean);
    onChange([...previousTags, tag].join(", "));
    closeSuggestions();
  }

  return (
    <div className="tag-autocomplete">
      <label htmlFor={inputId}>{label}</label>
      <input
        aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
        aria-autocomplete="list"
        aria-controls={showSuggestions ? listboxId : undefined}
        aria-expanded={showSuggestions}
        autoComplete="off"
        id={inputId}
        name="tags"
        onBlur={closeSuggestions}
        onChange={(event) => {
          onChange(event.target.value);
          setActiveTag(null);
          setIsOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            if (suggestions.length === 0) return;
            event.preventDefault();
            const nextIndex = event.key === "ArrowDown"
              ? (activeIndex + 1) % suggestions.length
              : (activeIndex <= 0 ? suggestions.length : activeIndex) - 1;
            setIsOpen(true);
            setActiveTag(suggestions[nextIndex]);
          } else if (event.key === "Enter" && activeIndex >= 0) {
            event.preventDefault();
            selectTag(suggestions[activeIndex]);
          } else if (event.key === "Escape" || event.key === "Tab") {
            closeSuggestions();
          }
        }}
        role="combobox"
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {showSuggestions && (
        <ul className="tag-suggestions" id={listboxId} role="listbox">
          {suggestions.map((tag, index) => (
            <li
              aria-selected={index === activeIndex}
              className={index === activeIndex ? "bg-[#edf4ef]" : undefined}
              id={`${listboxId}-option-${index}`}
              key={tag}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectTag(tag)}
              role="option"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}