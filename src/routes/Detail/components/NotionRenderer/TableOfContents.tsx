import React from "react";
import { ExtendedRecordMap } from "notion-types";

type Props = {
  recordMap: ExtendedRecordMap;
};

const TableOfContents: React.FC<Props> = ({ recordMap }) => {
  if (!recordMap) return null;

  const tocEntries = Object.values(recordMap.block)
    .map((block) => {
      const v = block.value;
      if (
        v?.type === "header" ||
        v?.type === "sub_header" ||
        v?.type === "sub_sub_header"
      ) {
        // flatten title so emojis + text all come through
        const raw = v.properties?.title ?? [];
        const text = raw.flat(2).join("") || "Untitled";
        return {
          id: v.id.replace(/-/g, ""),
          text,
          type: v.type,
        };
      }
      return null;
    })
    .filter((x): x is { id: string; text: string; type: "header" | "sub_header" | "sub_sub_header" } =>
      x !== null
    );
    
  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {tocEntries.map(({ id, text, type }) => {
        // compute level & indentation
        let level = 1;
        if (type === "sub_header") level = 2;
        else if (type === "sub_sub_header") level = 3;

        return (
          <a
            key={id}
            href={`#${id}`}
            title={text}
            style={{
              display: "block",
              marginLeft: (level - 1) * 16 + "px",   // 0px, 16px, 32px
              fontSize: level === 1 ? "1rem" : level === 2 ? "0.9rem" : "0.8rem",
              whiteSpace: "normal",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              color: "#333",
              textDecoration: "none",
            }}
          >
            {text}
          </a>
        );
      })}
    </nav>
  );
};

export default TableOfContents;
