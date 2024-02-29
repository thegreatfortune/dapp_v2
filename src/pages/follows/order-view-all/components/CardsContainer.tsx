import Radio from 'antd/es/radio'
import { Link, useNavigate } from 'react-router-dom'
import { Image } from 'antd'
import TransparentCard from '../../../components/TransparentCard'
import type { Models } from '@/.generated/api/models'

interface ICardsContainerProps {
  records: Models.LoanOrderVO[]
  title: string
  isViewAll?: boolean
  to?: string
  image: string
  fetchData?(type?: string): Promise<void>
}

const CardsContainer: React.FC<ICardsContainerProps> = ({ records, title, isViewAll, to, image, fetchData }) => {
  const navigate = useNavigate()

  return (
    <div>
      <div className='h48 min-h-full flex items-center justify-between'>
        <div className='flex items-center justify-between'>
          {image && <Image src={image} preview={false} className='mr-5 h-50 w-50 pl-7 pr-10' />}

          <span className='page-title'>
            {title}
          </span>
        </div>

        {/* {children} */}

        {isViewAll
          ? <Radio.Group defaultValue='All' onChange={e => fetchData && fetchData(e.target.value)}>
            <Radio.Button className='radio-btn-all' value="All">All</Radio.Button>
            <Radio.Button className='radio-btn-other' value="LowRisk">LowRisk</Radio.Button>
            <Radio.Button className='radio-btn-other' value="HighRisk">HighRisk</Radio.Button>
          </Radio.Group>
          : <div className='font-size-14 c-[#D2D2D2]'>
            {/* // TODO records.length > 4 */}
            {
              records.length > 4 && <Link to={to ?? ''} className='c-white'> view all {'>>'}</Link>
            }

          </div>
        }
      </div>

      <div className='h30 w-full'></div>

      {/* <ScrollableList api={MarketService.ApiMarketPageTradingLoan_GET} params={params} containerId='RoomTradeScrollable' renderItem={()=><TransparentCard key={e.tradeId} item={e} />} /> */}

      <div className='flex flex-wrap gap-x-46 gap-y-50'>
      {
       records.map(e => <div key={e.tradeId} onClick={() => navigate(`/loan-details?prePage=market&tradeId=${e.tradeId}`)} > <TransparentCard key={e.tradeId} item={e} /></div>)
        }
      </div>

    </div>)
}

export default CardsContainer
