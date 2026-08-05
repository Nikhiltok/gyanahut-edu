import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { saveProgress, startTest, submitTest } from "../../api/tests";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { radius, spacing } from "../../theme/spacing";
import type { RootStackParamList } from "../../navigation/types";
import type { PublicQuestion } from "../../types/test";

type Props = NativeStackScreenProps<RootStackParamList, "ExamTaking">;

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ExamTakingScreen({ route, navigation }: Props) {
  const { testId } = route.params;
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    startTest(testId).then((result) => {
      if (!mounted) return;
      setAttemptId(result.attempt_id);
      setQuestions(result.questions);
      setAnswers(result.answers as Record<string, string | null>);
      setCurrentIndex(result.current_question_index);
      setRemainingSeconds(result.remaining_seconds);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [testId]);

  const handleSubmit = useCallback(async () => {
    if (!attemptId || submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const answerList = questions.map((q) => ({ question: q.id, option: answers[q.id] ?? null }));
      const result = await submitTest(testId, { attempt_id: attemptId, answers: answerList });
      navigation.replace("Result", { attemptId: result.attempt_id });
    } catch {
      submittedRef.current = false;
      setSubmitting(false);
      Alert.alert("Could not submit", "Please check your connection and try again.");
    }
  }, [attemptId, answers, questions, testId, navigation]);

  useEffect(() => {
    if (loading || remainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, remainingSeconds > 0, handleSubmit]);

  const currentQuestion = questions[currentIndex];
  const answeredCount = useMemo(() => Object.values(answers).filter((v) => v).length, [answers]);

  function selectOption(optionId: string) {
    if (!currentQuestion || !attemptId) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
    saveProgress(testId, attemptId, {
      question: currentQuestion.id,
      option: optionId,
      current_question_index: currentIndex,
    }).catch(() => {});
  }

  function goTo(index: number) {
    setCurrentIndex(Math.max(0, Math.min(index, questions.length - 1)));
  }

  if (loading || !currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.hint}>Loading test…</Text>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Question {currentIndex + 1} of {questions.length}
          </Text>
          <Text style={styles.headerSubtitle}>Answered: {answeredCount}</Text>
        </View>
        <View style={styles.timerPill}>
          <Text style={styles.timerText}>{formatTime(remainingSeconds)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.metaRow}>
          <View style={styles.qBadge}>
            <Text style={styles.qBadgeText}>Q.{currentIndex + 1}</Text>
          </View>
          <View style={styles.diffBadge}>
            <Text style={styles.diffBadgeText}>{currentQuestion.difficulty}</Text>
          </View>
        </View>

        <Text style={styles.questionText}>{currentQuestion.question_text}</Text>

        <View style={styles.options}>
          {currentQuestion.options.map((option, index) => {
            const selected = answers[currentQuestion.id] === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => selectOption(option.id)}
                style={[styles.optionRow, selected && styles.optionRowSelected]}
              >
                <View style={[styles.optionLetter, selected && styles.optionLetterSelected]}>
                  <Text style={[styles.optionLetterText, selected && styles.optionLetterTextSelected]}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option.option_text}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.paletteTitle}>Question palette</Text>
        <View style={styles.palette}>
          {questions.map((q, index) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = index === currentIndex;
            return (
              <Pressable
                key={q.id}
                onPress={() => goTo(index)}
                style={[
                  styles.paletteCell,
                  isAnswered && styles.paletteCellAnswered,
                  isCurrent && styles.paletteCellCurrent,
                ]}
              >
                <Text style={[styles.paletteCellText, isCurrent && styles.paletteCellTextCurrent]}>{index + 1}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable onPress={() => goTo(currentIndex - 1)} disabled={currentIndex === 0}>
          <Text style={[styles.footerLink, currentIndex === 0 && styles.footerLinkDisabled]}>Previous</Text>
        </Pressable>
        {currentIndex === questions.length - 1 ? (
          <Pressable
            style={styles.submitButton}
            onPress={() => Alert.alert("Submit test?", "You won't be able to change your answers after this.", [
              { text: "Cancel", style: "cancel" },
              { text: "Submit", onPress: handleSubmit },
            ])}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>{submitting ? "Submitting…" : "Submit"}</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.submitButton} onPress={() => goTo(currentIndex + 1)}>
            <Text style={styles.submitButtonText}>Next</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
  hint: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textSecondary },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTextCol: { flex: 1 },
  headerTitle: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.textPrimary },
  headerSubtitle: { marginTop: 2, fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.textSecondary },
  timerPill: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: { fontFamily: fontFamily.mono, fontSize: 11, color: colors.textPrimary },
  body: { padding: spacing.md, paddingBottom: spacing.xl },
  metaRow: { flexDirection: "row", gap: 8, marginBottom: spacing.md },
  qBadge: { backgroundColor: colors.accentChip, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8 },
  qBadgeText: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.accentText },
  diffBadge: { borderWidth: 1.1, borderColor: colors.borderStrong, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8 },
  diffBadgeText: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.textSecondary },
  questionText: { fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.textPrimary, lineHeight: 22 },
  options: { marginTop: spacing.md, gap: 10 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1.2,
    borderColor: colors.border,
    padding: 14,
  },
  optionRowSelected: { backgroundColor: colors.accentChip, borderColor: colors.accentMid },
  optionLetter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.3,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionLetterSelected: { backgroundColor: colors.accentMid, borderColor: colors.accentMid },
  optionLetterText: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.textSecondary },
  optionLetterTextSelected: { color: "#FFFFFF" },
  optionText: { flex: 1, fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary },
  optionTextSelected: { fontFamily: fontFamily.medium, color: colors.accentText },
  paletteTitle: { marginTop: spacing.lg, fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.textPrimary },
  palette: { marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  paletteCell: {
    width: 40,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  paletteCellAnswered: { backgroundColor: colors.successBg, borderColor: colors.successBg },
  paletteCellCurrent: { backgroundColor: colors.accentChip, borderColor: colors.accentMid },
  paletteCellText: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.textSecondary },
  paletteCellTextCurrent: { color: colors.accentText },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  footerLink: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.accentMid },
  footerLinkDisabled: { opacity: 0.35 },
  submitButton: { backgroundColor: colors.accentChip, borderRadius: radius.pill, paddingHorizontal: 28, paddingVertical: 12 },
  submitButtonText: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.accentText },
});
