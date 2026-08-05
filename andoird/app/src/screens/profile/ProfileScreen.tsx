import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, ChevronRight, ClipboardX, History, LogOut, Wallet as WalletIcon, XCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { changePassword, getProfile, logout, updateProfile } from "../../api/auth";
import { getErrorMessage } from "../../api/error";
import { Button } from "../../components/ui/Button";
import { Chip } from "../../components/ui/Chip";
import { GradientHero } from "../../components/ui/GradientHero";
import { TextField } from "../../components/ui/TextField";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { radius, spacing } from "../../theme/spacing";
import type { MainTabParamList, RootStackParamList } from "../../navigation/types";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Profile">,
  NativeStackScreenProps<RootStackParamList>
>;

export function ProfileScreen({ navigation }: Props) {
  const { signOut } = useAuth();
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name);
    setLastName(profile.last_name);
    setPhone(profile.phone);
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: () => updateProfile({ first_name: firstName, last_name: lastName, phone }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      Alert.alert("Saved", "Your profile has been updated.");
    },
    onError: (err) => Alert.alert("Could not save", getErrorMessage(err)),
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordMutation = useMutation({
    mutationFn: () => changePassword({ old_password: oldPassword, new_password: newPassword }),
    onSuccess: () => {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Password updated");
    },
    onError: (err) => Alert.alert("Could not update password", getErrorMessage(err)),
  });

  function handlePasswordSubmit() {
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords don't match");
      return;
    }
    passwordMutation.mutate();
  }

  async function handleLogout() {
    await logout();
    signOut();
  }

  const initials = profile ? `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() : "";

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <GradientHero style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroName}>{profile?.name}</Text>
            <Text style={styles.heroSubtitle}>{profile?.target_exams?.map((e) => e.name).join(" · ") || "No target exams set"}</Text>
          </View>
        </View>
      </GradientHero>

      <View style={styles.badgeRow}>
        <Chip label={profile?.email_verified ? "✓ Email verified" : "Email unverified"} variant={profile?.email_verified ? "accent" : "neutral"} />
        <Chip label={profile?.phone_verified ? "✓ Phone verified" : "Phone unverified"} variant={profile?.phone_verified ? "accent" : "neutral"} />
      </View>

      <View style={styles.menuList}>
        <MenuRow icon={History} label="Exam history" onPress={() => navigation.navigate("ExamHistory")} />
        <MenuRow icon={Bookmark} label="Bookmarks" onPress={() => navigation.navigate("Bookmarks")} />
        <MenuRow icon={XCircle} label="Wrong questions" onPress={() => navigation.navigate("RevisionWrong", { type: "wrong" })} />
        <MenuRow icon={ClipboardX} label="Difficult questions" onPress={() => navigation.navigate("RevisionDifficult", { type: "difficult" })} />
        <MenuRow icon={WalletIcon} label="Wallet" onPress={() => navigation.navigate("Wallet")} />
      </View>

      <Text style={styles.sectionTitle}>Personal details</Text>
      <View style={styles.form}>
        <TextField label="First name" value={firstName} onChangeText={setFirstName} />
        <TextField label="Last name" value={lastName} onChangeText={setLastName} />
        <TextField label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Button label={saveMutation.isPending ? "Saving..." : "Save changes"} onPress={() => saveMutation.mutate()} loading={saveMutation.isPending} size="lg" />
      </View>

      <Text style={styles.sectionTitle}>Change password</Text>
      <View style={styles.form}>
        <TextField label="Current password" value={oldPassword} onChangeText={setOldPassword} secureTextEntry />
        <TextField label="New password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
        <TextField label="Confirm new password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        <Button
          label={passwordMutation.isPending ? "Updating..." : "Update password"}
          onPress={handlePasswordSubmit}
          loading={passwordMutation.isPending}
          size="lg"
        />
      </View>

      <Pressable style={styles.logoutRow} onPress={handleLogout}>
        <LogOut size={18} color={colors.dangerText} />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

function MenuRow({ icon: Icon, label, onPress }: { icon: typeof History; label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuIconWrap}>
        <Icon size={16} color={colors.accentMid} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <ChevronRight size={16} color={colors.textHint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.md, paddingTop: 56, paddingBottom: spacing.xl },
  title: { fontFamily: fontFamily.medium, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: spacing.md },
  hero: { marginBottom: spacing.sm },
  heroRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", marginRight: 14 },
  avatarText: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.accentTextStrong },
  heroTextCol: { flex: 1 },
  heroName: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.accentTextStrong },
  heroSubtitle: { marginTop: 3, fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.accentMuted },
  badgeRow: { flexDirection: "row", gap: 8, marginBottom: spacing.md },
  menuList: { backgroundColor: colors.surface, borderRadius: radius.lg, marginBottom: spacing.lg, overflow: "hidden" },
  menuRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIconWrap: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surfaceMuted2, alignItems: "center", justifyContent: "center", marginRight: 12 },
  menuLabel: { flex: 1, fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary },
  sectionTitle: { fontFamily: fontFamily.medium, fontSize: fontSize.md, color: colors.textPrimary, marginBottom: spacing.sm },
  form: { gap: spacing.sm, marginBottom: spacing.lg },
  logoutRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: spacing.md },
  logoutText: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.dangerText },
});
