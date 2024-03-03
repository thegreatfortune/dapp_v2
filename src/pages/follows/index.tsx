import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'
import MarketCardsContainer from './components/MarketCardsContainer'
import type { Models } from '@/.generated/api/models'
import bannerImage from '@/assets/images/market/banner.png'

import './ticket.scss'
import loanService from '@/services/loanService'

const Follows = () => {
  const chainId = useChainId()

  const [trendingLoansData, setTrendingLoansData] = useState<Models.IPageResult<Models.LoanOrderVO>>()

  const [allLoansData, setAllLoansData] = useState<Models.IPageResult<Models.LoanOrderVO>>()

  // const [blacklist, setBlacklist] = useState<Models.IPageResult<Models.LoanOrderVO>>()

  const { t } = useTranslation()

  useEffect(() => {
    async function fetchData() {
      const trendingLoansPromise = loanService.getLoanList(
        chainId,
        {
          page: 1,
          limit: 8,
          orderItemList: 'actual_share_count=false',
          state: 'Following',
        })

      const allLoansPromise = loanService.getLoanList(
        chainId,
        {
          page: 1,
          limit: 8,
          orderItemList: 'total_market_trading_price=false',
          state: 'Trading,PaidOff,PaidButArrears,CloseByUncollected',
        })

      const result = await Promise.all([trendingLoansPromise, allLoansPromise])

      setTrendingLoansData(result[0])
      setAllLoansData(result[1])
    }
    fetchData()
  }, [])

  // useEffect(() => {
  //   async function fetchData() {
  //     const params = { ...new Models.ApiLoanPageLoanContractGETParams(), limit: 4, page: 1, state: 'Blacklist' }

  //     const res = await LoanService.ApiLoanPageLoanContract_GET(chainId, params)

  //     setBlacklist(res)
  //   }
  //   fetchData()
  // }, [])

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
        (trendingLoansData && trendingLoansData.records.length > 0)
        && <MarketCardsContainer image='' key='TrendingLoans' title={`${t('market.CardsContainer1.title')}`}
          records={trendingLoansData.records} to='/view-all?title=Trending Loans&category=TrendingLoans' />
      }
      {
        (allLoansData && allLoansData.records.length > 0)
        && <MarketCardsContainer image='' key='PopularToFollow' title={`💥${t('market.CardsContainer2.title')}`}
          records={allLoansData.records} to='/view-all?title=All Loans&category=AllLoans' />
      }

      {/* {
        (blacklist.total && blacklist.total > 0)
          ? <MarketCardsContainer image={blacklist1} key='Blacklist' title={`${t('market.CardsContainer3.title')}`} records={blacklist.records ?? []} to='/view-all?title=Blacklist&category=Blacklist' />
          : null
      } */}

    </div >
  )
}

export default Follows
