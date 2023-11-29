import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Input } from 'antd'
import { ethers } from 'ethers'
import tradingPairTokenMap from './tradingPairTokenMap'
import RepaymentPlan from './RepaymentPlan'
import SwapModal from './SwapModal'
import useBrowserContract from '@/hooks/useBrowserContract'
import SModal from '@/pages/components/SModal'

interface IProps {
  tradeId: bigint | null
  transactionPair: string[]
  loanMoney: number
  repayCount: number
  refundPoolAddress: string | undefined
  lendState: 'Processing' | 'Success' | undefined
}

export class CoinInfo {
  name: string | undefined
  balance: string = '0'
  decimals: number = 0
  address: string | undefined
}

const DesignatedPosition: React.FC<IProps> = ({ transactionPair, tradeId, loanMoney, repayCount, refundPoolAddress, lendState }) => {
  const { browserContractService } = useBrowserContract()

  const [coinInfos, setCoinInfos] = useState<CoinInfo[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isDepositModalOpen, setDepositIsModalOpen] = useState(false)

  const [depositValue, setDepositValue] = useState<string>()

  const [currentTokenInfo, setCurrentTokenInfo] = useState<CoinInfo>(new CoinInfo())

  useEffect(() => {
    if (!browserContractService || !tradeId)
      return

    setCoinInfos([])

    const proList: Promise<CoinInfo>[] = []

    if (proList.length <= 0) {
      const pro = getBalanceByToken(tradingPairTokenMap['USDC'], tradeId, 'USDC')
      pro && proList.push(pro as Promise<CoinInfo>)
    }

    for (let i = 0; i < transactionPair.length; i++) {
      const coin = transactionPair[i] as keyof typeof tradingPairTokenMap
      if (coin in tradingPairTokenMap) {
        const pro = getBalanceByToken(tradingPairTokenMap[coin], tradeId, coin)
        pro && proList.push(pro as Promise<CoinInfo>)
      }
    }

    Promise.all(proList).then((res) => {
      setCoinInfos(preState => ([...preState, ...res]))
    })
  }, [browserContractService, transactionPair, tradeId])

  async function getBalanceByToken(token: string, tradeId: bigint, name?: string): Promise<CoinInfo | undefined> {
    const ERC20Contract = await browserContractService?.getERC20Contract(token)

    const cp = await browserContractService?.getCapitalPoolAddress(tradeId)

    if (!cp)
      return

    const balance = await ERC20Contract?.balanceOf(cp)
    console.log('%c [ balance ]-69', 'font-size:13px; background:#3a57d0; color:#7e9bff;', balance)

    // 查询代币的符号和小数位数
    const symbol = await ERC20Contract?.symbol()
    const decimals = await ERC20Contract?.decimals()
    console.log('%c [ decimals ]-62', 'font-size:13px; background:#4e2dff; color:#9271ff;', decimals)
    console.log('%c [ symbol ]-72', 'font-size:13px; background:#5b20b6; color:#9f64fa;', symbol)

    const tokenName = name ?? symbol

    return {
      name: tokenName,
      // balance: Number((balance ?? BigInt(0)) / BigInt(10 ** Number(decimals)) ?? 1),
      balance: BigNumber(String(balance ?? 0)).div(BigNumber(10).pow(String(decimals))).toPrecision(4),
      decimals: Number(decimals) ?? 0,
      address: tradingPairTokenMap[tokenName as keyof typeof tradingPairTokenMap],
    }
  }

  function onOpenModal(item: CoinInfo) {
    setCurrentTokenInfo(item)
    setIsModalOpen(true)
  }

  function onDeposit() {
    setDepositIsModalOpen(true)
  }

  function onDepositValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newCount = e.target.value.replace(/[^0-9.]/g, '')
    setDepositValue(newCount ?? '0')
  }

  async function onDepositModalConfirm() {
    if (!depositValue || !tradeId)
      return 0

    try {
      console.log('%c [ tradeId ]-122', 'font-size:13px; background:#efa7f5; color:#ffebff;', tradeId)
      console.log('%c [ depositValue ]-122', 'font-size:13px; background:#7062e8; color:#b4a6ff;', depositValue)
      const res = await browserContractService?.processCenter_supply(ethers.parseEther(depositValue), tradeId)

      console.log('%c [ res ]-124', 'font-size:13px; background:#4871f9; color:#8cb5ff;', res)
    }
    catch (error) {
      console.log('%c [ error ]-97', 'font-size:13px; background:#f8b42a; color:#fff86e;', error)
    }
    finally {
      setDepositIsModalOpen(false)
    }
  }

  return (
    <div>
      <SwapModal tradeId={tradeId} currentTokenInfo={currentTokenInfo} open={isModalOpen} onCancel={() => setIsModalOpen(false)} />

      <SModal open={isDepositModalOpen} onCancel={() => setDepositIsModalOpen(false)} footer={
        <div>
          <Button onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button type='primary' onClick={onDepositModalConfirm} >
            Confirm
          </Button>
        </div>}>
        <Input onChange={onDepositValueChange} />

        {/* <div>
        </div> */}
      </SModal>

      <div className="flex justify-between">
        <div className="h560 w634">
        <Button type='primary' onClick={onDeposit}>Deposit</Button>
        </div>
        {JSON.stringify(coinInfos)}
        <div className="flex flex-wrap" >
          {
            coinInfos.map(item => (
              <div key={item.name} className="h160 w321 s-container">
                <div>

                  {item.name}({
                    // 如果余额大于零，则计算比例并显示结果
                    item.balance !== '0'
                      ? BigNumber(loanMoney).div(BigNumber(10).pow(item.decimals))
                        .dividedBy(item.balance)
                        .toFixed(2)
                      : <span>
                        0
                      </span>

                  })
                  %
                  <span className='c-green'>{item.balance} {item.name}</span>
                </div>
                <div >$ $</div>
                {
                  item.name !== 'USDC'
                    ? <Button className='h30 w50 primary-btn' onClick={() => onOpenModal(item)}>swap</Button>
                    : null
                }
              </div>
            ))
          }
        </div>
      </div>

      <RepaymentPlan lendState={lendState} refundPoolAddress={refundPoolAddress} tradeId={tradeId} repayCount={repayCount} />
    </div>
  )
}

export default DesignatedPosition
