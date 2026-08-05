import { useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { colors } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";
import { radius } from "../../theme/spacing";

export function OtpInput({
  length = 6,
  value,
  onChange,
}: {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  function setDigit(index: number, digit: string) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(""));
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(index: number, key: string) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  return (
    <View style={styles.row}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          value={digit}
          onChangeText={(text) => handleChange(index, text)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={1}
          style={styles.box}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  box: {
    width: 44,
    height: 52,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    textAlign: "center",
    fontFamily: fontFamily.mono,
    fontSize: 18,
    color: colors.textPrimary,
  },
});
