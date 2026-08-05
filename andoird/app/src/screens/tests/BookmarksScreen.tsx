import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { getBookmarks, removeBookmark } from "../../api/bookmarks";
import { Card } from "../../components/ui/Card";
import { Chip } from "../../components/ui/Chip";
import { Screen } from "../../components/layout/Screen";
import { TopBar } from "../../components/layout/TopBar";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { spacing } from "../../theme/spacing";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Bookmarks">;

export function BookmarksScreen({ navigation }: Props) {
  const queryClient = useQueryClient();
  const { data: bookmarks, isLoading } = useQuery({ queryKey: ["bookmarks"], queryFn: getBookmarks });

  const removeMutation = useMutation({
    mutationFn: removeBookmark,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });

  return (
    <Screen>
      <TopBar title="Bookmarks" onBack={() => navigation.goBack()} />
      <FlatList
        data={bookmarks ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!isLoading ? <Text style={styles.hint}>No bookmarked questions yet.</Text> : null}
        renderItem={({ item }) => (
          <Card style={styles.row}>
            <View style={styles.rowHeader}>
              <Chip label={item.question_detail.topic_name} variant="neutral" />
              <Pressable onPress={() => removeMutation.mutate(item.id)}>
                <Text style={styles.removeLink}>Remove</Text>
              </Pressable>
            </View>
            <Text style={styles.questionText}>{item.question_detail.question_text}</Text>
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
  rowHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  removeLink: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.dangerText },
  questionText: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textPrimary },
});
