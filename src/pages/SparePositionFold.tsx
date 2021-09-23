/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo, useEffect, useMemo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Button from "components/Button/Button";
import { useState } from "react";
import Tooltip from "components/Tooltip/Tooltip";
import { IType } from "./Portfolio/components/MyPortfolio/type";
import { Union } from "assets/images";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  padding: 24px 32px;
  position: relative;
`;

const LinearGradientWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.linearGradient.primary};
  opacity: 0.02;
  position: absolute;
  top: 0;
  left: 0;
`;

const ContainerWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 27px;
  grid-auto-flow: column;
  grid-template-columns: 235px 235px 1fr;
  align-items: end;
  @media screen and (max-width: 768px) {
    grid-auto-flow: row;
    grid-template-columns: auto;
  }
`;

const Card = styled.div`
  padding: 16px 19px;
  border: 1px solid ${({ theme }) => theme.primary.deep2};
  border-radius: 8px;
  position: relative;
`;

const CardTitle = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 12px;
  color: ${({ theme }) => theme.gray.normal7};
`;

const CardValue = styled.div`
  color: ${({ theme }) => theme.primary.deep};
  margin: 8px 0 6px 0;
`;

const CardAction = styled.div`
  display: grid;
  gap: 10px;
  grid-auto-flow: column;
  width: fit-content;
`;

const ButtonWrapper = styled(Button)`
  font-size: 12px;
  height: 30px;
  padding: 0 12px;
  border-radius: 4px;
  width: fit-content;
`;

const Prompt = styled.div`
  padding: 18px;
  width: 100%;
  height: fit-content;
  position: relative;
  border-radius: 8px;
  background: ${({ theme }) => theme.white.normal};
  display: grid;
  gap: 5px;
  grid-auto-flow: column;
  color: ${({ theme }) => theme.gray.normal7};
  font-size: 12px;
  font-weight: 500;
  line-height: 15.6px;
`;

type TProps = WrappedComponentProps;

const SparePositionFold = memo<TProps>(({ intl }) => {
  const { gray, primary, shadow, linearGradient, white } = useTheme();

  return (
    <Wrapper>
      <LinearGradientWrapper />
      <ContainerWrapper>
        <Card>
          <CardTitle>
            <div>
              {intl.formatMessage({ defaultMessage: "Principal+" })}
              <Tooltip
                overlay={intl.formatMessage({
                  defaultMessage: "Before the cycle starts, the principal can be redeemed in the Pending state."
                })}
              >
                <u
                  css={{
                    borderBottom: "1px dashed",
                    borderColor: gray.normal7,
                    color: gray.normal7,
                    textDecoration: "none"
                  }}
                >
                  {intl.formatMessage({ defaultMessage: "Est. interest" })}
                </u>
              </Tooltip>
            </div>
            <Tooltip
              overlay={intl.formatMessage({
                defaultMessage:
                  "In the active state, the interest is the theoretical interest calculated based on the theoretical APR.The actual interest is subject to the system display after expiration."
              })}
              css={{ position: "absolute", top: 16, right: 17 }}
            >
              <Union css={{ color: gray.normal3 }} />
            </Tooltip>
          </CardTitle>
          <CardValue>10,000,010 BUSD </CardValue>
          <CardAction>
            <ButtonWrapper type="primary">{intl.formatMessage({ defaultMessage: "Withdraw all" })}</ButtonWrapper>
            <ButtonWrapper type="primary">{intl.formatMessage({ defaultMessage: "Re-deposit" })}</ButtonWrapper>
          </CardAction>
        </Card>
        <Card>
          <CardTitle>{intl.formatMessage({ defaultMessage: "WTF Reward" })}</CardTitle>
          <CardValue>- WTF</CardValue>
          <CardAction>
            <ButtonWrapper type="primary">{intl.formatMessage({ defaultMessage: "Claim" })}</ButtonWrapper>
          </CardAction>
        </Card>
        <Prompt>
          <Union css={{ color: primary.deep }} />
          <div>
            {intl.formatMessage({
              defaultMessage: `Upon maturity, you can choose to withdraw all the principal + interest. Alternatively you can choose to deposit to the next cycle - and choose the amount of re-deposit and tranche you re-deposit to.`
            })}
          </div>
        </Prompt>
      </ContainerWrapper>
    </Wrapper>
  );
});

export default injectIntl(SparePositionFold);
