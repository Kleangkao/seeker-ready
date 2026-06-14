import Ionicons from '@expo/vector-icons/Ionicons'
import type { SolanaClusterId } from '@wallet-ui/react-native-kit'
import { useState } from 'react'
import { Button } from 'heroui-native/button'
import { Card } from 'heroui-native/card'
import { Input } from 'heroui-native/input'
import { Text, View } from 'react-native'

import { useAppCluster } from '@/features/cluster/data-access/cluster-provider'
import { AppClusterSwitcher } from '@/features/core/ui/app-cluster-switcher'
import { useTheme } from '@/features/shell/data-access/use-theme'
import { ShellUiPage } from '@/features/shell/ui/shell-ui-page'
import {
  SURFACE_CARD,
  TEXT_ON_SURFACE_MUTED,
  TEXT_ON_SURFACE_TITLE,
} from '@/features/shell/ui/shell-ui-surface-styles'

export function SettingsFeatureCluster() {
  const { cluster, clusters, resetClusters, updateClusterUrl } = useAppCluster()
  const { tintColor } = useTheme()
  const [selectedClusterId, setSelectedClusterId] = useState<SolanaClusterId>(cluster.id)
  const selectedCluster = clusters.find((item) => item.id === selectedClusterId) ?? clusters[0]
  const [draftUrls, setDraftUrls] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<string | null>(null)
  const url = selectedCluster ? (draftUrls[selectedCluster.id] ?? selectedCluster.url) : ''

  return (
    <ShellUiPage>
      <Card className={`gap-4 p-5 ${SURFACE_CARD}`}>
        <Card.Body className="gap-1">
          <View className="flex-row items-center gap-2">
            <Ionicons color={tintColor} name="server-outline" size={22} />
            <Card.Title className={`text-xl font-bold ${TEXT_ON_SURFACE_TITLE}`}>Cluster</Card.Title>
          </View>
          <Card.Description className={`leading-relaxed ${TEXT_ON_SURFACE_MUTED}`}>
            RPC and wallet authorization target.
          </Card.Description>
        </Card.Body>
        <AppClusterSwitcher
          onSelectCluster={(clusterId) => {
            setSelectedClusterId(clusterId)
            setStatus(null)
          }}
          selectedClusterId={selectedClusterId}
        />
      </Card>
      {selectedCluster ? (
        <Card className={`gap-4 p-5 ${SURFACE_CARD}`}>
          <Card.Body className="gap-1">
            <View className="flex-row items-center gap-2">
              <Ionicons color={tintColor} name="link-outline" size={22} />
              <Card.Title className={`text-xl font-bold ${TEXT_ON_SURFACE_TITLE}`}>
                {selectedCluster.label} URL
              </Card.Title>
            </View>
            <Card.Description className={`leading-relaxed ${TEXT_ON_SURFACE_MUTED}`}>
              Leave the URL empty to keep this cluster visible but disabled.
            </Card.Description>
          </Card.Body>
          <Input
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            onChangeText={(value) => {
              setDraftUrls((current) => ({
                ...current,
                [selectedCluster.id]: value,
              }))
            }}
            placeholder="RPC URL"
            value={url}
          />
          {status ? <Text className={`text-sm ${TEXT_ON_SURFACE_MUTED}`}>{status}</Text> : null}
          <View className="gap-3">
            <Button
              variant="outline"
              onPress={() => {
                try {
                  updateClusterUrl(selectedCluster.id, url)
                  setDraftUrls((current) => {
                    const next = { ...current }
                    delete next[selectedCluster.id]
                    return next
                  })
                  setStatus(`${selectedCluster.label} URL updated.`)
                } catch (error) {
                  setStatus(error instanceof Error ? error.message : 'Unable to update cluster URL.')
                }
              }}
            >
              Update URL
            </Button>
            <Button
              variant="ghost"
              onPress={() => {
                resetClusters()
                setDraftUrls({})
                setStatus('Cluster settings reset to default.')
              }}
            >
              Reset to Default
            </Button>
          </View>
        </Card>
      ) : null}
    </ShellUiPage>
  )
}
