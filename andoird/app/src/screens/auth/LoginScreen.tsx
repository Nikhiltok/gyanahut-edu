import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { login } from "../../api/auth";
import { getErrorMessage } from "../../api/error";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { refreshProfile } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ identifier, password });
      await refreshProfile();
    } catch (err) {
      setError(getErrorMessage(err, "Invalid credentials."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <View style={styles.brandDot} />
          <Text style={styles.brandText}>Gyanahut Edu</Text>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Enter your details to resume your preparation.</Text>

        <View style={styles.form}>
          <TextField
            label="Email or phone number"
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="name@example.com or 98xxxxxxxx"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••••"
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.link} onPress={() => navigation.navigate("ForgotPassword")}>
            Forgot password?
          </Text>

          <Button label={isSubmitting ? "Logging in..." : "Login"} onPress={handleSubmit} loading={isSubmitting} size="lg" />

          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
              Create an account
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  brandDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accentMid,
    marginRight: 8,
  },
  brandText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    color: colors.textSecondary,
  },
  form: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  error: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.dangerText,
  },
  link: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.accentMid,
    textAlign: "right",
  },
  footerText: {
    marginTop: spacing.sm,
    textAlign: "center",
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
