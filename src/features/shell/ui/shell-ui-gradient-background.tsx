import { StyleSheet, useWindowDimensions, View } from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'

import { APP_GRADIENT_COLORS } from '@/features/shell/ui/shell-ui-gradient.constants'

export function ShellUiGradientBackground() {
  const { height, width } = useWindowDimensions()

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg height={height} preserveAspectRatio="none" width={width}>
        <Defs>
          <LinearGradient id="seekerReadyGradient" x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0" stopColor={APP_GRADIENT_COLORS.top} />
            <Stop offset="0.28" stopColor={APP_GRADIENT_COLORS.upperMid} />
            <Stop offset="0.52" stopColor={APP_GRADIENT_COLORS.mid} />
            <Stop offset="0.78" stopColor={APP_GRADIENT_COLORS.lowerMid} />
            <Stop offset="1" stopColor={APP_GRADIENT_COLORS.bottom} />
          </LinearGradient>
        </Defs>
        <Rect fill="url(#seekerReadyGradient)" height="100%" width="100%" />
      </Svg>
    </View>
  )
}
