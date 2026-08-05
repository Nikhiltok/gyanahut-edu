import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "../context/AuthContext";
import { BookmarksScreen } from "../screens/tests/BookmarksScreen";
import { ExamHistoryScreen } from "../screens/tests/ExamHistoryScreen";
import { ExamTakingScreen } from "../screens/tests/ExamTakingScreen";
import { RechargeScreen } from "../screens/profile/RechargeScreen";
import { ResultScreen } from "../screens/tests/ResultScreen";
import { RevisionScreen } from "../screens/tests/RevisionScreen";
import { WalletScreen } from "../screens/profile/WalletScreen";
import { colors } from "../theme/colors";
import { AppTabs } from "./AppTabs";
import { AuthNavigator } from "./AuthNavigator";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.accentMid} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={AppTabs} />
          <Stack.Screen name="ExamTaking" component={ExamTakingScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="ExamHistory" component={ExamHistoryScreen} />
          <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
          <Stack.Screen name="RevisionWrong" component={RevisionScreen} initialParams={{ type: "wrong" }} />
          <Stack.Screen name="RevisionDifficult" component={RevisionScreen} initialParams={{ type: "difficult" }} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="Recharge" component={RechargeScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
