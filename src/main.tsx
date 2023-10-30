import 'uno.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import '@/utils/request.ts'

import '@rainbow-me/rainbowkit/styles.css'
import type { Locale } from '@rainbow-me/rainbowkit'
import {
  RainbowKitProvider,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  zora,
} from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import '@/locale/i18n.ts'
import App from './App.tsx'
import './index.css'
import { getLanguageLib } from './utils/getLanguageLib.ts'

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID }),
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
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
  <React.StrictMode>
    <ConfigProvider locale={browserLanguageLib.locale}>
      <BrowserRouter>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} locale={browserLanguageLib.browserLanguage as Locale} >
            <App />
          </RainbowKitProvider>
        </WagmiConfig>
      </BrowserRouter>
      </ConfigProvider>
  </React.StrictMode>,
)
