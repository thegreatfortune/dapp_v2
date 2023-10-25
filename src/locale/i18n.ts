import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './locales/index'

const browserLanguage = window.navigator.language

// 定义支持的语言包
const supportedLanguages = ['en-US', 'zh-CN'] // 支持的语言列表

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: supportedLanguages.includes(browserLanguage) ? browserLanguage : 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
