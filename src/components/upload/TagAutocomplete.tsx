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

  function selectTag(tag: string) {
    const previousTags = tokens
      .slice(0, -1)
      .map((previousTag) => previousTag.trim())
      .filter(Boolean);
    onChange([...previousTags, tag].join(", "));
    setIsOpen(false);
  }

  return (
    <div className="tag-autocomplete">
      <label htmlFor={inputId}>{label}</label>
      <input
        aria-autocomplete="list"
        aria-controls={showSuggestions ? listboxId : undefined}
        aria-expanded={showSuggestions}
        autoComplete="off"
        id={inputId}
        name="tags"
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        role="combobox"
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {showSuggestions && (
        <ul className="tag-suggestions" id={listboxId} role="listbox">
          {suggestions.map((tag) => (
            <li
              aria-selected={false}
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