import { Platform, StyleSheet, View, type ViewStyle } from "react-native";

import { colors } from "../../theme/colors";
import { radius } from "../../theme/spacing";

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...Platform.select({
      android: { elevation: 2 },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.16,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
      },
    }),
  },
});
