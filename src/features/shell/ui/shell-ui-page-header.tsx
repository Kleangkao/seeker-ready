import { Text, View } from 'react-native'
import { ReactNode } from 'react'

export function ShellUiPageHeader({ description = null, title }: { description?: ReactNode | string; title: string }) {
  return (
    <View className="gap-2">
      <View className="flex flex-row justify-between">
        <Text className="flex-1 text-3xl font-semibold text-neutral-900 dark:text-white">{title}</Text>
      </View>
      {typeof description === 'string' ? (
        <Text className="text-base leading-6 text-neutral-600 dark:text-neutral-300">{description}</Text>
      ) : (
        description
      )}
    </View>
  )
}
