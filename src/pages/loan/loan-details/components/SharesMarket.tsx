import BigNumber from 'bignumber.js'
import { useState } from 'react'
import { Avatar, Button, message } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { ethers } from 'ethers'
import dayjs from 'dayjs'
import SorterScrollableList from './SorterScrollableList'
import type { Models } from '@/.generated/api/models'
import useBrowserContract from '@/hooks/useBrowserContract'
import useUserStore from '@/store/userStore'
import SModal from '@/pages/components/SModal'

const SharesMarket = () => {
  const [searchParams] = useSearchParams()

  const [tradeId] = searchParams.getAll('tradeId')

  const { activeUser } = useUserStore()

  const { browserContractService } = useBrowserContract()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const [buyState, setBuyState] = useState<'Processing' | 'Succeed'>()

  const { isWalletConnected } = useBrowserContract()

  const renderItem = (item: Models.TokenMarketVo, index: number) => {
    return (
      <ul className='grid grid-cols-6 h68 w-full list-none items-center gap-4 rounded-11 bg-#171822' key={item.loanId}>
        {/* <li>{index + 1} */}
        <li>
        <div className='flex'>
          <span className='h40 w40' ><Avatar size={40} src={item.userInfo?.pictureUrl}/></span>
          <span className=''>
            <div className='ml-15'>{item.userInfo?.nickName}</div>
            <span className='ml-15'>{item.userInfo?.platformName}</span>
          </span>
          </div>
        </li>
        <li>{item.price && ethers.formatUnits(item.price)}</li>
        <li>{item.remainingQuantity}</li>
        {/* <li>{BigNumber(ethers.formatUnits(item.price ?? 0)).times(item.remainingQuantity ?? 0).toPrecision(2)}</li> */}
        <li> {BigNumber(ethers.formatUnits(item.price ?? 0)).times(item.remainingQuantity ?? 0).toString()}</li>
        <li>{item.depositeTime && dayjs.unix(item.depositeTime).format('YYYY-MM-DD HH:mm:ss')}</li>
        <li>
          {isWalletConnected
            ? (
              // 用户已连接钱包
              <>
                {
                  activeUser.id === item.userId
                    ? (
                      <Button className='h25 w72 b-rd-30 primary-btn' onClick={() => onCancelOrder(item)}>Cancel</Button>
                      )
                    : (
                      <Button className='h25 w72 b-rd-30 primary-btn' onClick={() => onBuy(item)}>Buy</Button>
                      )
                }
              </>
              )
            : (
              // 用户未连接钱包
              <Button className='h25 w72 b-rd-30 primary-btn'>Buy</Button>
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
      console.log('%c [ item.marketId ]-99', 'font-size:13px; background:#dedc23; color:#ffff67;', item.marketId)
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

      {/* // TODO 默认Unit Price 升序排序 */}

      <SorterScrollableList activeUser={activeUser} renderItem={renderItem} tradeId={Number(tradeId)} />

    </div>
  )
}

export default SharesMarket
