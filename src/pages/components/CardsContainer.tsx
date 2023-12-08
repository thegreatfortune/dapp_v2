import { useState } from 'react'
import Radio from 'antd/es/radio'
import { Link, useNavigate } from 'react-router-dom'
import { Image } from 'antd'
import TransparentCard from './TransparentCard'
import type { Models } from '@/.generated/api/models'

interface ICardsContainerProps {
  records: Models.LoanOrderVO[]
  title: string
  isViewAll?: boolean
  to?: string
  image: string

  //   children: React.ReactNode
}

const CardsContainer: React.FC<ICardsContainerProps> = ({ records, title, isViewAll, to, image }) => {
  const navigate = useNavigate()

  const [risk, setRisk] = useState<'All' | 'LowRisk' | 'HighRisk'>('All')

  return (
    <div>
      <div className='h48 min-h-full flex items-center justify-between'>
        <div className='flex items-center justify-between'>
          {image && <Image src={image} preview={false} className='mr-5 h-50 w-50 pl-7 pr-10' />}

          <h2 className='ml-4 font-size-34'>
            {title}
          </h2>
        </div>

        {/* {children} */}

        {isViewAll
          ? <Radio.Group value={risk} onChange={e => setRisk(e.target.value)}>
            <Radio.Button value="All">All</Radio.Button>
            <Radio.Button value="LowRisk">LowRisk</Radio.Button>
            <Radio.Button value="HighRisk">HighRisk</Radio.Button>
          </Radio.Group>
          : <div className='font-size-14 c-[#D2D2D2]'>
            <Link to={to ?? ''}> view all {'>>'}</Link>
          </div>
        }
      </div>

      <div className='h23 w-full'></div>

      <div className='flex flex-wrap gap-x-46 gap-y-50'>
        {
          records.map(e => <div key={e.tradeId} onClick={() => navigate(`/loan-details?prePage=market&tradeId=${e.tradeId}`)} > <TransparentCard key={e.tradeId} item={e} /></div>)
        }
      </div>

    </div>)
}

export default CardsContainer
