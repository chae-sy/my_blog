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
    <nav className="notion-table-of-contents space-y-2">
      {tocEntries.map((entry) => {
        const { id, text, type = "" } = entry!;
        return (
          <a
            key={id}
            href={`#${id}`}
            className={`block break-words hover:text-black text-gray-800 ${getIndentationClass(type)}`}
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
