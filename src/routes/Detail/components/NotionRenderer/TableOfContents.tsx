import React from "react";
import { ExtendedRecordMap } from "notion-types";

type Props = {
  recordMap: ExtendedRecordMap;
};

const TableOfContents: React.FC<Props> = ({ recordMap }) => {
  if (!recordMap) return null;

  const tocEntries = Object.values(recordMap.block)
    .map((block) => {
      const value = block.value;
      if (value?.type === "header" || value?.type === "sub_header" || value?.type === "sub_sub_header") {
        return {
          id: value.id.replace(/-/g, ""),
          text: value.properties?.title?.[0]?.[0] || "Untitled",
          type: value.type,
        };
      }
      return null;
    })
    .filter(Boolean);

  const getIndentationClass = (type: string) => {
    if (type === "sub_header") return "ml-4"; // one indent
    if (type === "sub_sub_header") return "ml-8"; // two indents
    return "";
  };

  return (
    <nav className="notion-table-of-contents space-y-1">
      {tocEntries.map((entry) => (
        <a
          key={entry?.id}
          href={`#${entry?.id}`}
          className={`block truncate text-sm text-gray-700 hover:text-black ${getIndentationClass(entry?.type ?? "")}`}
          title={entry?.text}
        >
          {entry?.text}
        </a>
      ))}
    </nav>
  );
};

export default TableOfContents;
