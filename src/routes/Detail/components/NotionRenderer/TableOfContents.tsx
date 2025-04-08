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

  // 1) collect the IDs of the collection‐view blocks (your property table)
  const collectionViewIds = Object.values(recordMap.block)
    .filter((b) =>
      ["collection_view", "collection_view_page"].includes(b.value.type)
    )
    .map((b) => b.value.id);

  // 2) pull out only header / sub_header / sub_sub_header
  //    that live in the main page (parent_table==="block")
  //    and aren’t children of the property‐table view
  const tocEntries: TocEntry[] = Object.values(recordMap.block)
    .filter((b) =>
      ["header", "sub_header", "sub_sub_header"].includes(b.value.type)
    )
    .filter(
      (b) =>
        b.value.parent_table === "block" &&
        !collectionViewIds.includes(b.value.parent_id)
    )
    .map((b) => {
      const v = b.value;
      // grab only the text runs (no ["b"] flags)
      const raw = (v.properties?.title as any[][]) || [];
      const text = raw.map((run) => run[0] as string).join("") || "Untitled";
      return {
        id: v.id.replace(/-/g, ""),
        text,
        type: v.type as TocEntry["type"],
      };
    });

    // 1) If there are no real headings, render nothing
    if (tocEntries.length === 0) return null;
  return (
    <nav className="toc-nav">
  {tocEntries.map(({ id, text, type }) => {
    const level = type === "header" ? 1 : type === "sub_header" ? 2 : 3;
    return (
      <a
        key={id}
        href={`#${id}`}
        title={text}
        style={{ marginLeft: (level - 1) * 16 + "px" }}
      >
        <span className="toc-text">{text}</span>
      </a>
    );
  })}
</nav>

  );
};

export default TableOfContents;
