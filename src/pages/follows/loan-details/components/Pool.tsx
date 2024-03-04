import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Divider, Image, Input, Tabs, message } from 'antd'
import { ethers } from 'ethers'
import { useChainId } from 'wagmi'

// import tradingPairTokenMap, { tokenList } from '../../../../contract/tradingPairTokenMap'
import RepaymentPlan from './RepaymentPlan'
import SwapModal from './SwapModal'
import Address from './Address'
import LoanHistory from './LoanHistory'
import BalanceChart from './BalanceChart'
import useBrowserContract from '@/hooks/useBrowserContract'
import SModal from '@/pages/components/SModal'
import type { Models } from '@/.generated/api/models'
import toCurrencyString from '@/utils/convertToCurrencyString'
import { ChainAddressEnums, TokenLogo } from '@/enums/chain'
import useCoreContract from '@/hooks/useCoreContract'
import USDCLogo from '@/assets/images/loan-details/usdc.png'
import { executeTask } from '@/helpers/helpers'

// import { PortfolioService } from '@/.generated/api'

interface IProps {
  tradeId: bigint | null
  transactionPair: string[]
  repayCount: number
  refundPoolAddress: string | undefined
  lendState: 'Processing' | 'Success' | undefined
  prePage: string | null
  loanInfo: Models.ILoanOrderVO
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

  const { coreContracts } = useCoreContract()

  const [tokenInfos, setTokenInfos] = useState<TokenInfo[]>([])

  const [uniqueTokenInfos, setUniqueTokenInfos] = useState<TokenInfo[]>([])

  const [isSwapModalOpen, setSetIsModalOpen] = useState(false)

  const [isDepositModalOpen, setDepositIsModalOpen] = useState(false)

  const [depositValue, setDepositValue] = useState<string>()

  const [currentTokenInfo, setCurrentTokenInfo] = useState<TokenInfo>(new TokenInfo())

  const [capitalPoolAddress, setCapitalPoolAddress] = useState<string | undefined>(undefined)

  const [tokenTotals, setTokenTotals] = useState<string>('0')

  const [loadTokenInfoLoading, setLoadTokenInfoLoading] = useState(false)

  const [kLineCreated, setKLineCreated] = useState(false)

  const [topUpTitle, setTopUpTitle] = useState('Deposit')
  const chainId = useChainId()

  useEffect(() => {
    // if (tokenInfos.length <= 1)
    //   return

    const uniqueTokenInfos = Array.from(new Set(tokenInfos.map(token => token.address))).map((address) => {
      const tokenInfo = tokenInfos.find(token => token.address === address)
      if (tokenInfo)
        return { ...tokenInfo }

      return null
    }).filter(Boolean) as TokenInfo[]
    // console.log('tokenInfos & uniqueTokenInfos', tokenInfos, uniqueTokenInfos)

    const a = uniqueTokenInfos.map(e => e.dollars).reduce((pre, cur) => BigNumber(pre ?? 0).plus(cur ?? 0).toString(), '0')
    setTokenTotals(a ?? '0')

    setUniqueTokenInfos(uniqueTokenInfos)
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
    getBalanceByTokens()
  }, [browserContractService, transactionPair, tradeId])

  async function getBalanceByTokens() {
    if (!coreContracts || !tradeId)
      return
    setLoadTokenInfoLoading(true)
    try {
      setTokenInfos([])

      const proList: Promise<TokenInfo>[] = []
      // if (proList.length === 0 && tokenInfos.length === 0) {
      const pro = getBalanceByToken(ChainAddressEnums[chainId].USDC, tradeId, 'USDC')
      // const pro = getBalanceByToken(tradingPairTokenMap['USDC'], tradeId, 'USDC')
      pro && proList.push(pro as Promise<TokenInfo>)
      // }
      // for (let i = 0; i < transactionPair.length; i++) {
      //   const coin = transactionPair[i] as keyof typeof tradingPairTokenMap
      //   if (coin in tradingPairTokenMap) {
      //     // console.log(tradingPairTokenMap[coin], tradeId, coin)
      //     const pro = getBalanceByToken(tradingPairTokenMap[coin], tradeId, coin)
      //     pro && proList.push(pro as Promise<TokenInfo>)
      //   }
      // }

      for (let i = 0; i < transactionPair.length; i++) {
        // const coin = transactionPair[i] as keyof typeof tradingPairTokenMap
        const coin = transactionPair[i]
        // if (coin in tradingPairTokenMap) {
        coreContracts.specifiedTradingPairsOfSpot.forEach((pairs) => {
          if (coin === pairs.name) {
            // console.log(tradingPairTokenMap[coin], tradeId, coin)
            const pro = getBalanceByToken(ChainAddressEnums[chainId][coin], tradeId, coin)
            // console.log(coin, ChainAddressEnums[chainId][coin.toLowerCase()], pro)
            pro && proList.push(pro as Promise<TokenInfo>)
          }
        })
      }
      // console.log(proList)

      Promise.all(proList).then((res) => {
        // console.log('res', res)
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
    // const ERC20Contract = await browserContractService?.getERC20Contract(token)
    const ERC20Contract = await coreContracts?.getERC20Contract(token)

    // const cp = await browserContractService?.getCapitalPoolAddress(tradeId)
    const cp = await coreContracts?.manageContract.getTradeIdToCapitalPool(tradeId)
    if (!cp)
      return

    const balance = await ERC20Contract?.balanceOf(cp)
    // 查询代币的符号和小数位数
    const symbol = await ERC20Contract?.symbol()
    const decimals = await ERC20Contract?.decimals()

    const tokenName = name ?? symbol

    // const address = tradingPairTokenMap[tokenName as keyof typeof tradingPairTokenMap]
    const address = ChainAddressEnums[chainId][tokenName!]

    let ratio

    if (tokenName !== 'USDC')
      ratio = await browserContractService?.testLiquidity_calculateSwapRatio(token)
    // ratio = await browserContractService?.testLiquidity_calculateSwapRatio(address)

    const trulyBalance = ethers.formatUnits(balance ?? 0, decimals)

    const dollars = !ratio ? trulyBalance : String(Number(trulyBalance) / (Number(ratio)))

    return {
      name: tokenName,
      balance: trulyBalance,
      decimals: Number(decimals) ?? 0,
      address,
      ratio: ratio ? String(ratio) : '0',
      dollars,
      // icon: tokenList.find(token => token.address === address)?.icon,
      icon: tokenName === 'USDC'
        ? USDCLogo
        : coreContracts!.specifiedTradingPairsOfSpot.find(pair => pair.address === address)?.logo,
    }
  }

  async function resetSwapTokenInfo() {
    await getBalanceByTokens()

    setSetIsModalOpen(false)
  }

  function onOpenModal(item: TokenInfo) {
    console.log(222, item)
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

    setTopUpTitle('Processing')
    // setSupplyState('Processing')
    try {
      await browserContractService?.processCenter_supply(ethers.parseEther(depositValue), tradeId)
      setTopUpTitle('Succeed')
    }
    catch (error) {
      message.error('Transaction Failed')
      console.log('%c [ error ]-97', 'font-size:13px; background:#f8b42a; color:#fff86e;', error)
    }
    finally {
      setDepositIsModalOpen(false)
      setTopUpTitle('Deposit')
      // setSupplyState(undefined)
    }
  }

  // const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
  //   <DefaultTabBar {...props} className='h1 text-white' />
  // )

  interface ITokenState {
    address: string
    name: string
    decimals: number
    balance: string
    ratio: string
    usd: string
    icon: string
  }

  const [tokenStates, setTokenStates] = useState<ITokenState[]>([])

  const getTokenState = async () => {
    const task = async () => {
      if (coreContracts && tradeId) {
        const tokenStates: ITokenState[] = []

        const capitalPoolAddressOfTradeId = await coreContracts.manageContract.getTradeIdToCapitalPool(tradeId)

        const usdcDecimals = await coreContracts.usdcContract.decimals()
        const usdcBalance = await coreContracts.usdcContract.balanceOf(capitalPoolAddressOfTradeId)

        // get USDC state
        const usdtState = {
          name: 'USDC',
          balance: ethers.formatUnits(usdcBalance ?? 0, usdcDecimals),
          decimals: Number(usdcDecimals),
          address: ChainAddressEnums[chainId].USDC,
          ratio: '0',
          usd: ethers.formatUnits(usdcBalance ?? 0, usdcDecimals),
          icon: TokenLogo.USDC,
        }
        tokenStates.push(usdtState)

        // get all others token state

        for (let i = 0; i < transactionPair.length; i++) {
          const name = transactionPair[i]
          const tokenContract = await coreContracts.getERC20Contract(ChainAddressEnums[chainId][name])
          const decimals = await tokenContract.decimals()
          const balance = await tokenContract.balanceOf(capitalPoolAddressOfTradeId)

          const liquidityContract = await coreContracts.getTestLiquidityContract()
          const ratio = await liquidityContract.getTokenPrice(
            ChainAddressEnums[chainId].USDC,
            ChainAddressEnums[chainId][name],
            3000,
            ethers.parseEther(String(1)),
          )
          const tokenState = {
            name,
            balance: ethers.formatUnits(balance ?? 0, decimals),
            decimals: Number(decimals),
            address: ChainAddressEnums[chainId][name],
            ratio: ratio.toString(),
            usd: String(Number(ethers.formatUnits(balance ?? 0, decimals)) / (Number(ratio))),
            icon: TokenLogo[name],
          }
          tokenStates.push(tokenState)
        }

        setTokenStates(tokenStates)
      }
    }
    executeTask(task)
  }

  useEffect(() => {
    if (coreContracts)
      getTokenState()
  }, [coreContracts])

  return (
    <div className='w-full'>
      <SwapModal
        resetSwapTokenInfo={resetSwapTokenInfo}
        tradeId={tradeId}
        currentTokenInfo={currentTokenInfo}
        open={isSwapModalOpen}
        onCancel={() => setSetIsModalOpen(false)} >

      </SwapModal>
      <SModal
        open={isDepositModalOpen}
        content={
          (<div>
            <h2>
              {topUpTitle}
            </h2>
            {/* <Button type='primary' onClick={onDepositModalConfirm} >
            Confirm
          </Button>
          <Button onClick={() => setSetIsModalOpen(false)}>
            Cancel
          </Button> */}
            <div>
              <Input onChange={onDepositValueChange} disabled={!((topUpTitle !== 'Processing' && topUpTitle !== 'Succeed'))} />
            </div>
          </div>
          )
        }
        onCancel={() => setDepositIsModalOpen(false)}
        okText="Confirm"
        onOk={onDepositModalConfirm}
        okButtonProps={{ type: 'primary', className: 'primary-btn', disabled: !((topUpTitle !== 'Processing' && topUpTitle !== 'Succeed')) }}
      >

        {/* {
          supplyState === undefined && <div>
            <Input onChange={onDepositValueChange} />
          </div>
        } */}
        {/* {
          supplyState === 'Processing' && (
            <div >
              <h2>
                Processing
              </h2>
              <Spin />
            </div>
          )
        } */}
        {/* {
          supplyState === 'Succeed' && <div>
            Succeed
          </div>
        } */}

      </SModal>
      <div className="w-full">
        <div className='flex items-center justify-between'>
          <div className='w-full md:flex'>
            <div className='balance-chart'>
              <BalanceChart />
            </div>
            <div className='grid grid-cols-2 h-90 grow place-content-between max-md:my-30 md:ml-20 md:mt-35 md:h-350'>
              <div className='flex'>
                <div className='mr-4 text-18 font-semibold md:mr-10 md:text-20'>Address:</div>
                <div className="text-16"><Address address={capitalPoolAddress ?? ''} /></div>
              </div>
              <div className='flex justify-end'>
                <Button className='h30 b-rd-30 md:w120 primary-btn' type='primary' onClick={onDeposit}>Deposit</Button>
              </div>
              <div className='text-24 font-semibold md:text-32'>Total:
              </div>
              <div className="text-right text-24 font-semibold md:text-32">$ {Number(Number(tokenTotals).toFixed(2)).toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className=''>
          <Tabs
            centered
            size="large"
            rootClassName=''
            tabPosition="top"
            // renderTabBar={renderTabBar}
            items={
              Array.from({ length: Math.ceil(uniqueTokenInfos.length / 10) }, (_, index) =>
                uniqueTokenInfos.slice(index * 10, (index + 1) * 10),
              ).map((chunk, index) => ({
                label: `${index + 1}`.toString(),
                key: (index + 1).toString(),
                children: (
                  <div className='token-info-box'>
                    {chunk.map((item, _index) => (
                      // <div key={item.name} className="s-container h160 w321 bg-cover" style={{ backgroundImage: 'url(/static/cardBackGround.png)' }}>
                      <div key={item.name}
                        className="token-info-item"
                      // style={{ backgroundImage: 'url(/static/cardBackGround.png)' }}
                      >
                        <div className="flex grow items-center justify-between px-10 text-center xl:px-1">
                          <div className='flex items-center'>
                            <Image preview={false} width={24} height={24} src={item.icon} />
                            {/* <Image preview={false} width={24} height={24} src={tokenList.find(e => e.address === item.address)?.icon} /> */}
                            <div className='ml-10 flex items-center text-20 c-#fff md:text-16'>
                              {item.name} ({
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
                            </div>
                          </div>
                          <div className='flex items-center text-right text-20 c-#fff'>
                            <span className='ml-10 mt-5 text-11 c-green lg:ml-5'>{BigNumber(item.balance).toFixed(4)} {item.name}</span>
                          </div>
                        </div>
                        <div className='mt-20 flex grow items-center justify-end px-10 xl:px-1'>
                          <div className='slahed-zero h30 text-24 xl:text-22 font-mono'>
                            ${toCurrencyString((item.dollars ? Number(BigNumber(item.dollars)) : 0))}
                          </div>
                          {/* <Button id={item.name} className='ml-10 h30 w60 primary-btn' onClick={() => onOpenModal(item)}>swap</Button> */}
                          {
                            item.name !== 'USDC' && prePage === 'loan' && loanInfo.state === 'Trading'
                              ? <Button id={item.name} className='ml-10 h30 w60 primary-btn' onClick={() => onOpenModal(item)}>swap</Button>
                              : null
                          }
                        </div>

                        {/* <div className='mb-16 mr-16 flex justify-end'> */}
                        {/* //Test 用户创建的才能看 */}
                        {/* {
                      item.name !== 'USDC'
                      ? <Button className='float-right mr-22 mt-4 h30 w50 b-rd-30 p0 text-center primary-btn' onClick={() => onOpenModal(item)}>swap</Button>
                      : null
                    } */}
                        {/* // 下面这个才是要的 */}
                        {/* </div> */}
                      </div>
                    ))}
                  </div>
                ),
              }))
            }>
            {/* 其他 Tabs 相关的配置和渲染 */}
          </Tabs>
        </div>
      </div>
      <div className="h50" />
      {/* <Divider></Divider> */}
      {/* <div className="h800" /> */}
      <RepaymentPlan lendState={lendState} refundPoolAddress={refundPoolAddress} tradeId={tradeId} repayCount={repayCount} />

      <div className="h50" />
      <Divider></Divider>
      <LoanHistory tradeId={String(tradeId ?? '')} />
      <div className="40" />
    </div >
  )
}

export default Pool
