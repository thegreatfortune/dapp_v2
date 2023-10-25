import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

function Index() {
  const { t } = useTranslation()

  return (<div>Index {t('hello')} <Button type='primary'>Button</Button></div>)
}

export default Index
