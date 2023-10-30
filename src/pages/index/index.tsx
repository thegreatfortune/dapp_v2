import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { CreditAddressService } from '../../.generated/api/CreditAddress'

function Index() {
  const { t } = useTranslation()

  return (<div>Index {t('hello')} <Button type='primary' onClick={() => {
    CreditAddressService.getCreditAddressQueryAddressCreditScore({})
  }}>Button</Button></div>)
}

export default Index
