import AsyncStorage from "@react-native-async-storage/async-storage";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./config";

export async function storeTokens(accessToken: string, refreshToken: string) {
  await AsyncStorage.multiSet([
    [ACCESS_TOKEN_KEY, accessToken],
    [REFRESH_TOKEN_KEY, refreshToken],
  ]);
}

export async function clearTokens() {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
}

export async function getAccessToken() {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken() {
  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function setAccessToken(accessToken: string) {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}
