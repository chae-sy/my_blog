import React, { useState, useEffect } from "react"
import { ExtendedRecordMap } from "notion-types"

type TocEntry = { id: string; text: string; level: 1 | 2 | 3 }

const TableOfContents: React.FC<{ recordMap: ExtendedRecordMap }> = ({
  recordMap,
}) => {
  // 1) build the TOC entries array
  const toc: TocEntry[] = Object.values(recordMap.block)
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

  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (!toc.length) return

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "0px 0px -80% 0px",
      threshold: 0,
    })

    // observe each heading in the document
    toc.forEach(({ id }) => {
      const elem = document.getElementById(id)
      if (elem) observer.observe(elem)
    })

    return () => observer.disconnect()
  }, [toc])

  if (!toc.length) return null

  return (
    <nav className="toc">
      {toc.map(({ id, text, level }) => (
        <a
          key={id}
          href={`#${id}`}
          className={[
            "toc-item",
            `level-${level}`,
            activeId === id ? "active" : "",
          ].join(" ")}
        >
          {text}
        </a>
      ))}
    </nav>
  )
}

export default TableOfContents
