import '../global.css'

import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from 'expo-router/js-tabs'
import { AppProviders } from '@/features/core/data-access/app-providers'
import { useTheme } from '@/features/shell/data-access/use-theme'
import { APP_GRADIENT_BOTTOM } from '@/features/shell/ui/shell-ui-gradient.constants'

export default function Layout() {
  return (
    <AppProviders>
      <AppTabs />
    </AppProviders>
  )
}

function AppTabs() {
  const { tintColor } = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: APP_GRADIENT_BOTTOM },
        tabBarActiveTintColor: tintColor,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.55)',
        tabBarStyle: {
          backgroundColor: APP_GRADIENT_BOTTOM,
          borderTopColor: 'rgba(255,255,255,0.12)',
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
