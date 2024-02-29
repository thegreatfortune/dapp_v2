/* eslint-disable @typescript-eslint/indent */
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
import toCurrencyString from '@/utils/convertToCurrencyString'

const SharesMarket = () => {
  const [searchParams] = useSearchParams()

  const [tradeId] = searchParams.getAll('tradeId')

  const { currentUser } = useUserStore()

  const { browserContractService } = useBrowserContract()

  const [sellModalOpen, setSellModalOpen] = useState<boolean>(false)
  const [executing, setExecuting] = useState(false)

  const [buyModalOpen, setBuyModalOpen] = useState(false)

  const [currentItem, setCurrentItem] = useState<Models.TokenMarketVo>()

  const { isWalletConnected } = useBrowserContract()

  const renderItem = (item: Models.TokenMarketVo, index: number) => {
    return (
      <div className='w-full'>
        <ul className='grid grid-cols-6 h68 w-full list-none items-center gap-4 rounded-11 bg-#171822 ps-0' key={item.loanId}>
          {/* <li>{index + 1} */}
          <li>
            <div className='flex'>
              <span className='h40 w40' ><Avatar size={40} src={item.userInfo?.pictureUrl} /></span>
              <span className=''>
                <div className='ml-15'>{item.userInfo?.nickName}</div>
                <span className='ml-15'>{item.userInfo?.platformName}</span>
              </span>
            </div>
          </li>
          <li>$ {item.price && toCurrencyString(Number(ethers.formatUnits(item.price)))}</li>
          <li>{item.amount}</li>
          {/* <li>{BigNumber(ethers.formatUnits(item.price ?? 0)).times(item.remainingQuantity ?? 0).toPrecision(2)}</li> */}
          <li>$ {toCurrencyString(Number(BigNumber(ethers.formatUnits(item.price ?? 0)).times(item.amount ?? 0)))}</li>
          <li>{item.depositeTime && dayjs.unix(item.depositeTime).format('YYYY-MM-DD HH:mm:ss')}</li>
          <li>
            {isWalletConnected
              ? (
                // 用户已连接钱包
                <>
                  {
                    currentUser.userId === item.userId
                      ? (
                        <Button className='h30 w100 items-center b-rd-30' onClick={() => {
                          setCurrentItem(item)
                          setSellModalOpen(true)
                        }}
                        >Cancel</Button>
                        // <Button className='h25 w72 b-rd-30 primary-btn' onClick={() => onCancelOrder(item)}>Cancel</Button>
                      )
                      : (
                        // <Button className='h25 w72 b-rd-30 primary-btn' onClick={() => onBuy(item)}>Buy</Button>
                        <Button className='h30 w100 b-rd-30 primary-btn' onClick={() => {
                          setCurrentItem(item)
                          setBuyModalOpen(true)
                        }}
                        >Buy</Button>
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
      </div>
    )
  }

  async function onBuyOrder(item: Models.TokenMarketVo) {
    if (!tradeId)
      throw new Error('tradeId is undefined')
    setExecuting(true)

    try {
      if (item.marketId === undefined || item.marketId === null)
        throw new Error('MarketId is undefined')

      await browserContractService?.followMarketContract_buyERC3525(BigInt(item.marketId), ethers.parseEther(BigNumber(ethers.formatUnits(item.price ?? 0)).times(item.remainingQuantity ?? 0).toString()))
      setExecuting(false)
      setBuyModalOpen(false)
    }
    catch (error) {
      message.error('Buy failed')
      console.log('%c [ error ]-34', 'font-size:13px; background:#1fbb1b; color:#63ff5f;', error)
      setExecuting(false)
    }
  }

  async function onCancelOrder(item: Models.TokenMarketVo) {
    try {
      if (item.marketId === undefined || item.marketId === null)
        throw new Error('MarketId is undefined')
      setExecuting(true)
      console.log('%c [ item.marketId ]-99', 'font-size:13px; background:#dedc23; color:#ffff67;', item.marketId)
      await browserContractService?.followMarketContract_cancelOrder(BigInt(item.marketId))
      setExecuting(false)
      setSellModalOpen(false)
    }
    catch (error) {
      message.error('Cancel failed')
      console.log('%c [ error ]-61', 'font-size:13px; background:#34c948; color:#78ff8c;', error)
      setExecuting(false)
    }
  }

  return (
    <div className='w-full' >
      <SModal open={sellModalOpen} content={
        <div>
          <h2>Cancal</h2>
        </div>
      }
        okText={'Confirm'}
        onOk={() => onCancelOrder(currentItem!)}
        okButtonProps={{
          className: 'primary-btn',
          disabled: executing,
        }}
        onCancel={() => setSellModalOpen(false)}
      >
      </SModal>

      <SModal open={buyModalOpen} content={
        <div>
          <h2>Buy</h2>
        </div>
      }
        okText={'Confirm'}
        onOk={() => onBuyOrder(currentItem!)}
        okButtonProps={{
          className: 'primary-btn',
          disabled: executing,
        }}
        onCancel={() => setBuyModalOpen(false)}
      >
      </SModal>

      {/* // TODO 默认Unit Price 升序排序 */}
      <ul className='grid grid-cols-6 list-none c-#666873'>
        {/* <li className='flex justify-center text-16'>SN</li> */}
        <li>Trader</li>
        <li>Unit Price</li>
        <li>Quantity</li>
        <li>Total Price</li>
        <li>Time</li>
        <li>Action</li>
      </ul>
      <SorterScrollableList
        grid={{ gutter: 16, column: 6 }}
        containerId={'SharesMarketContainerId'}
        currentUser={currentUser}
        renderItem={renderItem}
        tradeId={Number(tradeId)}
      />
    </div>
  )
}

export default SharesMarket
