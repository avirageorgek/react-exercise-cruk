"use client";

import { type ReactNode } from "react";
import styled, { ThemeProvider } from "styled-components";
import {
  Box,
  crukTheme,
  Footer,
  GlobalStyle,
  Header,
  Link,
  type ThemeType,
} from "@cruk/cruk-react-components";

import { ReactQueryProvider } from "../contexts/ReactQueryProvider";
import { StyledComponentsRegistry } from "../server/StyledComponentsRegistry";

// makes sure footer stays near the bottom of the screen
const PageContentWrapper = styled.div<{ theme: ThemeType }>`
  min-height: calc(100vh - 200px);
  margin: 0 auto;
  width: 100%;
  max-width: ${({ theme }) => theme.breakpoint.desktopLarge};
`;

const ContentWrapperResponsive = styled(Box)<{ theme: ThemeType }>`
  && {
    max-width: ${({ theme }) => theme.utilities.contentMaxWidth};
  }
`;

const FooterWrapper = styled.div<{ theme: ThemeType }>`
  padding-bottom: ${({ theme }) => theme.spacing.xxl};
  clear: both;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <ReactQueryProvider>
        <body
          style={{
            color: "#000000",
            backgroundColor: "#FFFFFF",
          }}
        >
          <StyledComponentsRegistry>
            <ThemeProvider theme={crukTheme}>
              <GlobalStyle />
              <Header />
              <main>
                <PageContentWrapper id="main">
                  <ContentWrapperResponsive
                    backgroundColor="backgroundLight"
                    paddingBottom="l"
                    paddingTop="s"
                    paddingHorizontal="s"
                    marginHorizontal="auto"
                    marginVertical="none"
                  >
                    {children}
                  </ContentWrapperResponsive>
                </PageContentWrapper>
              </main>
              <FooterWrapper>
                <Footer>
                  <Link
                    appearance="secondary"
                    href="https://www.cancerresearchuk.org/about-us/contact-us"
                  >
                    Contact us
                  </Link>
                </Footer>
              </FooterWrapper>
            </ThemeProvider>
          </StyledComponentsRegistry>
        </body>
      </ReactQueryProvider>
    </html>
  );
}
