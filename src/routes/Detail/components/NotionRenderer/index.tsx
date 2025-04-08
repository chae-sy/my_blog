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
  const [scheme] = useScheme();
  return (
    <StyledWrapper>
      <div className="content">
        <_NotionRenderer
          darkMode={scheme === "dark"}
          recordMap={recordMap}
          components={{ Code, Collection, Equation, Modal, Pdf, nextImage: Image, nextLink: Link }}
          mapPageUrl={mapPageUrl}
        />
      </div>
        {/* TableOfContents now renders its own <aside> (or null) */}
        <TableOfContents recordMap={recordMap} />
    </StyledWrapper>
  );
};

export default NotionRenderer;

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  align-items: start;

  .content {
    max-width: 800px;
    width: 100%;
  }

  .toc {
    /* pin it & give it your card look */
    position: sticky;
    top: 80px;              /* match your header height */
    background: #e8f1fb;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);

    /* 3) cap its height to viewport minus header & padding */
    max-height: calc(100vh - 80px - 32px);
    overflow-y: auto;

    .toc-nav a {
      display: block;
      font-size: 0.95rem;
      line-height: 1.6;
      color: #333;
      text-decoration: none;
      padding: 4px 0;
    }

    .toc-nav .toc-text {
      position: relative;
      display: inline-block;
      padding: 0 2px;
      overflow: hidden;
    }
    .toc-nav .toc-text::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.05);
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      z-index: -1;
    }
    .toc-nav a:hover .toc-text::before {
      transform: translateX(0);
    }
  }
`;
