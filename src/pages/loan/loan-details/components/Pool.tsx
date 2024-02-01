import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import type { TabsProps } from 'antd'
import { Button, Image, Input, Spin, Tabs, message } from 'antd'
import { ethers } from 'ethers'
import tradingPairTokenMap, { tokenList } from '../../../../contract/tradingPairTokenMap'
import RepaymentPlan from './RepaymentPlan'
import SwapModal from './SwapModal'
import Address from './Address'
import LoanHistory from './LoanHistory'
import { createKLine } from './createKLine'
import useBrowserContract from '@/hooks/useBrowserContract'
import SModal from '@/pages/components/SModal'
import type { Models } from '@/.generated/api/models'
import { PortfolioService } from '@/.generated/api'

interface IProps {
  tradeId: bigint | null
  transactionPair: string[]
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
  ratio: string = '0'
  dollars: string | undefined
  icon: string | undefined
}

const Pool: React.FC<IProps> = ({ transactionPair, tradeId, loanInfo, repayCount, refundPoolAddress, lendState, prePage }) => {
  const { browserContractService } = useBrowserContract()

  const [tokenInfos, setTokenInfos] = useState<TokenInfo[]>([])

  const [uniqueTokenInfos, setUniqueTokenInfos] = useState<TokenInfo[]>([])

  const [isSwapModalOpen, setSetIsModalOpen] = useState(false)

  const [isDepositModalOpen, setDepositIsModalOpen] = useState(false)

  const [depositValue, setDepositValue] = useState<string>()

  const [currentTokenInfo, setCurrentTokenInfo] = useState<TokenInfo>(new TokenInfo())

  const [capitalPoolAddress, setCapitalPoolAddress] = useState<string | undefined>(undefined)

  const [tokenTotals, setTokenTotals] = useState<string>('0')

  const [loadTokenInfoLoading, setLoadTokenInfoLoading] = useState(false)

  const [supplyState, setSupplyState] = useState<'Succeed' | 'Processing'>()

  useEffect(() => {
    // if (tokenInfos.length <= 1)
    //   return

    const uniqueTokenInfos = Array.from(new Set(tokenInfos.map(token => token.address))).map((address) => {
      const tokenInfo = tokenInfos.find(token => token.address === address)
      if (tokenInfo)
        return { ...tokenInfo }

      return null
    }).filter(Boolean) as TokenInfo[]

    const a = uniqueTokenInfos.map(e => e.dollars).reduce((pre, cur) => BigNumber(pre ?? 0).plus(cur ?? 0).toString(), '0')
    setTokenTotals(a ?? '0')

    setUniqueTokenInfos(uniqueTokenInfos)
  }, [tokenInfos])

  useEffect(() => {
    async function createKLineThis() {
      const res = await PortfolioService.ApiPortfolioUserTotalInfo_GET()

      createKLine(res.records ?? [])
    }

    createKLineThis()
  }, [])

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
    getBalanceByTokens()
  }, [browserContractService, transactionPair, tradeId])

  function getBalanceByTokens() {
    if (!browserContractService || !tradeId)
      return
    setLoadTokenInfoLoading(true)
    try {
      setTokenInfos([])

      const proList: Promise<TokenInfo>[] = []

      if (proList.length === 0 && tokenInfos.length === 0) {
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
      }).catch((err) => {
        throw new Error(err)
      })
    }
    catch (error) {
      console.log('%c [ error ]-65', 'font-size:13px; background:#abdc31; color:#efff75;', error)
    }
    finally {
      setLoadTokenInfoLoading(false)
    }
  }

  async function getBalanceByToken(token: string, tradeId: bigint, name?: string): Promise<TokenInfo | undefined> {
    const ERC20Contract = await browserContractService?.getERC20Contract(token)

    const cp = await browserContractService?.getCapitalPoolAddress(tradeId)

    if (!cp)
      return

    const balance = await ERC20Contract?.balanceOf(cp)

    // 查询代币的符号和小数位数
    const symbol = await ERC20Contract?.symbol()
    const decimals = await ERC20Contract?.decimals()

    const tokenName = name ?? symbol

    const address = tradingPairTokenMap[tokenName as keyof typeof tradingPairTokenMap]

    let ratio

    if (tokenName !== 'USDC')
      ratio = await browserContractService?.testLiquidity_calculateSwapRatio(address)

    const trulyBalance = ethers.formatUnits(balance ?? 0, decimals)

    const dollars = !ratio ? trulyBalance : String(Number(trulyBalance) / (Number(ratio)))

    return {
      name: tokenName,
      balance: trulyBalance,
      decimals: Number(decimals) ?? 0,
      address,
      ratio: ratio ? String(ratio) : '0',
      dollars,
      icon: tokenList.find(token => token.address === address)?.icon,
    }
  }

  async function resetSwapTokenInfo() {
    await getBalanceByTokens()

    setSetIsModalOpen(false)
  }

  function onOpenModal(item: TokenInfo) {
    setCurrentTokenInfo(item)
    setSetIsModalOpen(true)
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

  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <DefaultTabBar {...props} className='h2' />
  )

  return (
    <div className='w-full'>
      <SwapModal resetSwapTokenInfo={resetSwapTokenInfo} tradeId={tradeId} currentTokenInfo={currentTokenInfo} open={isSwapModalOpen} onCancel={() => setSetIsModalOpen(false)} />

      <SModal open={isDepositModalOpen} onCancel={() => setDepositIsModalOpen(false)} footer={
        <div>
          <Button onClick={() => setSetIsModalOpen(false)}>
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

      <div className="h560 w-full flex justify-between">
        <div className="s-container box-border h560 w634 flex justify-between p-x-30 p-y-16">
          <div>
            <div className='flex justify-between' >
              <div className='flex text-center c-#D1D1D1'>
                <span className='text-16'>address</span>

                <div className="w6" />

                <Address address={capitalPoolAddress ?? ''} />

              </div>

              <Button className='h25 w72 b-rd-30 p0 primary-btn' type='primary' onClick={onDeposit}>Top-up</Button>
            </div>

            <div>
              <div className='text-left text-16 c-#D1D1D1'>
                total
              </div>
              <span className="text-34">
                ${BigNumber(tokenTotals).toFixed(2)}
              </span>
            </div>

            <div id='KLineContainer' className='h340 w574'></div>

          </div>

        </div>

        {/* <div className="w48" /> */}
        {/* rootClassName='grid grid-cols-2 w715 gap-x-36' */}

        <Tabs
          centered
          rootClassName='w-715'
          tabPosition="bottom"
          renderTabBar={renderTabBar}
          items={Array.from({ length: Math.ceil(uniqueTokenInfos.length / 6) }, (_, index) =>
            uniqueTokenInfos.slice(index * 6, (index + 1) * 6),
          ).map((chunk, index) => ({
            label: `Tab ${index + 1}`,
            key: index + 1,
            children: (
              <div className='grid grid-cols-2 w715 gap-x-36 gap-y-20'>
                {chunk.map((item, itemIndex) => (
                  <div key={item.name} className="s-container h160 w321 bg-cover" style={{ backgroundImage: 'url(/static/cardBackGround.png)' }}>
                    <div className="flex items-center gap-x-6 px-20 pt-31 text-center">
                      <Image preview={false} width={18} height={18} src={tokenList.find(e => e.address === item.address)?.icon} />
                      <div className='flex text-21 c-#fff'>
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
                        }%)

                        <span className='ml-13 mt-7 h13 text-11 lh-13 c-green'>{BigNumber(item.balance).toFixed(4)} {item.name}</span>
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='ml-15 mt-11 h37 text-32 lh-38 c-#303241'>$</div>
                      <div className='ml-8 mt-11 h37 text-32 lh-38'>{item.dollars ? BigNumber(item.dollars).toFixed(2) : 0}</div>
                    </div>

                    <div className='mb-16 mr-16 flex justify-end'>

                      {/* //Test 用户创建的才能看 */}
                      {/* {
                      item.name !== 'USDC'
                      ? <Button className='float-right mr-22 mt-4 h30 w50 b-rd-30 p0 text-center primary-btn' onClick={() => onOpenModal(item)}>swap</Button>
                      : null
                    } */}
                      {/* // 下面这个才是要的 */}
                      {
                        item.name !== 'USDC' && prePage === 'loan' && loanInfo.state === 'Trading'
                          ? <Button className='h30 w60 primary-btn' onClick={() => onOpenModal(item)}>swap</Button>
                          : null
                      }
                    </div>
                  </div>
                ))}
              </div>
            ),
          }))
          }>
          {/* 其他 Tabs 相关的配置和渲染 */}
        </Tabs>

      </div>

      <div className="h58" />

      <RepaymentPlan lendState={lendState} refundPoolAddress={refundPoolAddress} tradeId={tradeId} repayCount={repayCount} />

      <LoanHistory tradeId={String(tradeId ?? '')} />

      <div className="40" />
    </div >
  )
}

export default Pool
