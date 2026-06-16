import { Platform, View } from 'react-native'
import type { PropsWithChildren, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppIdentity } from '@wallet-ui/react-native-kit'
import { MobileWalletProvider } from '@wallet-ui/react-native-kit'
import { HeroUINativeProvider } from 'heroui-native/provider'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { ClusterProvider, useAppCluster } from '@/features/cluster/data-access/cluster-provider'
import { createClusterProps } from '@/features/cluster/data-access/create-cluster-props'
import { ShellUiThemeStatusBar } from '@/features/shell/ui/shell-ui-theme-status-bar'
import { WebWalletProvider } from '@/features/wallet/data-access/web-wallet-provider'

const identity: AppIdentity = { name: 'Seeker Ready', uri: 'seekerready://seeker-ready' }
const queryClient = new QueryClient()
const clusterConfig = createClusterProps()
const AppRoot = Platform.OS === 'web' ? View : GestureHandlerRootView

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppRoot style={{ flex: 1 }}>
      <HeroUINativeProvider config={{ devInfo: { stylingPrinciples: false } }}>
        <QueryClientProvider client={queryClient}>
          <ClusterProvider store={clusterConfig.store}>
            <AppWalletProviders>{children}</AppWalletProviders>
          </ClusterProvider>
        </QueryClientProvider>
      </HeroUINativeProvider>
    </AppRoot>
  )
}

function AppWalletProviders({ children }: PropsWithChildren) {
  const { cluster } = useAppCluster()

  if (Platform.OS === 'web') {
    return (
      <WebWalletProvider>
        <View className="flex-1 bg-white dark:bg-black">
          {children}
          <ShellUiThemeStatusBar />
        </View>
      </WebWalletProvider>
    )
  }

  return (
    <MobileWalletProvider cluster={cluster} identity={identity} key={cluster.id}>
      <View className="flex-1 bg-white dark:bg-black">
        {children}
        <ShellUiThemeStatusBar />
      </View>
    </MobileWalletProvider>
  )
}
