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
      if (
        value?.type === "header" ||
        value?.type === "sub_header" ||
        value?.type === "sub_sub_header"
      ) {
        // Fix: flatten title to include emojis and multi-part content
        const rawTitle = value.properties?.title;
        const title = rawTitle?.flat?.().join("") ?? "Untitled";

        return {
          id: value.id.replace(/-/g, ""),
          text: title,
          type: value.type,
        };
      }
      return null;
    })
    .filter(Boolean);

  const getIndentationClass = (type: string) => {
    switch (type) {
      case "sub_header":
        return "ml-4 text-sm";
      case "sub_sub_header":
        return "ml-8 text-xs";
      default:
        return "text-base";
    }
  };

  return (
    <nav className="notion-table-of-contents flex flex-col gap-1">
      {tocEntries.map((entry) => {
        const { id, text, type = "" } = entry!;
        return (
          <a
            key={id}
            href={`#${id}`}
            className={`whitespace-pre-wrap break-words hover:text-black text-gray-800 ${getIndentationClass(type)}`}
            title={text}
          >
            {text}
          </a>
        );
      })}
    </nav>
  );
};

export default TableOfContents;
