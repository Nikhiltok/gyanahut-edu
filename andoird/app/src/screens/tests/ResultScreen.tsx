import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { getResult } from "../../api/attempts";
import { Card } from "../../components/ui/Card";
import { Chip } from "../../components/ui/Chip";
import { GradientHero } from "../../components/ui/GradientHero";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { ProgressRing } from "../../components/ui/ProgressRing";
import { Screen } from "../../components/layout/Screen";
import { TopBar } from "../../components/layout/TopBar";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Result">;

export function ResultScreen({ route, navigation }: Props) {
  const { attemptId } = route.params;
  const { data: result, isLoading } = useQuery({ queryKey: ["result", attemptId], queryFn: () => getResult(attemptId) });

  return (
    <Screen>
      <TopBar title="Test Result" onBack={() => navigation.popToTop()} />
      <ScrollView contentContainerStyle={styles.container}>
        {isLoading || !result ? (
          <Text style={styles.hint}>Loading result…</Text>
        ) : (
          <>
            <GradientHero style={styles.hero}>
              <Text style={styles.heroTitle}>{result.test_title}</Text>
              <Text style={styles.heroSubtitle}>
                Completed {new Date(result.submitted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </Text>
              <View style={styles.heroRow}>
                <ProgressRing
                  size={76}
                  strokeWidth={7}
                  progress={result.score / Math.max(Number(result.total_marks), 1)}
                  label={String(Math.round(result.score))}
                  sublabel={`/ ${result.total_marks}`}
                />
                <View style={styles.heroStatsCol}>
                  <Text style={styles.heroStat}>Accuracy {Math.round(result.accuracy)}%</Text>
                  {result.total_candidates > 0 ? (
                    <Text style={styles.heroStatSub}>
                      Faster than {Math.round(((result.total_candidates - (result.rank ?? result.total_candidates)) / result.total_candidates) * 100)}% of students
                    </Text>
                  ) : null}
                </View>
              </View>
            </GradientHero>

            <View style={styles.metaRow}>
              <Card style={styles.metaCard}>
                <Text style={styles.metaLabel}>Rank</Text>
                <Text style={styles.metaValue}>{result.rank ? `#${result.rank}` : "—"}</Text>
              </Card>
              <Card style={styles.metaCard}>
                <Text style={styles.metaLabel}>Time taken</Text>
                <Text style={styles.metaValue}>{Math.round(result.time_taken / 60)} min</Text>
              </Card>
            </View>

            <Card style={styles.sectionCard}>
              <Text style={styles.sectionLabel}>Correct · Wrong · Skipped</Text>
              <Text style={styles.sectionValue}>
                {result.correct_answers} · {result.wrong_answers} · {result.skipped_answers}
              </Text>
            </Card>

            {result.subject_breakdown.length > 0 ? (
              <Card style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Subject breakdown</Text>
                {result.subject_breakdown.map((subject) => {
                  const pct = subject.total > 0 ? subject.correct / subject.total : 0;
                  return (
                    <View key={subject.subject} style={styles.subjectRow}>
                      <View style={styles.subjectHeader}>
                        <Text style={styles.subjectName}>{subject.subject}</Text>
                        <Text style={styles.subjectPct}>{Math.round(pct * 100)}%</Text>
                      </View>
                      <ProgressBar progress={pct} color={pct >= 0.6 ? colors.success : "#E8A23A"} />
                    </View>
                  );
                })}
              </Card>
            ) : null}

            <Text style={styles.sectionTitleStandalone}>Question-wise analysis</Text>
            {result.answers.map((answer, index) => (
              <Card key={answer.id} style={styles.answerRow}>
                <Text style={styles.answerText} numberOfLines={1}>
                  {index + 1}. {answer.question_text}
                </Text>
                <Chip
                  label={answer.selected_option === null ? "Skipped" : answer.is_correct ? "Correct" : "Wrong"}
                  variant={answer.selected_option === null ? "neutral" : answer.is_correct ? "success" : "danger"}
                />
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, paddingBottom: spacing.xl },
  hint: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textSecondary, textAlign: "center", marginTop: spacing.xl },
  hero: { marginBottom: spacing.md },
  heroTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.base, color: colors.accentTextStrong },
  heroSubtitle: { marginTop: 2, fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.accentMuted },
  heroRow: { marginTop: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md },
  heroStatsCol: { flex: 1 },
  heroStat: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.accentTextStrong },
  heroStatSub: { marginTop: 4, fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.accentMuted },
  metaRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  metaCard: { flex: 1, backgroundColor: colors.surfaceMuted, padding: spacing.md, borderRadius: 16 },
  metaLabel: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  metaValue: { marginTop: 6, fontFamily: fontFamily.medium, fontSize: fontSize.lg, color: colors.textPrimary },
  sectionCard: { padding: spacing.md, marginBottom: spacing.md },
  sectionLabel: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  sectionValue: { marginTop: 4, fontFamily: fontFamily.bold, fontSize: fontSize.base, color: colors.textPrimary },
  sectionTitle: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.textPrimary, marginBottom: spacing.sm },
  sectionTitleStandalone: { fontFamily: fontFamily.medium, fontSize: fontSize.md, color: colors.textPrimary, marginBottom: spacing.sm },
  subjectRow: { marginBottom: 12 },
  subjectHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  subjectName: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  subjectPct: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.textPrimary },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  answerText: { flex: 1, marginRight: 10, fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary },
});
