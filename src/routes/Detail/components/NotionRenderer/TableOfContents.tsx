import React from "react";
import { ExtendedRecordMap } from "notion-types";

type TocEntry = {
  id: string;
  text: string;
  type: "header" | "sub_header" | "sub_sub_header";
};

type Props = {
  recordMap: ExtendedRecordMap;
};

const TableOfContents: React.FC<Props> = ({ recordMap }) => {
  if (!recordMap) return null;

  const tocEntries: TocEntry[] = Object.values(recordMap.block)
    .map((block) => {
      const v = block.value;
      if (
        v?.type === "header" ||
        v?.type === "sub_header" ||
        v?.type === "sub_sub_header"
      ) {
        // 🔑 grab only the text part of each run
        const rawTitle = (v.properties?.title as any[][]) || [];
        const text = rawTitle.map((run) => run[0] as string).join("") || "Untitled"; //only ever pull out the string content.

        return {
          id: v.id.replace(/-/g, ""),
          text,
          type: v.type,
        };
      }
      return null;
    })
    .filter((x): x is TocEntry => x !== null);

  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {tocEntries.map(({ id, text, type }) => {
        const level = type === "header" ? 1 : type === "sub_header" ? 2 : 3;
        return (
          <a
            key={id}
            href={`#${id}`}
            title={text}
            style={{
              display: "block",
              marginLeft: (level - 1) * 16 + "px",    // 0, 16, 32px
              fontSize:
                level === 1 ? "1rem" : level === 2 ? "0.9rem" : "0.8rem",
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
