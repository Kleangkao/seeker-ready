import { cn } from 'heroui-native/utils'
import type { PropsWithChildren } from 'react'
import { ScrollView, View } from 'react-native'

import { ShellUiGradientBackground } from '@/features/shell/ui/shell-ui-gradient-background'

type ShellUiPageProps = PropsWithChildren<{
  centered?: boolean
  contentClassName?: string
  contentContainerClassName?: string
  gradient?: boolean
}>

export function ShellUiPage({
  centered,
  contentClassName,
  contentContainerClassName,
  gradient = true,
  children,
}: ShellUiPageProps) {
  return (
    <View className="flex-1">
      {gradient ? <ShellUiGradientBackground /> : null}
      <ScrollView
        className={cn('flex-1', gradient ? 'bg-transparent' : 'bg-white dark:bg-black')}
        contentContainerStyle={{ flexGrow: 1 }}
        contentContainerClassName={cn(
          'gap-6 px-4 py-2',
          {
            'flex-grow justify-center ': centered,
          },
          contentContainerClassName,
        )}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className={cn('gap-6', contentClassName)}>{children}</View>
      </ScrollView>
    </View>
  )
}
