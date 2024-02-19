import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image } from 'antd'
import { LoanService } from '../../.generated/api/Loan'
import MarketCardsContainer from './components/MarketCardsContainer'
import { Models } from '@/.generated/api/models'
import bannerImage from '@/assets/images/market/banner.png'
import blacklist1 from '@/assets/images/market/blacklist1.png'
import tlogo from '@/assets/images/portalImages/tLogo.png'

import './ticket.scss'

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
    <div className="">
      <div className='w-full' >
        <img
          src={bannerImage}
          alt='Image 2'
          className='banner w-full b-rd-20 object-cover'
        />
      </div>
      <div className="h44" />
      {/* <div className='flex justify-around'>
        <div className='relative h-241 min-w-380 w-380 flex flex-col rounded-15 bg-#141d29'>
          <div className='absolute left--40 top--20 h-280 w-280 flex items-center justify-center opacity-5'>
            <Image preview={false} src={tlogo}></Image>
          </div>

          <div className='absolute bottom-5 right-20 z-10 opacity-90'>
            <span className='from-[#5eb6d2] to-[#8029e8] bg-gradient-to-r bg-clip-text text-12 text-transparent font-bold' style={{
              filter: 'drop-shadow(0.5mm 0.5mm 1mm #5eb6d2)',
            }}>FOLLOW FINANCE</span>
          </div>
        </div>
      </div> */}

      {
        (hotStarterData.records && hotStarterData.records.length > 0)
        && <MarketCardsContainer image='' key='HotStarter' title={`🔥${t('market.CardsContainer1.title')}`} records={hotStarterData.records} to='/view-all?title=🔥Hot starter&category=HotStarter' />
      }
      {
        (popularToFollowData.records && popularToFollowData.records.length > 0)
        && <MarketCardsContainer image='' key='PopularToFollow' title={`💥${t('market.CardsContainer2.title')}`} records={popularToFollowData.records} to='/view-all?title=💥Popular to follow&category=PopularToFollow' />
      }

      {/* {
        (blacklist.total && blacklist.total > 0)
          ? <MarketCardsContainer image={blacklist1} key='Blacklist' title={`${t('market.CardsContainer3.title')}`} records={blacklist.records ?? []} to='/view-all?title=Blacklist&category=Blacklist' />
          : null
      } */}

    </div >
  )
}

export default Market
