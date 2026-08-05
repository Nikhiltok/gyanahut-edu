import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from "react-native";

import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { radius } from "../../theme/spacing";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "default",
  disabled,
  loading,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.accentText : colors.textPrimary} />
      ) : (
        <Text
          style={[
            styles.label,
            labelSizeStyles[size],
            variant === "outline" || variant === "ghost" ? styles.labelDark : styles.labelAccent,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: fontFamily.medium,
  },
  labelAccent: {
    color: colors.accentText,
  },
  labelDark: {
    color: colors.textPrimary,
  },
});

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, ViewStyle> = StyleSheet.create({
  default: { height: 44, paddingHorizontal: 20 },
  sm: { height: 36, paddingHorizontal: 16 },
  lg: { height: 52, paddingHorizontal: 24 },
});

const labelSizeStyles = StyleSheet.create({
  default: { fontSize: 13 },
  sm: { fontSize: 11.5 },
  lg: { fontSize: 14.5 },
});

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, ViewStyle> = StyleSheet.create({
  primary: { backgroundColor: colors.accentChip },
  outline: { backgroundColor: "transparent", borderWidth: 1.1, borderColor: colors.borderStrong },
  ghost: { backgroundColor: "transparent" },
});
