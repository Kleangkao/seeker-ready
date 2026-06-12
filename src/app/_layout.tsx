import '../global.css'

import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from 'expo-router/js-tabs'
import { AppProviders } from '@/features/core/data-access/app-providers'
import { useTheme } from '@/features/shell/data-access/use-theme'

export default function Layout() {
  return (
    <AppProviders>
      <AppTabs />
    </AppProviders>
  )
}

function AppTabs() {
  const { backgroundColor, isDark, mutedColor, tintColor } = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor },
        tabBarActiveTintColor: tintColor,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: mutedColor,
        tabBarStyle: {
          backgroundColor,
          borderTopColor: isDark ? '#1F2937' : '#E5E7EB',
        },
      }}
    >
      <Tabs.Screen
        name="(ready)"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color} name={focused ? 'checkmark-circle' : 'checkmark-circle-outline'} size={size} />
          ),
          title: 'Ready',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons color={color} name={focused ? 'settings' : 'settings-outline'} size={size} />
          ),
          title: 'Settings',
        }}
      />
    </Tabs>
  )
}
