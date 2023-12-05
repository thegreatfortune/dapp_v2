import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Input, Spin, message } from 'antd'
import { ethers } from 'ethers'
import tradingPairTokenMap from './tradingPairTokenMap'
import RepaymentPlan from './RepaymentPlan'
import SwapModal from './SwapModal'
import useBrowserContract from '@/hooks/useBrowserContract'
import SModal from '@/pages/components/SModal'
import type { Models } from '@/.generated/api/models'

interface IProps {
  tradeId: bigint | null
  transactionPair: string[]
  loanMoney: number
  repayCount: number
  refundPoolAddress: string | undefined
  lendState: 'Processing' | 'Success' | undefined
  prePage: string | null
  loanInfo: Models.LoanOrderVO
}

export class TokenInfo {
  name: string | undefined
  balance: string = '0'
  decimals: number = 0
  address: string | undefined
  ratio: number = 0
  dollars: string | undefined
}

const DesignatedPosition: React.FC<IProps> = ({ transactionPair, tradeId, loanInfo, repayCount, refundPoolAddress, lendState, prePage }) => {
  const { browserContractService } = useBrowserContract()

  const [tokenInfos, setTokenInfos] = useState<TokenInfo[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isDepositModalOpen, setDepositIsModalOpen] = useState(false)

  const [depositValue, setDepositValue] = useState<string>()

  const [currentTokenInfo, setCurrentTokenInfo] = useState<TokenInfo>(new TokenInfo())

  const [capitalPoolAddress, setCapitalPoolAddress] = useState<string | undefined>(undefined)

  const [tokenTotals, setTokenTotals] = useState<string>('0')

  const [supplyState, setSupplyState] = useState<'Succeed' | 'Processing'>()

  useEffect(() => {
    const a = tokenInfos.map(e => e.dollars).reduce((pre, cur) => BigNumber(pre ?? 0).plus(cur ?? 0).toString(), '0')
    setTokenTotals(a ?? '0')
  }, [tokenInfos])

  useEffect(() => {
    if (browserContractService === undefined || tradeId === null)
      return

    const fetchData = async () => {
      if (tradeId !== undefined) {
        const address = await browserContractService?.getCapitalPoolAddress(tradeId)
        setCapitalPoolAddress(address)
      }
    }

    fetchData()
  }, [tradeId, browserContractService])

  useEffect(() => {
    if (!browserContractService || !tradeId)
      return
    try {
      setTokenInfos([])

      const proList: Promise<TokenInfo>[] = []

      if (proList.length === 0) {
        const pro = getBalanceByToken(tradingPairTokenMap['USDC'], tradeId, 'USDC')
        pro && proList.push(pro as Promise<TokenInfo>)
      }

      for (let i = 0; i < transactionPair.length; i++) {
        const coin = transactionPair[i] as keyof typeof tradingPairTokenMap
        if (coin in tradingPairTokenMap) {
          const pro = getBalanceByToken(tradingPairTokenMap[coin], tradeId, coin)
          pro && proList.push(pro as Promise<TokenInfo>)
        }
      }

      Promise.all(proList).then((res) => {
        setTokenInfos(preState => ([...preState, ...res]))
      })
    }
    catch (error) {
      console.log('%c [ error ]-65', 'font-size:13px; background:#abdc31; color:#efff75;', error)
    }
  }, [browserContractService, transactionPair, tradeId])

  async function getBalanceByToken(token: string, tradeId: bigint, name?: string): Promise<TokenInfo | undefined> {
    const ERC20Contract = await browserContractService?.getERC20Contract(token)

    const cp = await browserContractService?.getCapitalPoolAddress(tradeId)

    if (!cp)
      return

    const balance = await ERC20Contract?.balanceOf(cp)

    // 查询代币的符号和小数位数
    const symbol = await ERC20Contract?.symbol()
    const decimals = await ERC20Contract?.decimals()
    // console.log('%c [ decimals ]-62', 'font-size:13px; background:#4e2dff; color:#9271ff;', decimals)
    // console.log('%c [ symbol ]-72', 'font-size:13px; background:#5b20b6; color:#9f64fa;', symbol)

    const tokenName = name ?? symbol

    const address = tradingPairTokenMap[tokenName as keyof typeof tradingPairTokenMap]

    let ratio

    if (tokenName !== 'USDC')
      ratio = await browserContractService?.testLiquidity_calculateSwapRatio(address)

    const trulyBalance = ethers.formatUnits(balance ?? 0, decimals)

    const dollars = !ratio ? trulyBalance : String(Number(trulyBalance) * (ratio ?? 0))
    // console.log('%c [ dollars ]-118', 'font-size:13px; background:#597ebe; color:#9dc2ff;', dollars)

    return {
      name: tokenName,
      // balance: Number((balance ?? BigInt(0)) / BigInt(10 ** Number(decimals)) ?? 1),
      balance: trulyBalance,
      decimals: Number(decimals) ?? 0,
      address,
      ratio: ratio ?? 0,
      dollars,
    }
  }

  function onOpenModal(item: TokenInfo) {
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

    setSupplyState('Processing')
    try {
      const res = await browserContractService?.processCenter_supply(ethers.parseEther(depositValue), tradeId)
      setSupplyState('Succeed')

      console.log('%c [ res ]-124', 'font-size:13px; background:#4871f9; color:#8cb5ff;', res)
    }
    catch (error) {
      message.error('Fail supply')
      console.log('%c [ error ]-97', 'font-size:13px; background:#f8b42a; color:#fff86e;', error)
    }
    finally {
      setDepositIsModalOpen(false)
      setSupplyState(undefined)
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

        {
          supplyState === undefined && <div>
            <Input onChange={onDepositValueChange} />
          </div>
        }
        {
          supplyState === 'Processing' && (
            <div >
              <h2>
                Processing
              </h2>
              <Spin />
            </div>
          )
        }
        {
          supplyState === 'Succeed' && <div>
            Succeed
          </div>
        }

      </SModal>

      <div className="flex justify-between">
        <div className="h560 w634">
          <Button type='primary' onClick={onDeposit}>Deposit</Button>

          <div>
            total ${BigNumber(tokenTotals).toFixed(2)}
          </div>
          <div>
            {capitalPoolAddress}

          </div>
        </div>

        <div className="flex flex-wrap" >
          {
            tokenInfos.map(item => (
              <div key={item.name} className="h160 w321 s-container">
                <div>
                  {item.name}({
                    // 如果余额大于零，则计算比例并显示结果
                    Number(item.balance) !== 0
                      ? BigNumber(item.dollars ?? 0)
                        .div((tokenTotals))
                        .times(100)
                        .toFixed(2)
                      : <span>
                        0
                      </span>
                  })
                  %
                  <span className='c-green'>{BigNumber(item.balance).toFixed(4)} {item.name}</span>
                </div>
                <div >$ {item.dollars ? BigNumber(item.dollars).toFixed(2) : 0} </div>

                {
                  item.name !== 'USDC' && prePage === 'loan' && loanInfo.state === 'Trading'
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
