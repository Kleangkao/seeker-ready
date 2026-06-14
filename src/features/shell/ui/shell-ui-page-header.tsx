import Ionicons from '@expo/vector-icons/Ionicons'
import type { ComponentProps, ReactNode } from 'react'
import { Text, View } from 'react-native'

import {
  TEXT_ON_GRADIENT_BODY,
  TEXT_ON_GRADIENT_TITLE,
} from '@/features/shell/ui/shell-ui-surface-styles'

export function ShellUiPageHeader({
  description = null,
  icon = null,
  title,
}: {
  description?: ReactNode | string
  icon?: ReactNode
  title: string
}) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-3">
        {icon}
        <Text className={`flex-1 text-3xl font-semibold ${TEXT_ON_GRADIENT_TITLE}`}>{title}</Text>
      </View>
      {typeof description === 'string' ? (
        <Text className={`text-base leading-6 ${TEXT_ON_GRADIENT_BODY}`}>{description}</Text>
      ) : (
        description
      )}
    </View>
  )
}

export function ShellUiHeaderTitle({
  foregroundColor,
  icon,
  tintColor,
  title,
}: {
  foregroundColor: string
  icon: ComponentProps<typeof Ionicons>['name']
  tintColor: string
  title: string
}) {
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
      <Ionicons color={tintColor} name={icon} size={22} />
      <Text style={{ color: foregroundColor, fontSize: 20, fontWeight: '600' }}>{title}</Text>
    </View>
  )
}
