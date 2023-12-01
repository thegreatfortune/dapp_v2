import Carousel from 'antd/es/carousel'
import { useEffect, useState } from 'react'
import bannerImg from '../../assets/images/banner.png'
import { LoanService } from '../../.generated/api/Loan'
import CardsContainer from '../components/CardsContainer'
import { Models } from '@/.generated/api/models'
import useNavbarQueryStore from '@/store/useNavbarQueryStore'
import { isContractAddress, isTwitterHandle } from '@/utils/regex'

const Market = () => {
  const [loanOrderVO, setLoanOrderVO] = useState<Models.LoanOrderVO[]>([])

  const { queryString } = useNavbarQueryStore()

  // const [risk, setRisk] = useState<'All' | 'LowRisk' | 'HighRisk'>('All')

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

  return (
    <div className="mt50 w-full">
      <Carousel autoplay>
        <div>
          <img
            src={bannerImg}
            alt="Image 1"
            className="h280 w-full rounded-20 object-cover"
          />
        </div>
        <div>
          <img
            src="https://s.cn.bing.net/th?id=OHR.HautBarr_ZH-CN8274813404_1920x1080.webp&qlt=5"
            alt="Image 1"
            className="h280 w-full object-cover"
          />
        </div>
      </Carousel>

      <div className='h63 w-full'></div>

      <CardsContainer key='HighCredit' title='🔥 High Credit' records={loanOrderVO} to='/view-all?title=🔥 High Credit' />
      <CardsContainer key='PopularToFollow' title='💥 Popular to follow' records={loanOrderVO} to='/view-all?title=💥 Popular to follow' />
      <CardsContainer key='Blacklist' title='Blacklist' records={loanOrderVO} to='/view-all?title=Blacklist' />

    </div>
  )
}

export default Market
