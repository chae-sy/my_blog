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

  // 1) Grab all the collection‐view block IDs
  const collectionViewIds = Object.values(recordMap.block)
    .filter(
      (b) =>
        b.value.type === "collection_view" ||
        b.value.type === "collection_view_page"
    )
    .map((b) => b.value.id);

  const tocEntries: TocEntry[] = Object.values(recordMap.block)
    // 2) Only real heading blocks
    .filter((b) =>
      ["header", "sub_header", "sub_sub_header"].includes(b.value.type)
    )
    // 3) Must be direct child of some block (not a collection‐view) AND not under a collection‐view
    .filter(
      (b) =>
        b.value.parent_table === "block" &&
        !collectionViewIds.includes(b.value.parent_id)
    )
    // 4) Map to our TOC shape
    .map((b) => {
      const v = b.value;
      // pull just the text runs
      const raw = (v.properties?.title as any[][]) || [];
      const text = raw.map((run) => run[0] as string).join("") || "Untitled";
      return {
        id: v.id.replace(/-/g, ""),
        text,
        type: v.type as "header" | "sub_header" | "sub_sub_header",
      };
    });

  return (
    <nav className="toc-nav">
      {tocEntries.map(({ id, text, type }) => {
        const level = type === "header" ? 1 : type === "sub_header" ? 2 : 3;
        return (
          <a
            key={id}
            href={`#${id}`}
            title={text}
            style={{
              display: "block",
              marginLeft: (level - 1) * 16 + "px",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              whiteSpace: "normal",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              color: "#333",
              textDecoration: "none",
              position: "relative",
              padding: "2px 0",
            }}
          >
            {text}
            <span
              style={{
                content: '""',
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%) translateX(-100%)",
                width: "100%",
                height: "1.2em",
                backgroundColor: "rgba(0,0,0,0.05)",
                transition: "transform 0.3s ease",
                zIndex: -1,
              }}
              className="hover‐highlight"
            />
          </a>
        );
      })}
    </nav>
  );
};

export default TableOfContents;
