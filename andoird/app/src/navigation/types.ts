export type AuthStackParamList = {
  Login: { next?: string } | undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { uid: string; token: string } | undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Practice: undefined;
  Tests: undefined;
  Ranking: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  ExamTaking: { testId: string };
  Result: { attemptId: string };
  ExamHistory: undefined;
  Bookmarks: undefined;
  RevisionWrong: { type: "wrong" };
  RevisionDifficult: { type: "difficult" };
  Wallet: undefined;
  Recharge: undefined;
};
