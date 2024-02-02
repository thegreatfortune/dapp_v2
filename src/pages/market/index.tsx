import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoanService } from '../../.generated/api/Loan'
import MarketCardsContainer from './components/MarketCardsContainer'
import { Models } from '@/.generated/api/models'

import bannerImage from '@/assets/images/market/banner.png'
import blacklist1 from '@/assets/images/market/blacklist1.png'

const Market = () => {
  const [hotStarterData, setHotStarterData] = useState<Models.PageResult<Models.LoanOrderVO>>(new Models.PageResult())

  const [popularToFollowData, setPopularToFollowData] = useState<Models.PageResult<Models.LoanOrderVO>>(new Models.PageResult())

  const [blacklist, setBlacklist] = useState<Models.PageResult<Models.LoanOrderVO>>(new Models.PageResult())

  const { t } = useTranslation()

  useEffect(() => {
    async function fetchData() {
      const res = await LoanService.ApiLoanPageLoanContract_GET({ page: 1, limit: 8, orderItemList: 'actual_share_count=false', state: 'Following' })
      setHotStarterData(res)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const res = await LoanService.ApiLoanPageLoanContract_GET({ page: 1, limit: 8, orderItemList: 'total_market_trading_price=false', state: 'Trading,PaidOff,PaidButArrears,CloseByUncollected' })

      setPopularToFollowData(res)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const params = { ...new Models.ApiLoanPageLoanContractGETParams(), limit: 4, page: 1, state: 'Blacklist' }

      const res = await LoanService.ApiLoanPageLoanContract_GET(params)

      setBlacklist(res)
    }
    fetchData()
  }, [])

  return (
    <div className="relative m-auto h-full min-h-full">
      <div >
        <img
          src={bannerImage}
          alt='Image 2'
          className='h-280 w-full b-rd-20 object-cover'
        />
      </div>

      <div className="h44" />

      {
        (hotStarterData.records && hotStarterData.records.length > 0)
        && <MarketCardsContainer image='' key='HotStarter' title={`🔥${t('market.CardsContainer1.title')}`} records={hotStarterData.records} to='/view-all?title=🔥Hot starter&category=HotStarter' />
      }
      <div className='h-44 w-full' />
      {
        (popularToFollowData.records && popularToFollowData.records.length > 0)
        && <MarketCardsContainer image='' key='PopularToFollow' title={`💥${t('market.CardsContainer2.title')}`} records={popularToFollowData.records} to='/view-all?title=💥Popular to follow&category=PopularToFollow' />
      }

      <div className='h-44 w-full' />

      {
        (blacklist.total && blacklist.total > 0)
          ? <MarketCardsContainer image={blacklist1} key='Blacklist' title={`${t('market.CardsContainer3.title')}`} records={blacklist.records ?? []} to='/view-all?title=Blacklist&category=Blacklist' />
          : null
      }

    </div>
  )
}

export default Market
