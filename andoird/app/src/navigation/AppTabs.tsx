import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { DashboardScreen } from "../screens/home/DashboardScreen";
import { PracticeGenerateScreen } from "../screens/practice/PracticeGenerateScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { RankingScreen } from "../screens/ranking/RankingScreen";
import { TestsScreen } from "../screens/tests/TestsScreen";
import { CustomTabBar } from "./CustomTabBar";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Practice" component={PracticeGenerateScreen} />
      <Tab.Screen name="Tests" component={TestsScreen} />
      <Tab.Screen name="Ranking" component={RankingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
