import { cn } from 'heroui-native/utils'
import { Platform, Pressable, type PressableProps } from 'react-native'

type ReadinessUiPressableProps = PressableProps & {
  onPress?: () => void
}

export function ReadinessUiPressable({
  className,
  onPress,
  ...props
}: ReadinessUiPressableProps) {
  const webClickProps =
    Platform.OS === 'web' && onPress
      ? ({
          onClick: (event: { preventDefault?: () => void }) => {
            event.preventDefault?.()
            onPress()
          },
        } as object)
      : {}

  return (
    <Pressable
      {...props}
      {...webClickProps}
      className={cn('cursor-pointer', className)}
      onPress={onPress}
    />
  )
}
