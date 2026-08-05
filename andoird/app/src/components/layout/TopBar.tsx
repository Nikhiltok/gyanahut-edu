import { ChevronLeft } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";

export function TopBar({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={12} style={styles.backButton}>
          <ChevronLeft size={22} color={colors.textPrimary} />
        </Pressable>
      ) : (
        <View style={styles.backSpacer} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
  backButton: {
    width: 24,
    alignItems: "flex-start",
  },
  backSpacer: {
    width: 0,
  },
  title: {
    flex: 1,
    marginLeft: 8,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
  },
  right: {
    minWidth: 24,
    alignItems: "flex-end",
  },
});
