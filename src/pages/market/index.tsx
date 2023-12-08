import Carousel from 'antd/es/carousel'
import { useEffect, useState } from 'react'
import blacklist1Img from 'src/assets/images/market/blacklist1.png'
import { FeeData } from 'ethers'
import { useTranslation } from 'react-i18next'
import bannerImg from '../../assets/images/market/banner.png'
import { LoanService } from '../../.generated/api/Loan'
import CardsContainer from '../components/CardsContainer'
import { Models } from '@/.generated/api/models'
import useNavbarQueryStore from '@/store/useNavbarQueryStore'
import { isContractAddress, isTwitterHandle } from '@/utils/regex'
import { MarketService } from '@/.generated/api/Market'

const Market = () => {
  const [loanOrderVO, setLoanOrderVO] = useState<Models.LoanOrderVO[]>([])
  const { t } = useTranslation()

  const { queryString } = useNavbarQueryStore()

  const [risk, setRisk] = useState<'All' | 'LowRisk' | 'HighRisk'>('All')

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
      const params = { ...new Models.ApiLoanPageLoanContractGETParams(), borrowUserId: undefined }
      params.limit = 8

      if (isContractAddress(queryString ?? ''))
        params.capitalPoolContract = queryString
      else if (isTwitterHandle(queryString ?? ''))
        params.bindPlatform = queryString && (params.platformType = 'Twitter')
      else
        params.loanName = queryString

      const res = await MarketService.ApiMarketHomeInfo_GET()
      console.log('%c [ ApiMarketHomeInfo_GET ]-64', 'font-size:13px; background:pink; color:#bf2c9f;', res)
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
      <div className='h-80 w-full'></div>
      <CardsContainer image='' key='HighCredit' title={`🔥${t('market.CardsContainer1.title')}`} records={loanOrderVO} to='/view-all?title=🔥Hot starter' />
      <div className='h-80 w-full'></div>
      <CardsContainer image='' key='PopularToFollow' title={`💥${t('market.CardsContainer2.title')}`} records={loanOrderVO} to='/view-all?title=💥Popular to follow' />
      <div className='h-80 w-full'></div>
      <CardsContainer image='src/assets/images/market/blacklist1.png' key='Blacklist' title={`${t('market.CardsContainer3.title')}`} records={loanOrderVO} to='/view-all?title=Blacklist' />
      <div className='h-80 w-full'></div>
    </div>
  )
}

export default Market
