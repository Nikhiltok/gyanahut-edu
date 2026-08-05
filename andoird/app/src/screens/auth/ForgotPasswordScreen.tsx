import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { forgotPassword } from "../../api/auth";
import { getErrorMessage } from "../../api/error";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Forgot password</Text>
        <Text style={styles.subtitle}>Enter your email and we'll send you a reset link.</Text>

        {sent ? (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>If an account with that email exists, a reset link has been sent.</Text>
          </View>
        ) : (
          <View style={styles.form}>
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button label={isSubmitting ? "Sending..." : "Send reset link"} onPress={handleSubmit} loading={isSubmitting} size="lg" />
          </View>
        )}

        <Text style={styles.footerText}>
          Remembered your password?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
            Login
          </Text>
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
  error: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.dangerText },
  link: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.accentMid },
  footerText: {
    marginTop: spacing.lg,
    textAlign: "center",
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  successBanner: { marginTop: spacing.lg, backgroundColor: colors.successBg, borderRadius: 8, padding: 14 },
  successText: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.successText },
});
