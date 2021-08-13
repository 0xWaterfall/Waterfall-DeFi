const theme = {
  fonts: {
    Nunito: "Nunito",
    CarterOne: "Carter One"
  },
  gray: {
    light: "#FAFAFA",
    normal: "#333333",
    normal04: "rgba(51, 51, 51, 0.04)",
    normal08: "rgba(51, 51, 51, 0.08)",
    normal3: "rgba(51, 51, 51, 0.3)",
    normal5: "rgba(51, 51, 51, 0.5)",
    normal7: "rgba(51, 51, 51, 0.7)",
    normal85: "rgba(51, 51, 51, 0.85)"
  },
  primary: {
    lightBrown: "#F5FAFF",
    light: "#048FFF",
    normal: "#167BFF",
    deep: "#0066FF",
    deepBrown: "#2C5290"
  },
  tags: {
    redText: "#E04E29",
    redBackground: "rgba(224, 78, 41, 0.1);",
    yellowText: "#FCB500",
    yellowBackground: "rgba(252, 181, 0, 0.1)",
    greenText: "#00B8B8",
    greenBackground: "rgba(0, 184, 184, 0.1);",
    borderRadius: "4px"
  },
  warn: {
    normal: "#FCB500",
    deep: "#F0603C"
  },
  green: {
    normal: "#00A14A"
  },
  white: {
    normal: "#FFFFFF"
  },
  linearGradient: {
    primary: "linear-gradient(360deg, #1579FF 0%, #157BFF 100%)"
  },
  shadow: {
    primary: "0px 4px 10px rgba(15, 96, 227, 0.1)",
    claim: "inset 0px 4px 10px rgba(79, 153, 250, 0.1), inset 0px 4px 10px rgba(0, 109, 255, 0.1)"
  },
  filter: {
    primary: "drop-shadow(0px 10px 20px rgba(15, 96, 227, 0.04))"
  },
  table: {
    border: "1px solid rgba(0, 102, 255, 0.2)",
    theadBackground: "#f5faff",
    rowBackground: "#f5faff",
    borderRadius: "12px"
  },
  footer: {
    background: "#030C1B"
  }
};

export type ITheme = typeof theme;
export default theme;
