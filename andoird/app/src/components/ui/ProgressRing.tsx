import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { colors } from "../../theme/colors";
import { fontFamily } from "../../theme/typography";

export function ProgressRing({
  size = 68,
  strokeWidth = 6,
  progress,
  trackColor = "rgba(255,255,255,0.4)",
  fillColor = colors.accentTextStrong,
  label,
  sublabel,
  labelColor = colors.accentTextStrong,
}: {
  size?: number;
  strokeWidth?: number;
  progress: number;
  trackColor?: string;
  fillColor?: string;
  label: string;
  sublabel?: string;
  labelColor?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(progress, 0), 1));

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={[styles.label, { color: labelColor, fontSize: size * 0.22 }]}>{label}</Text>
      {sublabel ? <Text style={[styles.sublabel, { color: labelColor, fontSize: size * 0.12 }]}>{sublabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fontFamily.medium,
  },
  sublabel: {
    fontFamily: fontFamily.regular,
    opacity: 0.85,
  },
});
