import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { BookOpenCheck, Sparkles, TrendingUp } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { getChapters, getExams, getSubjects, getTopics } from "../../api/exam";
import { generatePracticeTest } from "../../api/tests";
import { getErrorMessage } from "../../api/error";
import { Card } from "../../components/ui/Card";
import { GradientHero } from "../../components/ui/GradientHero";
import { PickerField } from "../../components/ui/PickerField";
import { TextField } from "../../components/ui/TextField";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { radius, spacing } from "../../theme/spacing";
import type { MainTabParamList, RootStackParamList } from "../../navigation/types";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Practice">,
  NativeStackScreenProps<RootStackParamList>
>;

const QUESTION_COUNTS = [10, 20, 50, 100];

export function PracticeGenerateScreen({ navigation }: Props) {
  const [examId, setExamId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [questionCount, setQuestionCount] = useState(20);
  const [duration, setDuration] = useState("60");
  const [generating, setGenerating] = useState(false);

  const { data: exams } = useQuery({ queryKey: ["exams"], queryFn: () => getExams() });
  const { data: subjects } = useQuery({
    queryKey: ["subjects", examId],
    queryFn: () => getSubjects(examId),
    enabled: !!examId,
  });
  const { data: chapters } = useQuery({
    queryKey: ["chapters", subjectId],
    queryFn: () => getChapters(subjectId),
    enabled: !!subjectId,
  });
  const { data: topics } = useQuery({
    queryKey: ["topics", chapterId],
    queryFn: () => getTopics(chapterId),
    enabled: !!chapterId,
  });

  async function handleGenerate() {
    if (!examId) {
      Alert.alert("Pick an exam", "Choose an exam type to generate your practice set.");
      return;
    }
    setGenerating(true);
    try {
      const test = await generatePracticeTest({
        exam: examId,
        subject: subjectId || undefined,
        chapter: chapterId || undefined,
        topic: topicId || undefined,
        question_count: questionCount,
        duration: Number(duration) || 60,
      });
      navigation.navigate("ExamTaking", { testId: test.id });
    } catch (err) {
      Alert.alert("Could not generate test", getErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Infinite Test</Text>

      <GradientHero variant="cool" style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={styles.heroIcon}>
            <BookOpenCheck size={20} color="#2E5A22" />
          </View>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroTitle}>Build your own set</Text>
            <Text style={styles.heroSubtitle}>AI picks questions from your weak spots</Text>
          </View>
        </View>
      </GradientHero>

      <Text style={styles.sectionLabel}>Scope</Text>
      <View style={styles.pickerStack}>
        <PickerField
          label="Exam type"
          placeholder="Choose an exam"
          value={examId}
          options={(exams ?? []).map((e) => ({ label: e.name, value: e.id }))}
          onChange={(value) => {
            setExamId(value);
            setSubjectId("");
            setChapterId("");
            setTopicId("");
          }}
        />
        <PickerField
          label="Subject (or full exam)"
          placeholder="All subjects"
          value={subjectId}
          options={(subjects ?? []).map((s) => ({ label: s.name, value: s.id }))}
          onChange={(value) => {
            setSubjectId(value);
            setChapterId("");
            setTopicId("");
          }}
          disabled={!examId}
        />
        <PickerField
          label="Chapter (or full subject)"
          placeholder="All chapters"
          value={chapterId}
          options={(chapters ?? []).map((c) => ({ label: c.name, value: c.id }))}
          onChange={(value) => {
            setChapterId(value);
            setTopicId("");
          }}
          disabled={!subjectId}
        />
        <PickerField
          label="Topic (or full chapter)"
          placeholder="All topics"
          value={topicId}
          options={(topics ?? []).map((t) => ({ label: t.name, value: t.id }))}
          onChange={setTopicId}
          disabled={!chapterId}
        />
      </View>

      <Text style={styles.sectionLabel}>Number of questions</Text>
      <View style={styles.pillRow}>
        {QUESTION_COUNTS.map((count) => (
          <Pressable
            key={count}
            onPress={() => setQuestionCount(count)}
            style={[styles.countPill, questionCount === count && styles.countPillActive]}
          >
            <Text style={[styles.countPillText, questionCount === count && styles.countPillTextActive]}>{count}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Duration (minutes)</Text>
      <View style={styles.durationRow}>
        <TextField label="" value={duration} onChangeText={setDuration} keyboardType="number-pad" />
      </View>
      <Text style={styles.hint}>~{(Number(duration) / Math.max(questionCount, 1)).toFixed(1)} min / question</Text>

      <Pressable style={styles.generateButton} onPress={handleGenerate} disabled={generating}>
        <Text style={styles.generateButtonText}>{generating ? "Generating…" : "Generate infinite test"}</Text>
      </Pressable>

      <Card style={styles.infoCard}>
        <View style={[styles.infoIcon, { backgroundColor: colors.accentChip }]}>
          <Sparkles size={18} color={colors.accentText} />
        </View>
        <View style={styles.infoTextCol}>
          <Text style={styles.infoTitle}>AI smart selection</Text>
          <Text style={styles.infoSubtitle}>Adaptive picks for weak spots</Text>
        </View>
      </Card>
      <Card style={styles.infoCard}>
        <View style={[styles.infoIcon, { backgroundColor: "#D9E7D2" }]}>
          <TrendingUp size={18} color="#2E5A22" />
        </View>
        <View style={styles.infoTextCol}>
          <Text style={styles.infoTitle}>Instant performance</Text>
          <Text style={styles.infoSubtitle}>Results the moment you submit</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: spacing.md, paddingTop: 56, paddingBottom: spacing.xl },
  title: { fontFamily: fontFamily.medium, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: spacing.md },
  hero: { marginBottom: spacing.lg, padding: 16 },
  heroRow: { flexDirection: "row", alignItems: "center" },
  heroIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", marginRight: 12 },
  heroTextCol: { flex: 1 },
  heroTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.base, color: "#1F3A18" },
  heroSubtitle: { marginTop: 2, fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: "#2E5A22" },
  sectionLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 8, marginTop: spacing.sm },
  pickerStack: { gap: 10, marginBottom: spacing.sm },
  pillRow: { flexDirection: "row", gap: 10, marginBottom: spacing.sm },
  countPill: { flex: 1, height: 38, borderRadius: radius.pill, borderWidth: 1.1, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" },
  countPillActive: { backgroundColor: colors.accentChip, borderColor: colors.accentChip },
  countPillText: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary },
  countPillTextActive: { fontFamily: fontFamily.bold, color: colors.accentTextStrong },
  durationRow: { marginBottom: 4 },
  hint: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.lg },
  generateButton: { backgroundColor: colors.accentChip, borderRadius: radius.pill, height: 52, alignItems: "center", justifyContent: "center", marginBottom: spacing.lg },
  generateButtonText: { fontFamily: fontFamily.medium, fontSize: fontSize.md, color: colors.accentText },
  infoCard: { flexDirection: "row", alignItems: "center", padding: spacing.md, marginBottom: spacing.sm },
  infoIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 12 },
  infoTextCol: { flex: 1 },
  infoTitle: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.textPrimary },
  infoSubtitle: { marginTop: 2, fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.textSecondary },
});
