import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BarChart3, BookOpenCheck, ClipboardList, Home, User } from "lucide-react-native";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";
import { radius } from "../theme/spacing";

const ICONS: Record<string, typeof Home> = {
  Home: Home,
  Practice: BookOpenCheck,
  Tests: ClipboardList,
  Ranking: BarChart3,
  Profile: User,
};

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const Icon = ICONS[route.name] ?? Home;

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.item}>
            <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
              <Icon size={20} color={isFocused ? colors.accentText : colors.textSecondary} strokeWidth={2} />
            </View>
            <Text style={[styles.label, isFocused && styles.labelActive]}>{route.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    ...Platform.select({
      android: { elevation: 8 },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: -3 },
      },
    }),
  },
  item: {
    flex: 1,
    alignItems: "center",
  },
  iconWrap: {
    width: 56,
    height: 28,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: colors.accentChip,
  },
  label: {
    marginTop: 4,
    fontSize: 10.5,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  labelActive: {
    fontFamily: fontFamily.medium,
    color: colors.accentMid,
  },
});
