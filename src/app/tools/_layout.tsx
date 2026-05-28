import { Stack } from 'expo-router/stack'

import { useTheme } from '@/features/shell/data-access/use-theme'

export default function ToolsLayout() {
  const { backgroundColor, foregroundColor, tintColor } = useTheme()

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor },
        gestureEnabled: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor },
        headerTintColor: tintColor,
        headerTitleStyle: { color: foregroundColor },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false, title: 'Tools' }} />
      <Stack.Screen name="network" options={{ title: 'Network tools' }} />
      <Stack.Screen name="transaction" options={{ title: 'Transaction tools' }} />
      <Stack.Screen name="wallet-actions" options={{ title: 'Wallet actions' }} />
    </Stack>
  )
}
