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
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import {
  arbitrum,
  polygonMumbai,
} from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import './index.css'
import '@/locale/i18n.ts'
import App from './App.tsx'
import { getLanguageLib } from './utils/getLanguageLib.ts'

dayjs.extend(relativeTime)

const localhost = {
  ...polygonMumbai,
  id: 31337,
  name: 'Localhost',
  network: 'localhost',
  rpcUrls: {
    ...polygonMumbai.rpcUrls,
    ...{
      localhost: {
        http: [import.meta.env.VITE_ALCHEMY_ID],
        webSocket: ['wss://polygon-mumbai.g.alchemy.com/v2/ubn43XNUtUXvA2ScuHqBUwiMqIPCW6ET'],
      },
      default: {
        http: [import.meta.env.VITE_ALCHEMY_ID],
      },
      public: {
        http: [import.meta.env.VITE_ALCHEMY_ID],
      },
    },
  },
}

const chainList = [polygonMumbai, arbitrum]

if (import.meta.env.DEV)
  chainList.push(localhost as any)

const { chains, publicClient } = configureChains(
  chainList,
  [
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'Follow',
  projectId: import.meta.env.VITE_PROJECT_ID_FOR_WALLETS,
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
