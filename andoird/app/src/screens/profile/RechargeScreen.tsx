import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { getErrorMessage } from "../../api/error";
import { getRechargePlans, recharge, verifyPayment } from "../../api/payments";
import { Card } from "../../components/ui/Card";
import { Screen } from "../../components/layout/Screen";
import { TopBar } from "../../components/layout/TopBar";
import { colors } from "../../theme/colors";
import { fontFamily, fontSize } from "../../theme/typography";
import { radius, spacing } from "../../theme/spacing";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Recharge">;

export function RechargeScreen({ navigation }: Props) {
  const queryClient = useQueryClient();
  const { data: plans, isLoading } = useQuery({ queryKey: ["recharge-plans"], queryFn: getRechargePlans });
  const [payingPlanId, setPayingPlanId] = useState<string | null>(null);

  const purchaseMutation = useMutation({
    mutationFn: async (planId: string) => {
      const order = await recharge(planId);
      // Dev/test mode: the backend accepts any payment id paired with a
      // "order_test_" order — production would launch the Razorpay checkout
      // SDK here instead and pass its real gateway_payment_id/signature.
      return verifyPayment(order.gateway_order_id, `pay_test_${Date.now()}`);
    },
    onMutate: (planId) => setPayingPlanId(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      Alert.alert("Recharge successful", "Your wallet has been credited.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    },
    onError: (err) => Alert.alert("Recharge failed", getErrorMessage(err)),
    onSettled: () => setPayingPlanId(null),
  });

  return (
    <Screen>
      <TopBar title="Recharge" onBack={() => navigation.goBack()} />
      <View style={styles.list}>
        {(plans ?? []).map((plan) => (
          <Card key={plan.id} style={styles.planCard}>
            <View style={styles.planTextCol}>
              <Text style={styles.planAmount}>₹{plan.amount}</Text>
              <Text style={styles.planCredits}>{plan.credits} credits</Text>
            </View>
            <Pressable
              style={styles.buyButton}
              onPress={() => purchaseMutation.mutate(plan.id)}
              disabled={purchaseMutation.isPending}
            >
              <Text style={styles.buyButtonText}>{payingPlanId === plan.id ? "Processing…" : "Buy"}</Text>
            </Pressable>
          </Card>
        ))}
        {!isLoading && plans?.length === 0 ? <Text style={styles.hint}>No recharge plans available.</Text> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, gap: spacing.sm },
  hint: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.textSecondary, textAlign: "center", marginTop: spacing.xl },
  planCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: spacing.md, marginBottom: spacing.sm },
  planTextCol: {},
  planAmount: { fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.textPrimary },
  planCredits: { marginTop: 2, fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.textSecondary },
  buyButton: { backgroundColor: colors.accentChip, borderRadius: radius.pill, paddingHorizontal: 22, paddingVertical: 10 },
  buyButtonText: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.accentText },
});
