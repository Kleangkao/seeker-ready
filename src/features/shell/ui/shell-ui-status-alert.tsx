import { Alert } from 'heroui-native'

export type ShellUiStatusAlertProps = {
  description: string
  status: 'danger' | 'success'
  title: string
}

export function ShellUiStatusAlert({ description, status, title }: ShellUiStatusAlertProps) {
  return (
    <Alert status={status}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        <Alert.Description>{description}</Alert.Description>
      </Alert.Content>
    </Alert>
  )
}
