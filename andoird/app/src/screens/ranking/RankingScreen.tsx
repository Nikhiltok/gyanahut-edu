import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { getGlobalLeaderboard } from "../../api/leaderboard";
import { getProfile } from "../../api/auth";
import { GradientHero } from "../../components/ui/GradientHero";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { radius, spacing } from "../../theme/spacing";

const MEDAL_COLORS = [colors.gold, colors.silver, colors.bronze];

export function RankingScreen() {
  const [period, setPeriod] = useState<"all" | "weekly" | "monthly">("all");
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard", period],
    queryFn: () => getGlobalLeaderboard(period === "all" ? undefined : period),
  });

  const myEntry = leaderboard?.find((e) => e.student === profile?.id);

  return (
    <View style={styles.flex}>
      <Text style={styles.title}>Ranking</Text>

      <GradientHero style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.trophyWrap}>
            <Trophy size={24} color="#3A2205" />
          </View>
          <View>
            <Text style={styles.heroLabel}>NATIONAL LEAGUE</Text>
            <Text style={styles.heroRank}>{myEntry ? `#${myEntry.rank}` : "Unranked"}</Text>
            {leaderboard ? (
              <Text style={styles.heroSub}>of {leaderboard.length} · Top {leaderboard.length ? Math.max(1, Math.round((1 - (myEntry?.rank ?? leaderboard.length) / leaderboard.length) * 100)) : 0}%</Text>
            ) : null}
          </View>
        </View>
      </GradientHero>

      <View style={styles.filterRow}>
        {(["all", "weekly", "monthly"] as const).map((value) => (
          <Pressable
            key={value}
            onPress={() => setPeriod(value)}
            style={[styles.filterPill, period === value && styles.filterPillActive]}
          >
            <Text style={[styles.filterText, period === value && styles.filterTextActive]}>
              {value === "all" ? "All time" : value === "weekly" ? "Weekly" : "Monthly"}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={leaderboard ?? []}
        keyExtractor={(item) => item.student}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!isLoading ? <Text style={styles.hint}>No ranking data yet.</Text> : null}
        renderItem={({ item, index }) => (
          <View style={[styles.row, item.student === profile?.id && styles.rowSelf]}>
            <View style={[styles.rankBadge, index < 3 && { backgroundColor: MEDAL_COLORS[index] }]}>
              <Text style={styles.rankBadgeText}>{item.rank}</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.rowName} numberOfLines={1}>
              {item.student === profile?.id ? "You" : item.name}
            </Text>
            <Text style={styles.rowScore}>{item.total_score}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg, paddingTop: 56 },
  title: { paddingHorizontal: spacing.md, fontFamily: fontFamily.medium, fontSize: fontSize.xl, color: colors.textPrimary, marginBottom: spacing.md },
  hero: { marginHorizontal: spacing.md, marginBottom: spacing.md },
  heroTop: { flexDirection: "row", alignItems: "center", gap: 14 },
  trophyWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.5)", alignItems: "center", justifyContent: "center" },
  heroLabel: { fontFamily: fontFamily.bold, fontSize: 9.5, color: colors.accentTextStrong, letterSpacing: 0.5 },
  heroRank: { marginTop: 4, fontFamily: fontFamily.bold, fontSize: 24, color: colors.accentTextStrong },
  heroSub: { marginTop: 2, fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.accentMuted },
  filterRow: { flexDirection: "row", gap: 8, paddingHorizontal: spacing.md, marginBottom: spacing.md },
  filterPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.surfaceMuted },
  filterPillActive: { backgroundColor: colors.accentChip },
  filterText: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  filterTextActive: { fontFamily: fontFamily.medium, color: colors.accentText },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  hint: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textSecondary, textAlign: "center", marginTop: spacing.xl },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surfaceMuted, borderRadius: 12, padding: 12, marginBottom: 8 },
  rowSelf: { backgroundColor: colors.accentChip },
  rankBadge: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.3, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  rankBadgeText: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.textSecondary },
  avatar: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.surfaceMuted2, alignItems: "center", justifyContent: "center", marginLeft: 10 },
  avatarText: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.accentMid },
  rowName: { flex: 1, marginLeft: 10, fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.textPrimary },
  rowScore: { fontFamily: fontFamily.mono, fontSize: fontSize.base, fontWeight: "600", color: colors.textPrimary },
});
