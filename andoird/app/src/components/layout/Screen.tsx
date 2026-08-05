import { StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../theme/colors";

export function Screen({
  children,
  style,
  edges,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ("top" | "bottom" | "left" | "right")[];
}) {
  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges ?? ["top"]}>
      <View style={styles.flex}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
});
