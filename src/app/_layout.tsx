import '../global.css'

import { Tabs } from 'expo-router/js-tabs'
import { Text, View } from 'react-native'
import { AppProviders } from '@/features/core/data-access/app-providers'
import { useTheme } from '@/features/shell/data-access/use-theme'
import { cn } from 'heroui-native'

export default function Layout() {
  return (
    <AppProviders>
      <AppTabs />
    </AppProviders>
  )
}

function TabBarIcon({ focused, label }: { focused: boolean; label: string }) {
  return (
    <View
      className={cn(
        'h-6 w-6 items-center justify-center rounded-md border-2',
        focused ? 'border-blue-500' : 'border-neutral-500',
      )}
    >
      <Text className={cn('text-xs font-bold leading-4', focused ? 'text-blue-500' : 'text-neutral-500')}>{label}</Text>
    </View>
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
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} label="W" />,
          title: 'Wallet',
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} label="T" />,
          title: 'Tools',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} label="S" />,
          title: 'Settings',
        }}
      />
    </Tabs>
  )
}
