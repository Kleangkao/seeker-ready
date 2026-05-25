import { ScrollView, View } from 'react-native'
import type { PropsWithChildren } from 'react'
import { cn } from 'heroui-native/utils'

export function ShellUiPage({ centered, children }: PropsWithChildren<{ centered?: boolean }>) {
  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-black"
      contentContainerClassName={cn('gap-6 px-6 py-8 pt-12', {
        'flex-grow justify-center ': centered,
      })}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="gap-6">{children}</View>
    </ScrollView>
  )
}
