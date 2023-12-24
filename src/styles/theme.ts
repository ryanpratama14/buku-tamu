import { type ThemeConfig } from "antd";

export const COLORS = {
  blue: "#273046",
  blue2: "#0C102A",
  green: "#227722",
  light: "#F6F6F6",
  light2: "#D1D1D6",
  gray: "#83878C",
  gray2: "#5E5873",
  purple: "#7367F0",
};

export const antdTheme: ThemeConfig = {
  token: {
    fontFamily: "",
    colorBgElevated: "",
    colorPrimary: "",
    colorLinkHover: "",
    colorLinkActive: "",
    colorLink: "",
  },
  components: {
    Layout: {
      headerBg: COLORS.blue,
      siderBg: COLORS.blue,
    },
    Menu: {
      itemSelectedColor: COLORS.light,
      itemSelectedBg: COLORS.blue2,
      itemBg: COLORS.blue,
      itemHoverBg: COLORS.blue2,
      itemActiveBg: COLORS.blue2,
      itemColor: COLORS.light,
    },
    Table: {
      headerBg: COLORS.blue,
      headerColor: COLORS.light,
      borderColor: "#e8e8ed",
      headerBorderRadius: 6,
      colorBgContainer: "white",
      cellPaddingBlock: 6,
      rowHoverBg: "#e8e8ed",
    },
  },
};
