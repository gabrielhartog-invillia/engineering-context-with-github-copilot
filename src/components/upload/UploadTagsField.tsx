"use client";

import { useState } from "react";
import { TagAutocomplete } from "@/components/upload/TagAutocomplete";

type UploadTagsFieldProps = {
  availableTags: readonly string[];
  label: string;
  placeholder?: string;
};

export function UploadTagsField({ availableTags, label, placeholder }: UploadTagsFieldProps) {
  const [value, setValue] = useState("");

  return (
    <TagAutocomplete
      availableTags={availableTags}
      label={label}
      onChange={setValue}
      placeholder={placeholder}
      value={value}
    />
  );
}