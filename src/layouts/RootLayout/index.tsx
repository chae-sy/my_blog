import React, { ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "./ThemeProvider";
import useScheme from "src/hooks/useScheme";
import Header from "./Header";
import styled from "@emotion/styled";
import Scripts from "src/layouts/RootLayout/Scripts";
import useGtagEffect from "./useGtagEffect";
import Prism from "prismjs/prism";
import Calendar from "src/components/Calendar"; // Import the Calendar component

// Note: Add the fetchPostDates function in RootLayout (if not already present)
const fetchPostDates = async (): Promise<string[]> => {
  const dates = await getPostDates(); // Assuming getPostDates is imported correctly
  return dates;
};


type Props = {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => {
  const [scheme] = useScheme();
  const [postDates, setPostDates] = useState<string[]>([]); // State to store post dates
  useGtagEffect();

  useEffect(() => {
    const fetchPostDatesData = async () => {
      const dates = await fetchPostDates(); // Use fetchPostDates here
      setPostDates(dates); // Set the fetched post dates
    };

    fetchPostDatesData();
  }, []);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <ThemeProvider scheme={scheme}>
      <Scripts />
      <Header fullWidth={false} />
      <StyledMain>
        <Calendar postDates={postDates} /> {/* Pass postDates as a prop */}
        {children}
      </StyledMain>
    </ThemeProvider>
  );
};

export default RootLayout;

const StyledMain = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: 1120px;
  padding: 0 1rem;
`;
