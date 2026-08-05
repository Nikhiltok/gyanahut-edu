import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { getLiveTests, getUpcomingTests } from "../../api/tests";
import { Card } from "../../components/ui/Card";
import { Chip } from "../../components/ui/Chip";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { radius, spacing } from "../../theme/spacing";
import type { MainTabParamList, RootStackParamList } from "../../navigation/types";
import type { Test } from "../../types/test";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Tests">,
  NativeStackScreenProps<RootStackParamList>
>;

export function TestsScreen({ navigation }: Props) {
  const [tab, setTab] = useState<"live" | "upcoming">("live");

  const { data: liveTests, isLoading: liveLoading } = useQuery({
    queryKey: ["live-tests"],
    queryFn: getLiveTests,
    enabled: tab === "live",
  });
  const { data: upcomingTests, isLoading: upcomingLoading } = useQuery({
    queryKey: ["upcoming-tests"],
    queryFn: getUpcomingTests,
    enabled: tab === "upcoming",
  });

  const tests = tab === "live" ? liveTests : upcomingTests;
  const isLoading = tab === "live" ? liveLoading : upcomingLoading;

  return (
    <View style={styles.flex}>
      <Text style={styles.title}>Tests</Text>

      <View style={styles.segment}>
        <Pressable
          style={[styles.segmentItem, tab === "live" && styles.segmentItemActive]}
          onPress={() => setTab("live")}
        >
          <Text style={[styles.segmentText, tab === "live" && styles.segmentTextActive]}>Live</Text>
        </Pressable>
        <Pressable
          style={[styles.segmentItem, tab === "upcoming" && styles.segmentItemActive]}
          onPress={() => setTab("upcoming")}
        >
          <Text style={[styles.segmentText, tab === "upcoming" && styles.segmentTextActive]}>Upcoming</Text>
        </Pressable>
      </View>

      <FlatList
        data={tests ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !isLoading ? <Text style={styles.hint}>No {tab} tests right now.</Text> : null
        }
        renderItem={({ item }) => (
          <TestCard test={item} tab={tab} onPress={() => navigation.navigate("ExamTaking", { testId: item.id })} />
        )}
      />
    </View>
  );
}

function TestCard({ test, tab, onPress }: { test: Test; tab: "live" | "upcoming"; onPress: () => void }) {
  return (
    <Card style={styles.testCard}>
      <View style={styles.testCardHeader}>
        <Chip label={tab === "live" ? "Live" : "Upcoming"} variant={tab === "live" ? "danger" : "warning"} />
      </View>
      <Text style={styles.testTitle}>{test.title}</Text>
      <Text style={styles.testMeta}>
        {test.total_questions} Qs · {test.duration} min
      </Text>
      <View style={styles.testFooter}>
        <Chip label={test.is_paid ? `${test.credit_cost} credits` : "Free"} variant={test.is_paid ? "accent" : "success"} />
        <Pressable style={styles.attemptButton} onPress={onPress}>
          <Text style={styles.attemptButtonText}>{tab === "live" ? "Attempt" : "Details"}</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg, paddingTop: 56 },
  title: { paddingHorizontal: spacing.md, fontFamily: fontFamily.medium, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: spacing.sm },
  segment: { flexDirection: "row", marginHorizontal: spacing.md, backgroundColor: colors.surfaceMuted, borderRadius: radius.pill, padding: 4, marginBottom: spacing.md },
  segmentItem: { flex: 1, paddingVertical: 8, borderRadius: radius.pill, alignItems: "center" },
  segmentItemActive: { backgroundColor: colors.accentChip },
  segmentText: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textSecondary },
  segmentTextActive: { fontFamily: fontFamily.bold, color: colors.accentTextStrong },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  hint: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textSecondary, textAlign: "center", marginTop: spacing.xl },
  testCard: { padding: spacing.md },
  testCardHeader: { flexDirection: "row", justifyContent: "space-between" },
  testTitle: { marginTop: 10, fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.textPrimary },
  testMeta: { marginTop: 4, fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  testFooter: { marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  attemptButton: { backgroundColor: colors.accentChip, borderRadius: radius.pill, paddingHorizontal: 20, paddingVertical: 8 },
  attemptButtonText: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.accentText },
});
