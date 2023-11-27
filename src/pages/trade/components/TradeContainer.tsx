import { useState } from 'react'
import Radio from 'antd/es/radio'
import { Link, useNavigate } from 'react-router-dom'
import type { Models } from '@/.generated/api/models'

interface ICardsContainerProps {
//   records: Models.LoanOrderVO[]
  title: string
  isViewAll?: boolean
  to?: string

//   children: React.ReactNode
}

const TradeContainer: React.FC<ICardsContainerProps> = ({ title, isViewAll, to }) => {
  const navigate = useNavigate()

  const [risk, setRisk] = useState<'All' | 'LowRisk' | 'HighRisk'>('All')

  return (<div>
      <div className='h48 flex items-center justify-between'>
        <div>
          <h2 className='font-size-34'>
            {title}
          </h2>
        </div>

        {/* {children} */}

        {isViewAll
          ? <Radio.Group value={risk} onChange={e => setRisk(e.target.value)} >
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
      666
      </div>

    </div>)
}

export default TradeContainer
