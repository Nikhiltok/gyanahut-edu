import { StyleSheet, View } from "react-native";

import { colors } from "../../theme/colors";

export function ProgressBar({
  progress,
  color = colors.accentMid,
  trackColor = colors.surfaceMuted,
  height = 8,
}: {
  progress: number;
  color?: string;
  trackColor?: string;
  height?: number;
}) {
  const pct = Math.min(Math.max(progress, 0), 1) * 100;
  return (
    <View style={[styles.track, { backgroundColor: trackColor, height, borderRadius: height / 2 }]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color, height, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    overflow: "hidden",
  },
  fill: {},
});
