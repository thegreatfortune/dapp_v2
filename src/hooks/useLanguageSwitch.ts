import { useTranslation } from 'react-i18next'
import zhCN from 'antd/lib/locale/zh_CN'
import enUS from 'antd/lib/locale/en_US'
import type { Locale } from 'antd/lib/locale'
import { useEffect, useState } from 'react'

export function useLanguageSwitch() {
  const { i18n } = useTranslation()

  const browserLanguageLib: string = window.navigator.language

  const [currentLanguageLib, setCurrentLanguage] = useState(enUS)

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const loadLanguage = (): Locale => {
    const lanMap: any = {
      'zh-CN': zhCN,
      'en-US': enUS,
    }

    return lanMap[browserLanguageLib] ?? lanMap['en']
  }

  useEffect(() => {
    setCurrentLanguage(loadLanguage())
  }, []) // 空数组表示只在组件加载时执行一次

  return {
    changeLanguage,
    loadLanguage,
    currentLanguageLib,
  }
}
