import 'uno.css'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import '@/utils/request.ts'
import '@rainbow-me/rainbowkit/styles.css'
import type { Locale } from '@rainbow-me/rainbowkit'
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit'
import type { Chain } from 'wagmi'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'

import { arbitrum } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import './index.css'
import '@/locale/i18n.ts'
import App from './App.tsx'
import { getLanguageLib } from './utils/getLanguageLib.ts'
import { Base } from './enums/base.ts'

dayjs.extend(relativeTime)

const chainList: Chain[] = []

const polygonMumbai = {
  id: 80001,
  name: 'Polygon Mumbai',
  network: 'Polygon Mumbai',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_MUMBAI_RPC],
    },
    public: {
      http: [import.meta.env.VITE_MUMBAI_RPC],
    },
  },
  blockExplorers: {
    default: {
      name: 'Polygon Mumbai Scan',
      // url: 'https://mumbai.polygonscan.com',
      url: import.meta.env.VITE_MUMBAI_BLOCKEXPLORER,
    },
  },
  testnet: true,
}

export const opSepolia = {
  id: 11155420,
  name: 'Op Sepolia',
  network: 'Op Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png',
  iconBackground: '#FF0000',
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_OPSEPOLIA_RPC],
    },
    public: {
      http: [import.meta.env.VITE_OPSEPOLIA_RPC],
    },
  },
  blockExplorers: {
    default: {
      name: 'Op Sepolia Scan',
      url: import.meta.env.VITE_OPSEPOLIA_BLOCKEXPLORER,
    },
  },
  testnet: true,
}

if (import.meta.env.VITE_GENERAL_TESTNET === 'true')
  chainList.push(polygonMumbai, opSepolia)
else
  chainList.push(arbitrum)

// if (import.meta.env.DEV)
//   chainList.push(localhost as any)

const { chains, publicClient } = configureChains(
  chainList,
  [
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: Base.DAppTitle,
  projectId: Base.WalletConnectProjectId,
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

const root = ReactDOM.createRoot(document.getElementById('root')!)

const browserLanguageLib = getLanguageLib()

root.render(
  // <React.StrictMode>
  <ConfigProvider locale={browserLanguageLib.locale} theme={{
    // 使用暗色算法
    algorithm: theme.darkAlgorithm,
    // token: {
    //   colorPrimary: '#171822',
    // },
  }}>
    <BrowserRouter>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={darkTheme()} locale={browserLanguageLib.browserLanguage as Locale} >
          <App />
        </RainbowKitProvider>
      </WagmiConfig>
    </BrowserRouter>
  </ConfigProvider>,
)
