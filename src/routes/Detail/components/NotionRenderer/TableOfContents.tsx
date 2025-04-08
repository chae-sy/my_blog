import React from "react"
import { ExtendedRecordMap } from "notion-types"

type TocEntry = { id: string; text: string; level: 1 | 2 | 3 }

const TableOfContents: React.FC<{ recordMap: ExtendedRecordMap }> = ({
  recordMap,
}) => {
  const toc = Object.values(recordMap.block)
    .filter((b) =>
      ["header", "sub_header", "sub_sub_header"].includes(b.value.type)
    )
    .map((b) => {
      const raw = (b.value.properties?.title as any[][]) || []
      const text = raw.map((r) => r[0]).join("") || "Untitled"
      const level =
        b.value.type === "header"
          ? 1
          : b.value.type === "sub_header"
          ? 2
          : 3
      return { id: b.value.id.replace(/-/g, ""), text, level }
    })

  if (!toc.length) return null

  return (
    <nav className="toc">
      {toc.map(({ id, text, level }) => (
        <a key={id} href={`#${id}`} className={`toc-item level-${level}`}>
          {text}
        </a>
      ))}
    </nav>
  )
}

export default TableOfContents
