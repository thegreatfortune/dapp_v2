import 'uno.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
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

const { chains, publicClient } = configureChains(
  [polygonMumbai, arbitrum],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID }),
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

// 设置根元素字体大小的函数
function setRootFontSize() {
  const width = document.documentElement.clientWidth
  const rootFontSize = `${width / 480}px`
  document.documentElement.style.fontSize = rootFontSize
}

function initAndListen() {
  setRootFontSize()
  window.addEventListener('orientationchange', setRootFontSize)
  window.addEventListener('resize', setRootFontSize)
}

initAndListen()

const browserLanguageLib = getLanguageLib()

root.render(
  <React.StrictMode>
    <ConfigProvider locale={browserLanguageLib.locale} theme={{
      // 使用暗色算法
      algorithm: theme.darkAlgorithm,
      // token: {
      //   colorPrimary: '#010101',
      // },
    }}>
      <BrowserRouter>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} theme={darkTheme()} locale={browserLanguageLib.browserLanguage as Locale} >
            <App />
          </RainbowKitProvider>
        </WagmiConfig>
      </BrowserRouter>
      </ConfigProvider>
  </React.StrictMode>,
)
