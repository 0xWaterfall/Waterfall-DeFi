/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { useSize } from "ahooks";
import { Discord, Medium, Telegram, Twitter, Unicorn, Wave, LogoFooter, FooterLine1, FooterLine2 } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";

type TProps = WrappedComponentProps;

const Footer = memo<TProps>(({ intl }) => {
  const { gray, footer, fonts, white } = useTheme();
  const { width } = useSize(document.body);

  const CONTACTS = [
    { Icon: Discord, link: "https://discord.gg/gS9Gda4sez" },
    { Icon: Telegram, link: "https://t.me/joinchat/BYZHfIJv0eRjY2I0" },
    { Icon: Medium, link: "https://medium.com/@WaterfallDefi" },
    { Icon: Twitter, link: "https://twitter.com/waterfalldefi" }
  ];

  const FooterWrapper = styled.div`
    background-color: ${footer.background};
    position: relative;
    height: 500px;
    @media screen and (max-width: 1024px) : {
      height: auto;
    }
  `;

  const LogoWrapper = styled.div`
    width: 152px;
    height: 76px;
  `;
  const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 80vw;
    margin: auto;
    padding-top: 100px;
    height: 100%;
    padding-bottom: 40px;
  `;

  const ConnectDiv = styled.div`
    font-size: 14px;
    line-height: 19px;
    font-family: ${fonts.Nunito};
    color: ${white.normal};
    display: flex;
    opacity: 0.8;
    & span {
      margin-right: 50px;
    }
  `;
  const CopyrightDiv = styled.div`
    font-size: 16px;
    line-height: 25px;
    font-family: ${fonts.CarterOne};
    color: ${white.normal};
    opacity: 0.8;
    display: flex;
  `;
  const FooterLineDiv = styled.div`
    position: absolute;
    right: 100px;
    bottom: 50px;
    width: 500px;
    height: 200px;
    & > svg {
      position: absolute;
    }
    & > svg:nth-of-type(2) {
      top: -29px;
      right: 36px;
    }
  `;
  return (
    <FooterWrapper>
      <ContentWrapper>
        <LogoWrapper>
          <LogoFooter />
        </LogoWrapper>
        <ConnectDiv>
          <span>{intl.formatMessage({ defaultMessage: "Connect" })}</span>
          {CONTACTS.map(({ Icon, link }) => (
            <a key={link} href={link} css={{ marginRight: 20, color: "white" }}>
              <Icon />
            </a>
          ))}
        </ConnectDiv>
        <CopyrightDiv>
          {intl.formatMessage({ defaultMessage: "Copyright 2021 - 2022 - All Rights Reserved" })}
        </CopyrightDiv>
        <FooterLineDiv>
          <FooterLine1 />
          <FooterLine2 />
        </FooterLineDiv>
      </ContentWrapper>

      <div>
        <div></div>

        {Boolean(width && width > 1024) && (
          <Unicorn css={{ position: "fixed", top: "40vh", right: 0, width: 170, height: 220 }} />
        )}
      </div>
    </FooterWrapper>
  );
});

export default injectIntl(Footer);
