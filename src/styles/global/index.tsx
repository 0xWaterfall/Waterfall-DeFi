import { Global, useTheme } from "@emotion/react";

export default () => {
  const { gray, primary } = useTheme();
  return (
    <Global
      styles={{
        "html, body": {
          fontSize: 14,
          fontFamily: "Nunito, sans-serif",
          overflowX: "hidden",
          height: "auto"
          // backgroundColor: gray.light
        },
        "*": {
          boxSizing: "border-box"
        },

        "::selection": {
          // backgroundColor: plain.normal
        },
        "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
          WebkitAppearance: "none",
          margin: 0
        },
        "input[type=number]": {
          mozAppearance: "textfield"
        },
        ".ant-modal-mask": {
          backgroundColor: gray.normal3
        },
        a: {
          color: primary.deep,
          ":hover": {
            color: primary.deep
          }
        }
      }}
    />
  );
};
