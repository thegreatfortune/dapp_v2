import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button } from 'antd'
import tradingPairTokenMap from './tradingPairTokenMap'
import RepaymentPlan from './RepaymentPlan'
import SwapModal from './SwapModal'
import useBrowserContract from '@/hooks/useBrowserContract'

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
  balance: number = 0
  decimals: number = 0
  address: string | undefined
}

const DesignatedPosition: React.FC<IProps> = ({ transactionPair, tradeId, loanMoney, repayCount, refundPoolAddress, lendState }) => {
  const { browserContractService } = useBrowserContract()

  const [coinInfos, setCoinInfos] = useState<CoinInfo[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)

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

    // 查询代币的符号和小数位数
    const symbol = await ERC20Contract?.symbol()
    const decimals = await ERC20Contract?.decimals()
    console.log('%c [ decimals ]-62', 'font-size:13px; background:#4e2dff; color:#9271ff;', decimals)
    console.log('%c [ symbol ]-72', 'font-size:13px; background:#5b20b6; color:#9f64fa;', symbol)

    const tokenName = name ?? symbol

    return {
      name: tokenName,
      balance: Number((balance ?? BigInt(0)) / BigInt(10 ** Number(decimals)) ?? 1),
      decimals: Number(decimals) ?? 0,
      address: tradingPairTokenMap[tokenName as keyof typeof tradingPairTokenMap],
    }
  }

  function onOpenModal(item: CoinInfo) {
    setCurrentTokenInfo(item)
    setIsModalOpen(true)
  }

  return (
    <div>
      <SwapModal currentTokenInfo={currentTokenInfo} open={isModalOpen} onCancel={() => setIsModalOpen(false)} />

      <div className="flex justify-between">
        <div className="h560 w634">
        </div>
        <div className="flex flex-wrap" >
          {
            coinInfos.map(item => (
              <div key={item.name} className="h160 w321 s-container">
                <div>
                  {item.name}({
                    // 如果余额大于零，则计算比例并显示结果
                    item.balance > 0
                      ? BigNumber(loanMoney).div(BigNumber(10).pow(item.decimals))
                        .dividedBy(item.balance)
                        .toFixed(2)
                      : <span>
                        0
                      </span>

                  })
                  %
                </div>
                <div >$ {item.balance}</div>
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
