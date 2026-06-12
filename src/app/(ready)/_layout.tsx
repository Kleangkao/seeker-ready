import { Stack } from 'expo-router/stack'

import { useTheme } from '@/features/shell/data-access/use-theme'
import { ShellUiHeaderTitle } from '@/features/shell/ui/shell-ui-page-header'

export default function ReadyLayout() {
  const { foregroundColor, navigationHeaderOptions, tintColor } = useTheme()

  return (
    <Stack
      screenOptions={{
        gestureEnabled: true,
        ...navigationHeaderOptions,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => (
            <ShellUiHeaderTitle
              foregroundColor={foregroundColor}
              icon="checkmark-circle-outline"
              tintColor={tintColor}
              title="Seeker Ready"
            />
          ),
          title: 'Seeker Ready',
        }}
      />
    </Stack>
  )
}
