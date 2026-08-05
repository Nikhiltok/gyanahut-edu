import { StyleSheet, Text, TextInput, View, type KeyboardTypeOptions } from "react-native";

import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { radius } from "../../theme/spacing";

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "sentences",
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textHint}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    borderBottomWidth: 1.4,
    borderBottomColor: colors.borderStrong,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
  },
  label: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs + 0.5,
    color: colors.textSecondary,
  },
  input: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textPrimary,
    padding: 0,
    marginTop: 2,
  },
});
