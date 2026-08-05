import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { resetPassword } from "../../api/auth";
import { getErrorMessage } from "../../api/error";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPassword">;

export function ResetPasswordScreen({ navigation, route }: Props) {
  const uid = route.params?.uid ?? "";
  const token = route.params?.token ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      await resetPassword(uid, token, password);
      navigation.navigate("Login");
    } catch (err) {
      setError(getErrorMessage(err, "This reset link is invalid or expired."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>Enter a new password for your account.</Text>

        <View style={styles.form}>
          <TextField label="New password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
          <Text style={styles.hint}>Use at least 8 characters with a number and a symbol.</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label={isSubmitting ? "Resetting..." : "Reset password"} onPress={handleSubmit} loading={isSubmitting} size="lg" />
        </View>

        <Text style={[styles.link, styles.centerLink]} onPress={() => navigation.navigate("Login")}>
          Back to login
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, justifyContent: "center", padding: spacing.lg },
  title: { fontFamily: fontFamily.bold, fontSize: fontSize.xxl, color: colors.textPrimary },
  subtitle: { marginTop: 6, fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textSecondary },
  form: { marginTop: spacing.lg, gap: spacing.md },
  hint: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  error: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.dangerText },
  link: { marginTop: spacing.lg, fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.accentMid },
  centerLink: { textAlign: "center" },
});
