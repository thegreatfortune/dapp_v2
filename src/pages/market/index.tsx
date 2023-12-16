import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { LoanService } from '../../.generated/api/Loan'
import CardsContainer from '../components/CardsContainer'
import { Models } from '@/.generated/api/models'
import { MarketService } from '@/.generated/api'

import bannerImage from '@/assets/images/market/banner.png'
import blacklist1 from '@/assets/images/market/blacklist1.png'

const Market = () => {
  const [hotStarterData, setHotStarterData] = useState<Models.LoanOrderVO[]>([])

  const [popularToFollowData, setPopularToFollowData] = useState<Models.MarketLoanVo[]>([])

  const [blacklist, setBlacklist] = useState<Models.PageResult<Models.LoanOrderVO>>(new Models.PageResult())

  const { t } = useTranslation()

  const [searchParams] = useSearchParams()
  const inviteCode = searchParams.get('inviteCode')

  // TODO 收到邀请码的后续操作
  useEffect(() => {
    // if (inviteCode?.length === 8)
    //   login()
    // else
    //   message.warning('Illegal invitation code')
  }, [inviteCode])

  useEffect(() => {
    async function fetchData() {
      const res = await LoanService.ApiLoanHomeInfo_GET()
      setHotStarterData(res)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const res = await MarketService.ApiMarketHomeInfo_GET()
      setPopularToFollowData(res)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const params = { ...new Models.ApiLoanPageLoanContractGETParams(), limit: 9, page: 1, state: 'Blacklist' }

      const res = await LoanService.ApiLoanPageLoanContract_GET(params)

      setBlacklist(res)
    }
    fetchData()
  }, [])

  return (
    <div className="relative m-auto h-full min-h-full">
      <div >

        <img
          src={ bannerImage }
          alt='Image 2'
          className='h-280 w-full b-rd-20 object-cover'
        />
      </div>

      <div className="h44" />

      {
        hotStarterData.length > 0
        && <CardsContainer image='' key='HotStarter' title={`🔥${t('market.CardsContainer1.title')}`} records={hotStarterData} to='/view-all?title=🔥Hot starter' />
      }
      <div className='h-44 w-full' />
      {
        popularToFollowData.length > 0
        && <CardsContainer image='' key='PopularToFollow' title={`💥${t('market.CardsContainer2.title')}`} records={popularToFollowData} to='/view-all?title=💥Popular to follow' />
      }

      <div className='h-44 w-full' />

      {
      (blacklist.total && blacklist.total > 0)
        ? <CardsContainer image={blacklist1} key='Blacklist' title={`${t('market.CardsContainer3.title')}`} records={blacklist.records ?? []} to='/view-all?title=Blacklist' />
        : null
      }

    </div>
  )
}

export default Market
