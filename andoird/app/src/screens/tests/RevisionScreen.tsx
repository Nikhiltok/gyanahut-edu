import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { getDifficultQuestions, getWrongQuestions } from "../../api/attempts";
import { Card } from "../../components/ui/Card";
import { Chip } from "../../components/ui/Chip";
import { Screen } from "../../components/layout/Screen";
import { TopBar } from "../../components/layout/TopBar";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "RevisionWrong" | "RevisionDifficult">;

export function RevisionScreen({ route, navigation }: Props) {
  const isWrong = route.params.type === "wrong";
  const { data: questions, isLoading } = useQuery({
    queryKey: [isWrong ? "revision-wrong" : "revision-difficult"],
    queryFn: isWrong ? getWrongQuestions : getDifficultQuestions,
  });

  return (
    <Screen>
      <TopBar title={isWrong ? "Wrong Questions" : "Difficult Questions"} onBack={() => navigation.goBack()} />
      <FlatList
        data={questions ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!isLoading ? <Text style={styles.hint}>Nothing here yet.</Text> : null}
        renderItem={({ item }) => (
          <Card style={styles.row}>
            <Chip label={item.topic_name} variant="neutral" />
            <Text style={styles.questionText}>{item.question_text}</Text>
            <View style={styles.options}>
              {item.options.map((option, index) => (
                <View key={option.id} style={[styles.optionRow, option.is_correct && styles.optionRowCorrect]}>
                  <Text style={[styles.optionText, option.is_correct && styles.optionTextCorrect]}>
                    {String.fromCharCode(65 + index)}. {option.option_text}
                  </Text>
                </View>
              ))}
            </View>
            {item.explanation ? <Text style={styles.explanation}>{item.explanation}</Text> : null}
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, gap: spacing.sm },
  hint: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textSecondary, textAlign: "center", marginTop: spacing.xl },
  row: { padding: spacing.md, marginBottom: spacing.sm },
  questionText: { marginTop: 10, fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary },
  options: { marginTop: 10, gap: 6 },
  optionRow: { borderRadius: 8, borderWidth: 1, borderColor: colors.border, padding: 10 },
  optionRowCorrect: { backgroundColor: colors.successBg, borderColor: colors.successBg },
  optionText: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textPrimary },
  optionTextCorrect: { fontFamily: fontFamily.medium, color: colors.successText },
  explanation: { marginTop: 10, fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textSecondary },
});
