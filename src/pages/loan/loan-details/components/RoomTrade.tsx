import BigNumber from 'bignumber.js'
import { useState } from 'react'
import { Button, message } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { ethers } from 'ethers'
import SorterScrollableList from './SorterScrollableList'
import type { Models } from '@/.generated/api/models'
import useBrowserContract from '@/hooks/useBrowserContract'
import useUserStore from '@/store/userStore'
import SModal from '@/pages/components/SModal'

const RoomTrade = () => {
  const [searchParams] = useSearchParams()

  const [tradeId] = searchParams.getAll('tradeId')

  const { activeUser } = useUserStore()

  const { browserContractService } = useBrowserContract()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const [buyState, setBuyState] = useState<'Processing' | 'Succeed'>()

  const { isWalletConnected } = useBrowserContract()

  const renderItem = (item: Models.TokenMarketVo) => {
    return (
      <ul className='flex list-none gap-x-168' key={item.loanId}>
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

      <SorterScrollableList activeUser={activeUser} renderItem={renderItem} tradeId={Number(tradeId)} />

    </div>
  )
}

export default RoomTrade
