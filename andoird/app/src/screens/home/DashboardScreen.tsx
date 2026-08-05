import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { BookOpenCheck, ClipboardList, TrendingUp } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { getDashboardStats, getPerformanceGraph } from "../../api/analytics";
import { getProfile } from "../../api/auth";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { GradientHero } from "../../components/ui/GradientHero";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { ProgressRing } from "../../components/ui/ProgressRing";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { radius, spacing } from "../../theme/spacing";
import type { MainTabParamList, RootStackParamList } from "../../navigation/types";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

export function DashboardScreen({ navigation }: Props) {
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: stats } = useQuery({ queryKey: ["dashboard-stats"], queryFn: getDashboardStats });
  const { data: performance } = useQuery({ queryKey: ["performance-graph"], queryFn: getPerformanceGraph });

  const targetExams = profile?.target_exams?.map((e) => e.name).join(" · ");
  const accuracy = stats ? stats.accuracy / 100 : 0;
  const inProgress = stats?.in_progress_attempt ?? null;
  const progressPct = inProgress ? inProgress.current_question_index / Math.max(inProgress.total_questions, 1) : 0;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.brandTitle}>Gyanahut Edu</Text>

      <GradientHero style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroTitle}>Welcome back{profile ? `, ${profile.first_name}` : ""}</Text>
            {targetExams ? <Text style={styles.heroSubtitle}>Target: {targetExams}</Text> : null}
            <View style={styles.streakPill}>
              <Text style={styles.streakText}>{stats?.day_streak ?? 0} day streak</Text>
            </View>
          </View>
          <ProgressRing size={68} strokeWidth={6} progress={accuracy} label={`${stats?.accuracy ?? 0}%`} sublabel="accuracy" />
        </View>
      </GradientHero>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: colors.accentChip }]}>
            <ClipboardList size={18} color={colors.textPrimary} />
          </View>
          <Text style={styles.statValue}>{stats?.tests_attempted ?? "—"}</Text>
          <Text style={styles.statLabel}>Tests</Text>
        </Card>
        <Card style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: "#D9E7D2" }]}>
            <BookOpenCheck size={18} color={colors.textPrimary} />
          </View>
          <Text style={styles.statValue}>{stats?.day_streak ?? "—"}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </Card>
        <Card style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: "#D9E3F5" }]}>
            <TrendingUp size={18} color={colors.textPrimary} />
          </View>
          <Text style={styles.statValue}>{stats ? Math.round(stats.average_score) : "—"}</Text>
          <Text style={styles.statLabel}>Avg score</Text>
        </Card>
      </View>

      {inProgress ? (
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Jump back in</Text>
          <Text style={styles.sectionSubtitle}>{inProgress.test_title}</Text>
          <ProgressBar progress={progressPct} />
          <View style={styles.jumpBackRow}>
            <Text style={styles.hintText}>
              Question {inProgress.current_question_index} of {inProgress.total_questions}
            </Text>
            <Button
              label="Resume"
              size="sm"
              onPress={() => navigation.navigate("ExamTaking", { testId: inProgress.test_id })}
            />
          </View>
        </Card>
      ) : null}

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Performance trend</Text>
        <View style={styles.trendRow}>
          {(performance ?? []).slice(-7).map((point, index) => (
            <View
              key={index}
              style={[styles.trendBar, { height: 8 + Math.min(point.score, 60) }]}
            />
          ))}
          {!performance || performance.length === 0 ? <Text style={styles.hintText}>No attempts yet.</Text> : null}
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.md, paddingBottom: spacing.xl },
  brandTitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  hero: { marginBottom: spacing.md },
  heroRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  heroTextCol: { flex: 1, paddingRight: spacing.md },
  heroTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.accentTextStrong },
  heroSubtitle: { marginTop: 4, fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.accentMuted },
  streakPill: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  streakText: { fontFamily: fontFamily.medium, fontSize: 10.5, color: colors.accentTextStrong },
  statsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  statCard: { flex: 1, alignItems: "center", paddingVertical: spacing.md },
  statIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  statValue: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.textPrimary },
  statLabel: { marginTop: 2, fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.textSecondary },
  sectionCard: { padding: spacing.md, marginBottom: spacing.md },
  sectionTitle: { fontFamily: fontFamily.medium, fontSize: fontSize.md, color: colors.textPrimary },
  sectionSubtitle: { marginTop: 4, marginBottom: 10, fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textSecondary },
  jumpBackRow: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  hintText: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  trendRow: { marginTop: 12, flexDirection: "row", alignItems: "flex-end", gap: 6, height: 70 },
  trendBar: { flex: 1, backgroundColor: colors.accentChip, borderRadius: 4 },
});
