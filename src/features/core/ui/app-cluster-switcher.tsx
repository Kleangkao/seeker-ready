import type { SolanaClusterId } from '@wallet-ui/react-native-kit'
import { Description } from 'heroui-native/description'
import { Label } from 'heroui-native/label'
import { Radio } from 'heroui-native/radio'
import { RadioGroup } from 'heroui-native/radio-group'
import { cn } from 'heroui-native/utils'
import { View } from 'react-native'

import { useAppCluster } from '@/features/cluster/data-access/cluster-provider'

export function AppClusterSwitcher() {
  const { cluster: activeCluster, clusters, setCluster } = useAppCluster()

  return (
    <RadioGroup value={activeCluster.id} onValueChange={(clusterId) => setCluster(clusterId as SolanaClusterId)}>
      {clusters.map((cluster) => {
        const isSelected = activeCluster.id === cluster.id

        return (
          <RadioGroup.Item
            className={cn(
              'w-full flex-row items-center justify-between rounded-2xl border px-4 py-3',
              isSelected
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black',
            )}
            key={cluster.id}
            value={cluster.id}
          >
            <View className="flex-1 gap-1">
              <Label
                className={cn(
                  'text-base font-semibold',
                  isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-neutral-900 dark:text-white',
                )}
              >
                {cluster.label}
              </Label>
              <Description>{cluster.url}</Description>
            </View>
            <Radio />
          </RadioGroup.Item>
        )
      })}
    </RadioGroup>
  )
}
