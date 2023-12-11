import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoanService } from '../../.generated/api/Loan'
import CardsContainer from '../components/CardsContainer'
import { Models } from '@/.generated/api/models'
import useNavbarQueryStore from '@/store/useNavbarQueryStore'
import { isContractAddress, isTwitterHandle } from '@/utils/regex'
import { MarketService } from '@/.generated/api/Market'

const Market = () => {
  const [highCreditVo, setHighCreditVO] = useState<Models.LoanOrderVO[]>([])

  const [loanOrderVO, setLoanOrderVO] = useState<Models.LoanOrderVO[]>([])
  const { t } = useTranslation()

  const { queryString } = useNavbarQueryStore()

  useEffect(() => {
    async function fetchData() {
      const params = { ...new Models.ApiLoanPageLoanContractGETParams(), borrowUserId: undefined }
      params.limit = 8

      if (isContractAddress(queryString ?? ''))
        params.capitalPoolContract = queryString
      else if (isTwitterHandle(queryString ?? ''))
        params.bindPlatform = queryString && (params.platformType = 'Twitter')
      else
        params.loanName = queryString

      const res = await LoanService.ApiLoanPageLoanContract_GET(params)
      console.log('%c [ res ]-30', 'font-size:13px; background:#671ba4; color:#ab5fe8;', res)

      res?.records && setLoanOrderVO(res.records)
    }
    fetchData()
  }, [queryString])

  useEffect(() => {
    async function fetchData() {
      const res = await LoanService.ApiLoanHomeInfo_GET()
      setHighCreditVO(res)
    }
    fetchData()
  }, [])

  return (
    <div className="relative m-auto h-full min-h-full">
      {/* <Carousel autoplay className=''></Carousel> banner翻页组件 */}
      <div>
        <img
          src="src/assets/images/market/banner.png"
          alt='Image 2'
          className='h-280 w-full b-rd-20 object-cover'
        />
      </div>

      <div className="h44"/>

      {
        loanOrderVO.length > 0
        && <CardsContainer image='' key='HighCredit' title={`🔥${t('market.CardsContainer1.title')}`} records={loanOrderVO} to='/view-all?title=🔥Hot starter' />
      }
      <div className='h-44 w-full' />
      {
        loanOrderVO.length > 0
        && <CardsContainer image='' key='PopularToFollow' title={`💥${t('market.CardsContainer2.title')}`} records={loanOrderVO} to='/view-all?title=💥Popular to follow' />
      }
      <div className='h-44 w-full' />
      {
        loanOrderVO.length > 0
        && <CardsContainer image='src/assets/images/market/blacklist1.png' key='Blacklist' title={`${t('market.CardsContainer3.title')}`} records={loanOrderVO} to='/view-all?title=Blacklist' />
      }

    </div>
  )
}

export default Market
