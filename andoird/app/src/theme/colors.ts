export const colors = {
  bg: "#FFF8F3",
  surface: "#FFFFFF",
  surfaceMuted: "#F3E9DC",
  surfaceMuted2: "#EDE1D2",
  border: "#D6C7AF",
  borderStrong: "#847460",

  textPrimary: "#201A12",
  textSecondary: "#524533",
  textHint: "#847460",
  onDark: "#FFFFFF",

  gradientWarm: ["#FFC876", "#F0A337"] as const,
  gradientCool: ["#C9DCC3", "#8FB584"] as const,

  accentChip: "#FFDDB0",
  accentText: "#2B1700",
  accentTextStrong: "#3A2205",
  accentMid: "#8C5A15",
  accentMuted: "#5C3A0E",

  success: "#2E6E45",
  successAlt: "#2E5A22",
  successBg: "#B8F1C4",
  successText: "#0A3818",

  danger: "#BA1A1A",
  dangerBg: "#FFDAD6",
  dangerText: "#410002",

  warningBg: "#FFE4A6",
  warningText: "#4A3300",

  infoBg: "#D9E3F5",
  infoText: "#294876",

  gold: "#FFD54A",
  silver: "#D6D6D6",
  bronze: "#E3A467",
} as const;

export type Colors = typeof colors;
