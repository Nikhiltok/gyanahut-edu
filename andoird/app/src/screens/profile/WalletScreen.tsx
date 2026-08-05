import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react-native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { getTransactions, getWallet } from "../../api/payments";
import { GradientHero } from "../../components/ui/GradientHero";
import { Screen } from "../../components/layout/Screen";
import { TopBar } from "../../components/layout/TopBar";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { radius, spacing } from "../../theme/spacing";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Wallet">;

export function WalletScreen({ navigation }: Props) {
  const { data: wallet } = useQuery({ queryKey: ["wallet"], queryFn: getWallet });
  const { data: transactions, isLoading } = useQuery({ queryKey: ["transactions"], queryFn: getTransactions });

  return (
    <Screen>
      <TopBar title="Wallet" onBack={() => navigation.goBack()} />
      <FlatList
        data={transactions ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <GradientHero style={styles.hero}>
              <View style={styles.heroRow}>
                <View>
                  <Text style={styles.heroLabel}>Current balance</Text>
                  <Text style={styles.heroBalance}>{wallet?.balance ?? "—"} credits</Text>
                </View>
                <Pressable style={styles.rechargeButton} onPress={() => navigation.navigate("Recharge")}>
                  <Text style={styles.rechargeButtonText}>Recharge</Text>
                </Pressable>
              </View>
            </GradientHero>
            <Text style={styles.sectionTitle}>Recent transactions</Text>
          </>
        }
        ListEmptyComponent={!isLoading ? <Text style={styles.hint}>No transactions yet.</Text> : null}
        renderItem={({ item }) => {
          const isCredit = item.type === "CREDIT";
          return (
            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: isCredit ? colors.successBg : colors.dangerBg }]}>
                {isCredit ? (
                  <ArrowDownLeft size={16} color={colors.successText} />
                ) : (
                  <ArrowUpRight size={16} color={colors.dangerText} />
                )}
              </View>
              <View style={styles.rowTextCol}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {item.note || item.source.replace(/_/g, " ")}
                </Text>
                <Text style={styles.rowMeta}>
                  {new Date(item.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </Text>
              </View>
              <View style={styles.rowAmountCol}>
                <Text style={[styles.rowAmount, { color: isCredit ? colors.success : colors.dangerText }]}>
                  {isCredit ? "+" : "-"}
                  {item.amount}
                </Text>
                <Text style={styles.rowBalance}>Bal {item.balance_after}</Text>
              </View>
            </View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  hero: { marginBottom: spacing.lg },
  heroRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  heroLabel: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.accentMuted },
  heroBalance: { marginTop: 6, fontFamily: fontFamily.bold, fontSize: 21, color: colors.accentTextStrong },
  rechargeButton: { backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: 20, paddingVertical: 10 },
  rechargeButtonText: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.accentMid },
  sectionTitle: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.textPrimary, marginBottom: spacing.sm },
  hint: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textSecondary, textAlign: "center", marginTop: spacing.xl },
  row: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  rowIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", marginRight: 12 },
  rowTextCol: { flex: 1, marginRight: 10 },
  rowTitle: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.textPrimary, textTransform: "capitalize" },
  rowMeta: { marginTop: 3, fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.textSecondary },
  rowAmountCol: { alignItems: "flex-end" },
  rowAmount: { fontFamily: fontFamily.bold, fontSize: fontSize.base },
  rowBalance: { marginTop: 3, fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.textSecondary },
});
