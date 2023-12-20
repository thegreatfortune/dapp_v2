import { Button, Modal, Radio } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { MarketService } from '../../.generated/api/Market'
import ScrollableList from '../components/ScrollabletList'
import type { Models } from '@/.generated/api/models'
import marketBanner from '@/assets/images/market/banner.png'

const Trade = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const [data, setData] = useState<any[]>([])
  const params: {
    limit: number
    page: number
    orderItemList?: string | undefined
    borrowUserId?: string | undefined
    state?: string | undefined
  } = {
    limit: 8,
    page: 1,
  }

  useEffect(() => {
    // .then((response) => {
    //     setData(response.current)
    //   })

    async function fetchData() {
      const res = await MarketService.ApiMarketPageTradingLoan_GET(params)
      console.log('%c [ res ]-30', 'font-size:13px; background:pink; color:#bf2c9f;', res)
    }

    fetchData()
  }, [])

  const navigate = useNavigate()

  // const [params] = useState({ ...new Models.ApiMarketPageTradingLoanGETParams(), ...{ limit: 8, page: 1 } })

  const renderItem = (item: Models.MarketLoanVo) => {
    return (
      <div className='h125 w315 cursor-pointer s-container' onClick={() => navigate(`/loan-details/?prePage=trade&tradeId=${item.tradeId}`)}>
        <div className='flex justify-between'>
          <span> Price {ethers.formatUnits(String(item.price), BigInt(18))}</span>
          <span> Volume of business {item.totalTradingCompleted}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='m-auto'>
      <img src={marketBanner} alt="" className='m-auto h280 w-full b-rd-20 object-cover' />
      <div className='h80 w-full'></div>
      <div>
        <div className='h48 flex items-center justify-between'>
          <div>
            <h2 className='font-size-34'>
              🔥 Hot
            </h2>
          </div>
          <Radio.Group value='All' className='w453 flex'>
            {/* <Radio.Button value="All" className='m-a h48 w100 items-center text-center text-18 font-500 lh-48 c-#fff'>All</Radio.Button> */}
            <button className='m-a h48 w100 items-center b-rd-4 text-center text-18 font-500 lh-48 c-#fff primary-btn'>All</button>
            <div className='ml-20 w333 flex justify-between b-2px b-#0980ed b-rd-4 b-solid'>
              <Radio.Button value="LowRisk" className='h48 w167 items-center text-18 font-500 lh-48'>🌈 Low Risk</Radio.Button>
              <div className='h45 w0 b-2px b-#0A80ED b-rd-0 b-solid'></div>
              <Radio.Button value="HighRisk" className='h48 w206 items-center text-18 font-500 lh-48'>🎉 High Risk</Radio.Button>
            </div>
          </Radio.Group>
        </div>

        <div className='h23 w-full'></div>

        <Button type="primary" onClick={showModal}>
          Open Modal
        </Button>
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>

        <ScrollableList api={MarketService.ApiMarketPageTradingLoan_GET} params={params} containerId='RoomTradeScrollable' renderItem={renderItem} />
      </div>
    </div>
  )
}

export default Trade
