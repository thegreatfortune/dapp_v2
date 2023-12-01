import BigNumber from 'bignumber.js'
import { useState } from 'react'
import { Button, message } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { ethers } from 'ethers'
import ScrollableRepaymentList from '@/pages/components/ScrollableRepaymentList '
import { MarketService } from '@/.generated/api/Market'
import { Models } from '@/.generated/api/models'
import useBrowserContract from '@/hooks/useBrowserContract'
import useUserStore from '@/store/userStore'
import SModal from '@/pages/components/SModal'

const RoomTrade = () => {
  const [searchParams] = useSearchParams()

  const [tradeId] = searchParams.getAll('tradeId')

  const { activeUser } = useUserStore()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const [buyState, setBuyState] = useState<'Processing' | 'Succeed'>()

  const { browserContractService } = useBrowserContract()

  const orderItem = new Models.OrderItem()
  orderItem.column = 'price'

  const [params] = useState({ ...new Models.ApiMarketPageInfoGETParams(), ...{ limit: 8, page: 1 }, state: 'ToBeTraded', orderItemList: encodeURIComponent(JSON.stringify([orderItem])), tradeId, loanId: undefined, marketId: undefined })

  const { isWalletConnected } = useBrowserContract()

  async function onBuy(item: Models.TokenMarketVo) {
    if (!tradeId)
      throw new Error('tradeId is undefined')

    setBuyState('Processing')
    setIsModalOpen(true)

    try {
      if (item.marketId === undefined || item.marketId === null)
        throw new Error('marketId is undefined')

      await browserContractService?.followMarketContract_buyERC3525(BigInt(item.marketId), ethers.parseEther(BigNumber(ethers.formatUnits(item.price ?? 0)).times(item.remainingQuantity ?? 0).toString()))
      setBuyState('Succeed')
    }
    catch (error) {
      message.error('Buy failed')
      console.log('%c [ error ]-34', 'font-size:13px; background:#1fbb1b; color:#63ff5f;', error)
      setBuyState(undefined)
    }
  }

  async function onCancelOrder(item: Models.TokenMarketVo) {
    try {
      if (item.marketId === undefined || item.marketId === null)
        throw new Error('marketId is undefined')

      setBuyState('Processing')
      setIsModalOpen(true)
      await browserContractService?.followMarketContract_cancelOrder(BigInt(item.marketId))
      setBuyState('Succeed')
    }
    catch (error) {
      message.error('Cancel failed')
      console.log('%c [ error ]-61', 'font-size:13px; background:#34c948; color:#78ff8c;', error)
      setBuyState(undefined)
    }
  }

  function onConfirm() {
    setIsModalOpen(false)
    setBuyState(undefined)
  }

  const renderItem = (item: Models.TokenMarketVo) => {
    return (
      <ul className='flex list-none gap-x-168'>
        <li>User </li>
        <li>{item.price && ethers.formatUnits(item.price)} </li>
        <li>{item.remainingQuantity}</li>
        {/* <li>{BigNumber(ethers.formatUnits(item.price ?? 0)).times(item.remainingQuantity ?? 0).toPrecision(2)}</li> */}
        <li> {BigNumber(ethers.formatUnits(item.price ?? 0)).times(item.remainingQuantity ?? 0).toString()}</li>
        <li>{item.depositeTime}</li>
        <li>
          {item.state}
          {isWalletConnected
            ? (
              // 用户已连接钱包
              <>
                {
                  activeUser.id === item.userId
                    ? (
                      <Button className='primary-btn' onClick={() => onCancelOrder(item)}>Cancel</Button>
                      )
                    : (
                      <Button className='primary-btn' onClick={() => onBuy(item)}>Buy</Button>
                      )
                }
              </>
              )
            : (
              // 用户未连接钱包
              <Button className='primary-btn'>Buy</Button>
              )}
        </li>
      </ul>
    )
  }

  return (
    <div>

      <SModal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>

        {
          buyState === 'Processing' && <p>Processing</p>
        }
        {
          buyState === 'Succeed' && <div>
            Share
            <Button className='primary-btn' onClick={onConfirm}>Confirm</Button>
          </div>
        }
      </SModal>

      <ul className='flex list-none gap-x-168'>
        <li>TRADER </li>
        <li>Unit Price</li>
        <li>Quantity</li>
        <li>Total Price</li>
        <li>TIME</li>
        <li>My pending order</li>
      </ul>

      <ScrollableRepaymentList api={MarketService.ApiMarketPageInfo_GET} params={params} containerId='RoomTradeScrollable' renderItem={renderItem} />
    </div>
  )
}

export default RoomTrade
