import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { radius } from "../../theme/spacing";

export interface PickerOption {
  label: string;
  value: string;
}

export function PickerField({
  label,
  placeholder,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: PickerOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        onPress={() => !disabled && setOpen(true)}
        style={[styles.container, disabled && styles.disabled]}
      >
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, !selected && styles.placeholder]}>{selected?.label ?? placeholder}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
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
  disabled: { opacity: 0.5 },
  label: { fontFamily: fontFamily.regular, fontSize: fontSize.xs + 0.5, color: colors.textSecondary },
  value: { marginTop: 2, fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary },
  placeholder: { color: colors.textHint },
  backdrop: { flex: 1, backgroundColor: "rgba(32,26,18,0.45)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
    paddingTop: 16,
    paddingBottom: 24,
  },
  sheetTitle: { paddingHorizontal: 20, fontFamily: fontFamily.medium, fontSize: fontSize.lg, color: colors.textPrimary, marginBottom: 8 },
  optionsList: { paddingHorizontal: 8 },
  option: { paddingHorizontal: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  optionText: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary },
});
