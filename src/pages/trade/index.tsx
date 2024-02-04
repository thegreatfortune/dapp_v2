import { Avatar, Radio } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { MarketService } from '../../.generated/api/Market'
import ScrollableList from '../components/ScrollabletList'
import { Models } from '@/.generated/api/models'
import marketBanner from '@/assets/images/market/banner.png'
import { isContractAddress } from '@/utils/regex'
import { maskWeb3Address } from '@/utils/maskWeb3Address'
import logo from '@/assets/images/portalImages/logo.png'
import toCurrencyString from '@/utils/convertToCurrencyString'

const Trade = () => {
  const [params, setParams] = useState({ ...new Models.ApiMarketPageTradingLoanGETParams(), limit: 8, page: 1 })

  const [activeKey, setActiveKey] = useState('All')

  function fetchData(type?: string) {
    setActiveKey(type ?? 'All')

    const params = { ...new Models.ApiMarketPageTradingLoanGETParams(), limit: 8, page: 1 }

    if (type === 'LowRisk')
      params.tradingFormTypeStr = 'SpotGoods'
    else if (type === 'HighRisk')
      params.tradingFormTypeStr = 'Contract,Empty'
    setParams(params)
  }

  const navigate = useNavigate()

  const renderItem = (item: Models.MarketLoanVo, index: number) => {
    return (
      <div key={index.toString()} className='s-container flex grow justify-center'
        onClick={() => navigate(`/loan-details/?prePage=trade&tradeId=${item.tradeId}`)}>
        <div
          style={{
            backgroundImage: 'linear-gradient(120deg, #171822 0%, #7e7f7d 80%, #4f504f 100%)',
            // fontVariantNumeric: 'slashed-zero',
          }}
          className='card box-border h-230 w-380 flex flex-col cursor-pointer justify-between border-2 border-#303241 b-rd-6 rounded-10 border-solid bg-[#171822] shadow-2xl'
        >
          <div className='mt-20 flex justify-between'>
            <div className='ml-20 h50 w50 b-rd-0'>
              <Avatar size={50} src={item.user?.pictureUrl ? item.user?.pictureUrl : logo} />
            </div>
            <div className='grid mr-32 mt-5 text-right'>
              <span className='h25 text-18 font-bold lh-20 font-mono uppercase slashed-zero'>{
                isContractAddress(item.user?.nickName ?? '') ? maskWeb3Address(item.user?.nickName ?? '') : (item.user?.nickName ?? 'Not bound')}</span>
              <span className='h18 w-full text-14 font-400 lh-18 c-#999'>@{item.user?.platformName ?? 'Not bound'}</span>
            </div>
          </div>

          <div className='mb-20 flex justify-between'>
            <div className='ml-32 flex items-end font-bold text-slate-400'>SFT</div>
            <div className='w-150'>
              <div className='mr-32 flex justify-between font-bold font-mono slashed-zero'>
                <div>Price: </div>
                <div>${toCurrencyString(Number(ethers.formatUnits(String(item.price), BigInt(18))))}</div>
              </div>
              <div className='mr-32 flex justify-between text-12 font-mono slashed-zero'>
                <div className=''>Volume: </div>
                <div>${item.totalTradingCompleted}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className='m-auto'>
      <img src={marketBanner} alt="" className='m-auto h280 w-full b-rd-20 object-cover' />
      <div className='h80 w-full'></div>

      <div className='h48 flex items-center justify-between'>
        <div>
          <h2 className='font-size-34'>
            🔥 Hot Trade
          </h2>
        </div>
        <Radio.Group defaultValue='All' className='w453 flex' onChange={e => fetchData(e.target.value)} buttonStyle='solid'>
          {/* <Radio.Button value="All" className='m-a h48 w100 items-center text-center text-18 font-500 lh-48 c-#fff'>All</Radio.Button> */}
          <Radio.Button
            value="All"
            className='m-auto mr-20 h40 w-100 border-1px b-rd-6 text-center lh-40'>
            All
          </Radio.Button>
          <Radio.Button
            value="LowRisk"
            className={`h40 w140 items-center lh-40 ${activeKey === 'LowRisk' && 'bg-gradient-to-r from-[#0154fa] to-[#11b5dd]'}`}>
            <div className='flex justify-center'>
              <InfoCircleOutlined className='mr-4 text-slate-500' /> Low Risk
            </div>
          </Radio.Button>
          <Radio.Button
            value="HighRisk"
            className={`h40 w140 items-center lh-40 ${activeKey === 'HighRisk' && 'bg-gradient-to-r from-[#0154fa] to-[#11b5dd]'}`}>
            <div className='flex justify-center'>
              <WarningOutlined className='mr-4 text-red-500' /> High Risk
            </div>
          </Radio.Button>

        </Radio.Group>
      </div>

      <div className='h80 w-full'></div>

      <ScrollableList
        grid={{ gutter: 16 }}
        api={MarketService.ApiMarketPageTradingLoan_GET}
        params={params}
        containerId='TradeScrollable'
        renderItem={renderItem} />
    </div>
  )
}

export default Trade
