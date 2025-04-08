import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { ExtendedRecordMap } from "notion-types"
import useScheme from "src/hooks/useScheme"
import TableOfContents from "./TableOfContents"; // Adjust path if needed

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css"

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css"

// used for rendering equations (optional)

import "katex/dist/katex.min.css"
import { FC } from "react"
import styled from "@emotion/styled"

const _NotionRenderer = dynamic(
  () => import("react-notion-x").then((m) => m.NotionRenderer),
  { ssr: false }
)

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => {
    await Promise.all([
      import("prismjs/components/prism-verilog.js"),
      import("prismjs/components/prism-vhdl.js"),
      import("prismjs/components/prism-vim.js"),
      import("prismjs/components/prism-markup-templating.js"),
      import("prismjs/components/prism-markup.js"),
      import("prismjs/components/prism-bash.js"),
      import("prismjs/components/prism-c.js"),
      import("prismjs/components/prism-cpp.js"),
      import("prismjs/components/prism-csharp.js"),
      import("prismjs/components/prism-docker.js"),
      import("prismjs/components/prism-java.js"),
      import("prismjs/components/prism-js-templates.js"),
      import("prismjs/components/prism-coffeescript.js"),
      import("prismjs/components/prism-diff.js"),
      import("prismjs/components/prism-git.js"),
      import("prismjs/components/prism-go.js"),
      import("prismjs/components/prism-graphql.js"),
      import("prismjs/components/prism-handlebars.js"),
      import("prismjs/components/prism-less.js"),
      import("prismjs/components/prism-makefile.js"),
      import("prismjs/components/prism-markdown.js"),
      import("prismjs/components/prism-objectivec.js"),
      import("prismjs/components/prism-ocaml.js"),
      import("prismjs/components/prism-python.js"),
      import("prismjs/components/prism-reason.js"),
      import("prismjs/components/prism-rust.js"),
      import("prismjs/components/prism-sass.js"),
      import("prismjs/components/prism-scss.js"),
      import("prismjs/components/prism-solidity.js"),
      import("prismjs/components/prism-sql.js"),
      import("prismjs/components/prism-stylus.js"),
      import("prismjs/components/prism-swift.js"),
      import("prismjs/components/prism-wasm.js"),
      import("prismjs/components/prism-yaml.js"),
    ])
    return m.Code
  })
)

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
)

const mapPageUrl = (id: string) => {
  return "https://www.notion.so/" + id.replace(/-/g, "")
}

type Props = {
  recordMap: ExtendedRecordMap
}

const NotionRenderer: FC<Props> = ({ recordMap }) => {
  const [scheme] = useScheme()

  // ✂️ Remove all collection‐view blocks (this includes the page‐properties table)
  const filteredBlocks = Object.fromEntries(
    Object.entries(recordMap.block).filter(
      ([, b]) =>
        b.value.type !== "collection_view" &&
        b.value.type !== "collection_view_page"
    )
  )

  const cleanedRecordMap: ExtendedRecordMap = {
    ...recordMap,
    block: filteredBlocks,
  }

  return (
    <StyledWrapper>
      <main className="content">
        <_NotionRenderer
          darkMode={scheme === "dark"}
          recordMap={cleanedRecordMap}
          components={{
            Code,
            Collection,   // if you still need inline collections, leave this
            Equation,
            Modal,
            Pdf,
            nextImage: Image,
            nextLink: Link,
          }}
          mapPageUrl={mapPageUrl}
        />
      </main>

      {/* only renders if there are headings */}
      <aside className="sidebar">
          <TableOfContents recordMap={cleanedRecordMap} />
        </aside>
    </StyledWrapper>
  )
}

export default NotionRenderer;

// index.tsx (or wherever StyledWrapper lives)
const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  align-items: start;
  margin-bottom: 48px;
  
  .content {
    max-width: 800px;
    width: 100%;
  }

    .sidebar {
    position: sticky;
    top: 80px; /* keeps TOC under header as you scroll */
  }


  /* THIS is your sidebar wrapper */
  .toc {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.toc-item {
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}
.toc-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* top‑level */
.toc-item.level-1 {
  margin-left: 0;
  font-weight: 600;
}

.toc-item.level-2 {
  margin-left: 16px;
  opacity: 0.9;
}
.toc-item.level-3 {
  margin-left: 32px;
  opacity: 0.8;
}

`