import { LinearGradient } from "expo-linear-gradient";
import { Platform, StyleSheet, type ViewStyle } from "react-native";

import { colors } from "../../theme/colors";
import { radius } from "../../theme/spacing";

export function GradientHero({
  children,
  variant = "warm",
  style,
}: {
  children: React.ReactNode;
  variant?: "warm" | "cool";
  style?: ViewStyle;
}) {
  const gradientColors = variant === "warm" ? colors.gradientWarm : colors.gradientCool;
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.hero, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.xl,
    padding: 20,
    ...Platform.select({
      android: { elevation: 4 },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
      },
    }),
  },
});
