import { ZeroAddress, ethers, parseUnits } from 'ethers'
import { useEffect, useState } from 'react'
import { message, notification } from 'antd'
import useUserStore from '@/store/userStore'
import { CoreContracts } from '@/contract/coreContracts'
import { MessageError, NotificationError } from '@/enums/error'
import { InfoMessage } from '@/enums/info'
import { LoanRequisitionEditModel } from '@/models/LoanRequisitionEditModel'
import { tokenList } from '@/contract/tradingPairTokenMap'

const useCoreContract = () => {
  const [coreContracts, setCoreContracts] = useState<CoreContracts>()
  const { activeUser } = useUserStore()

  const initializeContracts = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const coreContracts = CoreContracts.getCoreContractsInstance(signer)
    setCoreContracts(() => coreContracts)
  }

  type Task<T> = (coreContracts: CoreContracts) => Promise<T>

  const executeTask = async<T>(task: Task<T>) => {
    if (coreContracts) {
      try {
        return task(coreContracts)
      }
      catch (error) {
        if (error instanceof TypeError) {
          if (error.toString() !== MessageError.GenenalError) {
            message.error(error.toString())
            return Promise.reject(error.toString())
          }
          else {
            message.error(MessageError.GenenalError)
            return Promise.reject(MessageError.GenenalError)
          }
        }
        else {
          message.error(MessageError.GenenalError)
          return Promise.reject(MessageError.GenenalError)
        }
      }
    }
    else {
      message.error(MessageError.ProviderOrSignerIsNotInitialized)
      return Promise.reject(new Error(MessageError.ProviderOrSignerIsNotInitialized))
    }
  }

  const handleTransactionResponse = async (transactionResponse: ethers.ContractTransactionResponse) => {
    try {
      const receipt = await transactionResponse.wait()

      if (!receipt)
        throw new Error(`HandleTransactionResponse: ${NotificationError.TransactionFailed}`)

      if (receipt.status === 1) {
        // Transaction successful
        notification.success({
          message: InfoMessage.TransactionSuccessful,
        })
      }
      else {
        // Transaction failed
        notification.error({
          message: NotificationError.TransactionFailed,
        })
        throw new Error(`HandleTransactionResponse: ${NotificationError.TransactionFailed}`)
      }
      return Promise.resolve(receipt)
    }
    catch (error) {
      notification.error({
        message: NotificationError.TransactionError,
      })
      throw error
    }
  }

  /**
   * get Share Profit by user
   * @param tradeId
   */
  const getShareProfitByUser = async (tradeId: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const sharesContract = coreContracts.sharesContract
      const tokenId = await sharesContract.getPersonalSlotToTokenId(coreContracts.signer.address, tradeId)
      if (!tokenId)
        throw new Error(MessageError.TokenIdIsNotFound)
      return coreContracts.processCenterContract.getShareProfit(tokenId)
    }
    return executeTask(task)
  }

  /**
   * if true, the user can create new order
   */
  const canCreateNewOrder = async () => {
    const task = async (coreContracts: CoreContracts) => {
      const capitalFactoryContract = coreContracts.capitalFactoryContract
      const state = await capitalFactoryContract.getIfCreate(coreContracts.signer.address)
      // if state === 1 , the capital pool is created, if state!==1 the captial pool is not created yet, the user can create it
      if (state !== BigInt(1))
        return true
      const processCenterContract = coreContracts.processCenterContract
      return processCenterContract.getIfAgainCreateOrder(coreContracts.signer.address)
    }
    return executeTask(task)
  }

  /**
   * Order State
   */
  const getOrderState = async () => {
    const task = async (coreContracts: CoreContracts) => {
      if (coreContracts.capitalPoolAddress === ZeroAddress)
        await coreContracts.getUserCapitalPoolAddress()
      const capitalPoolAddress = coreContracts.capitalPoolAddress
      const processCenterContract = coreContracts.processCenterContract
      return processCenterContract.getOrderCreateState(capitalPoolAddress)
    }
    return executeTask(task)
  }

  const getAllowanceOfShares = async (tradeId: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const marketContractAddress = await coreContracts.marketContract.getAddress()
      const tokenId = await coreContracts.sharesContract.getPersonalSlotToTokenId(coreContracts.signer.address, tradeId)
      if (tokenId === BigInt(0))
        throw new Error(MessageError.TokenIdIsNotFound)
      return coreContracts.sharesContract.allowance(tokenId, marketContractAddress)
    }
    return executeTask(task)
  }

  /**
   * approve shares for marketContract
   * @param tradeId
   * @param amount
   */
  const approveShares = async (tradeId: bigint, amount: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const marketContractAddress = await coreContracts.marketContract.getAddress()
      const tokenId = await coreContracts.sharesContract.getPersonalSlotToTokenId(coreContracts.signer.address, tradeId)
      if (tokenId === BigInt(0))
        throw new Error(MessageError.TokenIdIsNotFound)
      const allowance = await getAllowanceOfShares(tokenId)
      if (allowance < amount) {
        const res = await coreContracts.sharesContract.approveValue(tokenId, marketContractAddress, amount)
        await handleTransactionResponse(res)
      }
      return Promise.resolve(true)
    }
    return executeTask(task)
  }

  /**
   * list shares to market
   *
   * @param {bigint} tradeId
   * @param {bigint} price price to list
   * @param {bigint} amount
   */
  const listShares = async (tradeId: bigint, price: bigint, amount: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const tokenId = await coreContracts.sharesContract.getPersonalSlotToTokenId(coreContracts.signer.address, tradeId)
      if (tokenId === BigInt(0))
        throw new Error(MessageError.TokenIdIsNotFound)
      const allowance = await getAllowanceOfShares(tokenId)
      if (allowance < amount)
        return Promise.reject(MessageError.AllowanceIsNotEnough)
      const decimals = await coreContracts.usdcContract.decimals()
      const res = await coreContracts.marketContract.saleERC3525(tokenId, parseUnits(price.toString(), decimals), amount)
      return handleTransactionResponse(res)
    }
    return executeTask(task)
  }

  /**
   * un-list shares from market
   *
   * @param {bigint} marketId
   */
  const unlistShares = async (marketId: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const res = await coreContracts.marketContract.cancelOrder(marketId)
      return handleTransactionResponse(res)
    }
    return executeTask(task)
  }

  /**
   * buy shares from market
   *
   * @param {bigint} marketId
   * @param {bigint} amount usdc amount to spend
   */
  const buyShares = async (marketId: bigint, amount: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const marketContractAddress = await coreContracts.marketContract.getAddress()
      const allowance = await coreContracts.usdcContract.allowance(coreContracts.signer.address, marketContractAddress)
      if (allowance < amount)
        return Promise.reject(MessageError.AllowanceIsNotEnough)
      const res = await coreContracts.marketContract.buyERC3525(marketId)
      return handleTransactionResponse(res)
    }
    return executeTask(task)
  }

  /**
   * check if pools have been created
   */
  const checkPoolsState = async () => {
    const task = async (coreContracts: CoreContracts) => {
      const capitalPoolState = await coreContracts.routerContract.getCreateCapitalState(coreContracts.signer.address)
      if (!capitalPoolState)
        return [capitalPoolState, false]
      const refundPoolState = await coreContracts.routerContract.getCreateRefundState(coreContracts.signer.address)
      return [capitalPoolState, refundPoolState]
    }
    return executeTask(task)
  }

  /**
   * create capital pool and refund pool
   *
   */
  const createPools = async () => {
    const task = async (coreContracts: CoreContracts) => {
      const state = await checkPoolsState()
      if (!state[0]) {
        const res = await coreContracts.routerContract.createPool(coreContracts.signer.address)
        return handleTransactionResponse(res)
      }
      else {
        throw new Error(MessageError.PoolsExist)
      }
    }
    return executeTask(task)
  }

  /**
   *创建订单
   *
   * @param {LoanRequisitionEditModel} model
   */
  const createOrder = async (model: LoanRequisitionEditModel) => {
    const task = async (coreContracts: CoreContracts) => {
      const decimals = await coreContracts.usdcContract.decimals()
      const res = await coreContracts.routerContract.borrowerCreateOrder(
        {
          _timePeriod: BigInt(model.cycle),
          _repayTimes: BigInt(model.period),
          _interestRate: BigInt(model.interest * 100),
          _shareRate: BigInt((model.dividend ?? 0) * 100),
          _goalShareCount: BigInt(model.numberOfCopies),
          _minShareCount: BigInt(model.minimumRequiredCopies ?? 0),
          _collectEndTime: BigInt(model.raisingTime!) * BigInt(86400), // seconds
          _goalMoney: BigInt(model.applyLoan!) * (BigInt(10) ** decimals), // decimals token for usdc
          uri: model.imageUrl!,
          name: model.itemTitle!,
        },
      )
      return handleTransactionResponse(res)
    }
    return executeTask(task)

    if (result?.status === 1) {
      const getTrulyTradeId = async (): Promise<bigint> => {
        let trulyTradeId = null

        const transaction = await result?.getTransaction()

        const transactionReceipt = await result?.provider.getTransactionReceipt(transaction?.hash ?? '')

        transactionReceipt?.logs.forEach((log) => {
          const parseLog = followRouterContract.interface.parseLog({ topics: log?.topics.concat([]) ?? [], data: log?.data ?? '' })

          if (parseLog)
            trulyTradeId = parseLog.args[0]
        })

        if (!trulyTradeId) {
          const followManageContract = await this.getFollowManageContract()
          trulyTradeId = await followManageContract.getLastTradeId()

          return (trulyTradeId === BigInt(0) ? trulyTradeId : trulyTradeId - BigInt(1))
        }
        return trulyTradeId
      }

      const trulyTradeId = await getTrulyTradeId()

      const loanConfirm = {
        ...new Models.LoanConfirmParam(),
        loanPicUrl: model.imageUrl,
        loanName: model.itemTitle ?? '',
        loanIntro: model.description ?? '',
        transactionPairs: model.transactionPairs,
        tradingFormType: model.tradingFormType,
        tradingPlatformType: model.tradingPlatformType,
        tradeId: Number(trulyTradeId),
      }

      return LoanService.ApiLoanConfirm_POST(loanConfirm)
    }
  }

  /**
   * get user's latest order Id
   */
  const getLatestTradeId = async () => {
    const task = async (coreContracts: CoreContracts) => {
      // TODO get user's latest order Id
      return 0
    }
    return executeTask(task)
  }

  /**
   * get usdc Amount for copies
   * @param tradeId
   * @param shares share count or copies
   */
  const getAmountForShares = async (tradeId: bigint, shares: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      return coreContracts.processCenterContract.getLendStakeMoney(tradeId, shares)
    }
    return executeTask(task)
  }

  /**
   * lend money for shares
   * @param tradeId
   * @param shares share count or copies
   */
  const followOrder = async (tradeId: bigint, shares: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const res = await coreContracts.routerContract.lendMoney(tradeId, shares)
      return handleTransactionResponse(res)
    }
    return executeTask(task)
  }

  /**
   * when trade is uncollected, withdraw asset
   * @param tradeId
   */
  const withdrawAsset = async (tradeId: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const res = await coreContracts.routerContract.refundMoney(tradeId)
      return handleTransactionResponse(res)
    }
    return executeTask(task)
  }

  /**
   * liquidate single/installment order
   * @param tradeId
   * @param installment
   */
  const liquidateOrder = async (tradeId: bigint, installment: boolean) => {
    const task = async (coreContracts: CoreContracts) => {
      if (coreContracts.capitalPoolAddress === ZeroAddress) {
        await coreContracts.getUserCapitalPoolAddress()
        await coreContracts.getUserRefundPoolAddress()
      }
      if (installment) {
        const res = await coreContracts.capitalPoolContract!.multiLiquidate(tradeId, 3000)
        return handleTransactionResponse(res)
      }
      else {
        const res = await coreContracts.capitalPoolContract!.singleLiquidate(tradeId, 3000)
        return handleTransactionResponse(res)
      }
    }
    return executeTask(task)
  }

  /**
   * repay the order
   * @param tradeId
   * @param amount
   */
  const repay = async (tradeId: bigint, amount: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      if (coreContracts.capitalPoolAddress === ZeroAddress)
        await coreContracts.getUserCapitalPoolAddress()
      const allowance = await coreContracts.usdcContract.allowance(coreContracts.signer.address, coreContracts.capitalPoolAddress)
      if (allowance < amount)
        return Promise.reject(MessageError.AllowanceIsNotEnough)
      const res = await coreContracts.routerContract.doRepay(tradeId)
      return handleTransactionResponse(res)
    }
    return executeTask(task)
  }

  /**
   * get Handle Index
   * TODO need update
   */
  const getHandleIndex = async () => {
    const task = async (coreContracts: CoreContracts) => {
      const handles = await coreContracts.manageContract.getAllAllowHandle()
      const handleAddress = await coreContracts.handleContract.getAddress()
      return Promise.resolve(handles.findIndex(handle => handle === handleAddress))
    }
    return executeTask(task)
  }

  /**
   * swap of UniV3
   * @param tradeId
   * @param token
   * @param buyOrSell
   * @param amount
   * @param fee
   */
  const swapUniV3 = async (tradeId: bigint, token: string, buyOrSell: bigint, amount: bigint, fee: bigint = BigInt(3000)) => {
    const task = async (coreContracts: CoreContracts) => {
      const tIndex = tokenList.findIndex(e => e.address === token)
      const hIndex = await getHandleIndex()
      const res = await coreContracts.routerContract.doV3Swap(tradeId, tIndex, hIndex, buyOrSell, amount, fee)
      return handleTransactionResponse(res)
    }
    return executeTask(task)
  }

  const faucetClaim = async (token: string) => {
    const task = async (coreContracts: CoreContracts) => {
      const res = await coreContracts.faucetContract.faucet(token)
      return handleTransactionResponse(res)
    }
    return executeTask(task)
  }



  const approveErc20 = async (token: string, spender: string, amount: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const erc20Contract = await coreContracts.getERC20Contract(token)
      const res = await erc20Contract.approve(spender, amount)
      return handleTransactionResponse(res)
    }
    return executeTask(task)
  }

  const allowanceErc20 = async (token: string, spender: string) => {
    const task = async (coreContracts: CoreContracts) => {
      const erc20Contract = await coreContracts.getERC20Contract(token)
      return erc20Contract.allowance(coreContracts.signer.address, spender)
    }
    return executeTask(task)
  }

  useEffect(() => {
    initializeContracts()
  }, [activeUser])

  useEffect(() => {
    initializeContracts()
  }, [])

  const resetProvider = () => {
    setCoreContracts(undefined)
    initializeContracts()
  }

  return {
    coreContracts,
    resetProvider,
    getShareProfitByUser,
    canCreateNewOrder,
    getOrderState,
    getHandleIndex,
    getAllowanceOfShares,
    approveShares,
    listShares,
    unlistShares,
    buyShares,
    createPools,
    createOrder,
    getLatestTradeId,
    getAmountForShares,
    followOrder,
    withdrawAsset,
    liquidateOrder,
    swapUniV3,
    faucetClaim,

    approveErc20,
    allowanceErc20,
  }
}

export default useCoreContract
