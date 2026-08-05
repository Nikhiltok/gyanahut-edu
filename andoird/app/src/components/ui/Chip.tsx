import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";
import { radius } from "../../theme/spacing";

export type ChipVariant = "accent" | "success" | "danger" | "warning" | "info" | "neutral";

export function Chip({ label, variant = "accent" }: { label: string; variant?: ChipVariant }) {
  const palette = palettes[variant];
  return (
    <View style={[styles.chip, { backgroundColor: palette.bg }]}>
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

const palettes: Record<ChipVariant, { bg: string; text: string }> = {
  accent: { bg: colors.accentChip, text: colors.accentText },
  success: { bg: colors.successBg, text: colors.successText },
  danger: { bg: colors.dangerBg, text: colors.dangerText },
  warning: { bg: colors.warningBg, text: colors.warningText },
  info: { bg: colors.infoBg, text: colors.infoText },
  neutral: { bg: colors.surfaceMuted, text: colors.textSecondary },
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
  },
});
