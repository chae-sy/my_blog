import React, { ReactNode, useEffect } from "react"
import { ThemeProvider } from "./ThemeProvider"
import useScheme from "src/hooks/useScheme"
import Header from "./Header"
import styled from "@emotion/styled"
import Scripts from "src/layouts/RootLayout/Scripts"
import useGtagEffect from "./useGtagEffect"
import Prism from "prismjs/prism"
import 'prismjs/components/prism-markup-templating.js'
import 'prismjs/components/prism-markup.js'
import 'prismjs/components/prism-bash.js'
import 'prismjs/components/prism-c.js'
import 'prismjs/components/prism-cpp.js'
import 'prismjs/components/prism-csharp.js'
import 'prismjs/components/prism-docker.js'
import 'prismjs/components/prism-java.js'
import 'prismjs/components/prism-js-templates.js'
import 'prismjs/components/prism-coffeescript.js'
import 'prismjs/components/prism-diff.js'
import 'prismjs/components/prism-git.js'
import 'prismjs/components/prism-go.js'
import 'prismjs/components/prism-kotlin.js'
import 'prismjs/components/prism-graphql.js'
import 'prismjs/components/prism-handlebars.js'
import 'prismjs/components/prism-less.js'
import 'prismjs/components/prism-makefile.js'
import 'prismjs/components/prism-markdown.js'
import 'prismjs/components/prism-objectivec.js'
import 'prismjs/components/prism-ocaml.js'
import 'prismjs/components/prism-python.js'
import 'prismjs/components/prism-reason.js'
import 'prismjs/components/prism-rust.js'
import 'prismjs/components/prism-sass.js'
import 'prismjs/components/prism-scss.js'
import 'prismjs/components/prism-solidity.js'
import 'prismjs/components/prism-sql.js'
import 'prismjs/components/prism-stylus.js'
import 'prismjs/components/prism-swift.js'
import 'prismjs/components/prism-wasm.js'
import 'prismjs/components/prism-yaml.js'
import "prismjs/components/prism-go.js"
import Calendar from "src/components/Calendar"; //Import the Calendar component

type Props = {
  children: ReactNode
}


const RootLayout = ({ children }: Props) => {
  const [scheme] = useScheme()
  const [postDates, setPostDates] = useState<string[]>([]); // State to store post dates
  useGtagEffect()

  useEffect(() => {
    // Fetch post dates when the component mounts
    const fetchPostDates = async () => {
      const dates = await getPostDates();
      setPostDates(dates); // Set the post dates in the state
    }
    fetchPostDates();

    Prism.highlightAll();
  }, []);

  return (
    <ThemeProvider scheme={scheme}>
      <Scripts />
      <Header fullWidth={false} />
      <StyledMain>
        <StyledSidebar>
          <Calendar postDates={postDates} /> {/* Pass the postDates as a prop */}
        </StyledSidebar>
        <StyledContent>{children}</StyledContent>
      </StyledMain>
    </ThemeProvider>
  );
};

export default RootLayout

const StyledMain = styled.main`
  display: flex;
  margin: 0 auto;
  width: 100%;
  max-width: 1120px;
  padding: 0 1rem;
`

const StyledSidebar = styled.aside`
  width: 250px;
  background-color: #f4f4f4;
  padding: 1rem;
  border-right: 2px solid #ddd;
`

const StyledContent = styled.section`
  flex-grow: 1;
  padding: 1rem;
`