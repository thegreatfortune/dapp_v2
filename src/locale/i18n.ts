import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enResource from './locales/en-US.json'
import zhResource from './locales/zh-CN.json'

const browserLanguage = window.navigator.language

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enResource,
      },
      zh: {
        translation: zhResource,
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
