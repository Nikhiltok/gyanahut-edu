// Android emulators can't reach the host machine via "localhost" — 10.0.2.2 is the
// emulator's alias for the host loopback. A physical device (Expo Go) needs the
// host machine's real LAN IP instead. Override with EXPO_PUBLIC_API_BASE_URL in
// .env when testing on a physical device or a different backend host.
import { Platform } from "react-native";

const DEFAULT_HOST = Platform.OS === "android" ? "10.0.2.2" : "localhost";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? `http://${DEFAULT_HOST}:8012/api/v1`;

export const ACCESS_TOKEN_KEY = "gh_access_token";
export const REFRESH_TOKEN_KEY = "gh_refresh_token";
