import path from 'node:path'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import UnoCSS from 'unocss/vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  // eslint-disable-next-line n/prefer-global/process
  const root = process.cwd()

  const { VITE_BASE_URL } = loadEnv(mode, root)

  return defineConfig({
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
      },
    },

    plugins: [UnoCSS(), react()],

    server: {
      proxy: {
        '/api/': {
          target: VITE_BASE_URL,
          changeOrigin: true,
        },
      },
    },

  })
}
