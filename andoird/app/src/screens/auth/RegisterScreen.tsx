import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { register, sendPhoneOtp } from "../../api/auth";
import { getErrorMessage } from "../../api/error";
import { Button } from "../../components/ui/Button";
import { Chip } from "../../components/ui/Chip";
import { OtpInput } from "../../components/ui/OtpInput";
import { TextField } from "../../components/ui/TextField";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSendOtp() {
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await sendPhoneOtp(phone);
      setDebugOtp(result.debug_otp ?? null);
      setStep(2);
    } catch (err) {
      setError(getErrorMessage(err, "Could not send OTP."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerify() {
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ name, email, phone, otp_code: otp, password });
      navigation.navigate("Login");
    } catch (err) {
      setError(getErrorMessage(err, "Could not verify OTP."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.stepRow}>
          <Chip label="1. Details" variant={step === 1 ? "accent" : "neutral"} />
          <Chip label="2. OTP" variant={step === 2 ? "accent" : "neutral"} />
        </View>

        {step === 1 ? (
          <>
            <Text style={styles.title}>Create an account</Text>
            <Text style={styles.subtitle}>Tell us who you are and which exams you're targeting.</Text>

            <View style={styles.form}>
              <TextField label="Full name" value={name} onChangeText={setName} placeholder="Aditi Sharma" />
              <TextField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="aditi@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextField
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                placeholder="98xxxxxxxx"
                keyboardType="phone-pad"
              />
              <TextField label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Button label={isSubmitting ? "Sending OTP..." : "Send OTP"} onPress={handleSendOtp} loading={isSubmitting} size="lg" />

              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
                  Login
                </Text>
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Verify your number</Text>
            <Text style={styles.subtitle}>We've sent a 6-digit code to {phone}.</Text>

            <View style={styles.form}>
              {debugOtp ? (
                <View style={styles.devBanner}>
                  <Text style={styles.devBannerText}>Dev mode — no SMS gateway configured. Your code is {debugOtp}.</Text>
                </View>
              ) : null}

              <OtpInput value={otp} onChange={setOtp} />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Button
                label={isSubmitting ? "Verifying..." : "Verify & create account"}
                onPress={handleVerify}
                loading={isSubmitting}
                disabled={otp.length < 6}
                size="lg"
              />

              <Text style={[styles.link, styles.centerLink]} onPress={() => setStep(1)}>
                Change mobile number
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, padding: spacing.lg, paddingTop: spacing.xl },
  stepRow: { flexDirection: "row", gap: 8, marginBottom: spacing.lg },
  title: { fontFamily: fontFamily.bold, fontSize: fontSize.xxl, color: colors.textPrimary },
  subtitle: { marginTop: 6, fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textSecondary },
  form: { marginTop: spacing.lg, gap: spacing.md },
  error: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.dangerText },
  link: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.accentMid },
  centerLink: { textAlign: "center" },
  footerText: {
    marginTop: spacing.sm,
    textAlign: "center",
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  devBanner: {
    backgroundColor: colors.successBg,
    borderRadius: 8,
    padding: 10,
  },
  devBannerText: {
    fontFamily: fontFamily.mono,
    fontSize: 10.5,
    color: colors.successText,
  },
});
