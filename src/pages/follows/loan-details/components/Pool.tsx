import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Divider, Image, Input, Tabs, message } from 'antd'
import { ethers } from 'ethers'
import { useChainId } from 'wagmi'

// import tradingPairTokenMap, { tokenList } from '../../../../contract/tradingPairTokenMap'
import { LoadingOutlined } from '@ant-design/icons'
import RepaymentPlan from './RepaymentPlan'
import Address from './Address'
import LoanHistory from './LoanHistory'
import BalanceChart from './BalanceChart'
import Swap from './Swap'
import DepositModal from './Modals/Deposit'
import useBrowserContract from '@/hooks/useBrowserContract'
import SModal from '@/pages/components/SModal'
import type { Models } from '@/.generated/api/models'
import toCurrencyString from '@/utils/convertToCurrencyString'
import { ChainAddressEnums, TokenEnums } from '@/enums/chain'
import useCoreContract from '@/hooks/useCoreContract'
import { executeTask } from '@/helpers/helpers'
import usePoolAddress from '@/helpers/usePoolAddress'

// import { PortfolioService } from '@/.generated/api'

interface IProps {
  tradeId: bigint
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

  const [isSwapModalOpen, setSetIsModalOpen] = useState(false)

  const [isDepositModalOpen, setDepositIsModalOpen] = useState(false)

  const [depositValue, setDepositValue] = useState<string>()

  const [currentTokenInfo, setCurrentTokenInfo] = useState<TokenInfo>(new TokenInfo())

  const [topUpTitle, setTopUpTitle] = useState('Deposit')

  const chainId = useChainId()

  const [depositModalOpen, setDepositModalOpen] = useState(false)

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

  const { capitalPoolAddress } = usePoolAddress()
  const [tokenStates, setTokenStates] = useState<Models.ITokenState[]>([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [currentTokenState, setCurrentTokenState] = useState<Models.ITokenState>()

  const [swapModalOpen, setSwapModalOpen] = useState(false)

  function onOpenModal(tokenState: Models.ITokenState) {
    console.log('???????:', tokenState)
    const item = new TokenInfo()
    item.name = tokenState.symbol
    item.address = tokenState.address
    item.balance = tokenState.balance
    item.decimals = tokenState.decimals
    item.dollars = tokenState.usd
    item.icon = tokenState.logo
    item.ratio = tokenState.ratio
    setCurrentTokenInfo(item)
    setCurrentTokenState(tokenState)
    setSetIsModalOpen(true)
  }

  const getTokenState = async () => {
    const task = async () => {
      if (coreContracts && tradeId) {
        const tokenStates = Array<Models.ITokenState>(transactionPair.length + 1)

        const capitalPoolAddressOfTradeId = await coreContracts.manageContract.getTradeIdToCapitalPool(tradeId)

        const usdcDecimals = await coreContracts.usdcContract.decimals()
        // const usdcName = await coreContracts.usdcContract.name()
        const usdcBalance = await coreContracts.usdcContract.balanceOf(capitalPoolAddressOfTradeId)

        // get USDC state
        const usdcState: Models.ITokenState = {
          index: 0,
          name: TokenEnums[chainId].USDC.name,
          symbol: TokenEnums[chainId].USDC.symbol,
          balance: ethers.formatUnits(usdcBalance ?? 0, usdcDecimals),
          decimals: Number(usdcDecimals),
          address: ChainAddressEnums[chainId].USDC,
          ratio: '0',
          usd: ethers.formatUnits(usdcBalance ?? 0, usdcDecimals),
          logo: TokenEnums[chainId].USDC.logo,
        }
        setTokenStates((prev) => {
          const tokenStates = [...prev]
          tokenStates[0] = usdcState
          return tokenStates
        })

        // get all others token state, v is token symbol
        transactionPair.forEach((v) => {
          const task = async () => {
            const tokenContract = await coreContracts.getERC20Contract(ChainAddressEnums[chainId][v])
            // const name = await tokenContract.name()
            const decimals = await tokenContract.decimals()
            const balance = await tokenContract.balanceOf(capitalPoolAddressOfTradeId)
            const liquidityContract = await coreContracts.getTestLiquidityContract()
            const price = await liquidityContract.getTokenPrice(
              ChainAddressEnums[chainId].USDC,
              ChainAddressEnums[chainId][v],
              3000,
              ethers.parseEther(String(1)),
            )
            const ratio = BigNumber(ethers.formatUnits(price ?? 0)).toFixed(18)
            const tokenState: Models.ITokenState = {
              index: TokenEnums[chainId][v].index,
              name: TokenEnums[chainId][v].name,
              symbol: TokenEnums[chainId][v].symbol,
              balance: ethers.formatUnits(balance ?? 0, decimals),
              decimals: Number(decimals),
              address: ChainAddressEnums[chainId][v],
              ratio: ratio.toString(),
              usd: String(Number(ethers.formatUnits(balance ?? 0, decimals)) / (Number(ratio))),
              logo: TokenEnums[chainId][v].logo,
            }
            setTokenStates((prev) => {
              const tokenStates = [...prev]
              tokenStates[tokenState.index] = tokenState
              return tokenStates
            })
          }
          task()
        })
      }
    }
    executeTask(task)
  }

  async function refreshTokenState() {
    await getTokenState()

    setSetIsModalOpen(false)
  }

  function openSwapModal(tokenStates: Models.ITokenState[]) {
    const item = new TokenInfo()
    item.name = tokenStates[1].symbol
    item.address = tokenStates[1].address
    item.balance = tokenStates[1].balance
    item.decimals = tokenStates[1].decimals
    item.dollars = tokenStates[1].usd
    item.icon = tokenStates[1].logo
    item.ratio = tokenStates[1].ratio
    setCurrentTokenInfo(item)
    setSwapModalOpen(true)
  }

  useEffect(() => {
    if (coreContracts)
      // TODO 增加刷新时候的等待显示
      getTokenState()
  }, [coreContracts])

  useEffect(() => {
    if (tokenStates.length > 0) {
      let total = 0
      tokenStates.forEach((state) => {
        total += Number(state ? state.usd : 0)
      })
      setTotalBalance(total)
    }
  }, [tokenStates])

  useEffect(() => {
    // if (tokenStates.length > 0) {
    //   console.log(Array.from(
    //     { length: Math.ceil(tokenStates.length / 3) },
    //     (_, index) => tokenStates.slice(index * 3, (index + 1) * 3),
    //   ))
    // }
  }, [tokenStates])

  return (
    <div className='w-full'>
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
      <DepositModal
        open={depositModalOpen}
        setOpen={setDepositModalOpen}
        tradeId={tradeId}
      ></DepositModal>

      <div className="w-full">
        <div className='flex items-center justify-between'>
          <div className='w-full md:flex'>
            <div className='balance-chart'>
              <div className='h-380'>
                <BalanceChart />
              </div>
              <div className='grid grid-cols-2 h-100 grow place-content-between max-md:my-30 md:ml-20 md:mt-35'>
                <div className='flex'>
                  <div className='mr-4 text-18 font-semibold md:mr-10 md:text-20'>Pool:</div>
                  <div className="text-16"><Address address={capitalPoolAddress} /></div>
                </div>
                <div className='flex justify-end'>
                  {/* <Button className='h30 b-rd-30 primary-btn md:w120' type='primary' onClick={onDeposit}>Deposit</Button> */}

                  <Button className='h30 b-rd-30 primary-btn md:w120' type='primary' onClick={() => setDepositModalOpen(true)}>Deposit</Button>

                </div>
                <div className='text-24 font-semibold md:text-32'>Total:
                </div>
                <div className="flex items-center justify-end text-right text-24 font-semibold md:text-32">{
                  totalBalance === 0 && tokenStates.length === 0
                    ? <LoadingOutlined width={10} />
                    : `$ ${Number(Number(totalBalance).toFixed(2)).toLocaleString()}`
                }
                </div>
              </div>
            </div>
            <div className='balance-chart md:ml-30'>
              <Swap
                resetSwapTokenInfo={refreshTokenState}
                tradeId={tradeId}
                tokenStates={tokenStates}
                ownerState={prePage === 'loan' && loanInfo.state === 'Trading'}
              >
              </Swap>
            </div>

          </div>
        </div>
        <div className=''>
          <Tabs
            centered
            size="large"
            rootClassName=''
            tabPosition="top"
            items={
              Array.from(
                { length: Math.ceil(tokenStates.length / 10) },
                (_, index) => tokenStates.slice(index * 1, (index + 1) * 10),
              ).map((chunk, index) => ({
                label: `${index + 1}`.toString(),
                key: (index + 1).toString(),
                children: (
                  <div className='token-info-box'>
                    {chunk.map((item, _index) => {
                      if (item) {
                        return (
                          <div key={item.symbol} className="token-info-item">
                            <div className="flex grow items-center justify-between px-10 text-center xl:px-1">
                              <div className='flex items-center'>
                                <Image preview={false} width={24} height={24} src={item.logo} />
                                <div className='ml-10 flex items-center text-20 c-#fff md:text-16'>
                                  {item.symbol} ({
                                    Number(item.balance) !== 0
                                      ? BigNumber(item.usd ?? 0)
                                        .div((totalBalance))
                                        .times(100)
                                        .toFixed(2)
                                      : <span>
                                        0
                                      </span>
                                  }%)
                                </div>
                              </div>
                              <div className='flex items-center text-right text-20 c-#fff'>
                                <span className='ml-10 mt-5 text-11 c-green lg:ml-5'>{BigNumber(item.balance).toFixed(4)} {item.symbol}</span>
                              </div>
                            </div>
                            <div className='mt-20 flex grow items-center justify-end px-10 xl:px-1'>
                              <div className='slahed-zero h30 text-24 font-mono xl:text-22'>
                                ${toCurrencyString((item.usd ? Number(BigNumber(item.usd)) : 0))}
                              </div>
                              {/* {
                                item.symbol !== 'USDC' && prePage === 'loan' && loanInfo.state === 'Trading'
                                  ? <Button id={item.symbol} className='ml-10 h30 w60 primary-btn' onClick={() => onOpenModal(item)}>swap</Button>
                                  : null
                              } */}
                            </div>
                          </div>
                        )
                      }
                      else {
                        return (<div></div>)
                      }
                    })}
                  </div>
                ),
              }))
            }>
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
