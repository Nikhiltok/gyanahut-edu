import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { getMyAttempts } from "../../api/attempts";
import { Card } from "../../components/ui/Card";
import { Screen } from "../../components/layout/Screen";
import { TopBar } from "../../components/layout/TopBar";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ExamHistory">;

export function ExamHistoryScreen({ navigation }: Props) {
  const { data: attempts, isLoading } = useQuery({ queryKey: ["my-attempts"], queryFn: () => getMyAttempts() });

  return (
    <Screen>
      <TopBar title="Exam History" onBack={() => navigation.goBack()} />
      <FlatList
        data={attempts ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!isLoading ? <Text style={styles.hint}>No attempts yet.</Text> : null}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate("Result", { attemptId: item.id })}>
            <Card style={styles.row}>
              <View style={styles.rowTextCol}>
                <Text style={styles.rowTitle}>{item.test_title}</Text>
                <Text style={styles.rowMeta}>
                  {item.exam_name} · {new Date(item.submitted_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </Text>
              </View>
              <Text style={styles.rowScore}>{Math.round(item.accuracy)}%</Text>
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, gap: spacing.sm },
  hint: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textSecondary, textAlign: "center", marginTop: spacing.xl },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: spacing.md, marginBottom: spacing.sm },
  rowTextCol: { flex: 1, marginRight: spacing.sm },
  rowTitle: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.textPrimary },
  rowMeta: { marginTop: 4, fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  rowScore: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.success },
});
