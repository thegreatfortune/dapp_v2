import { ZeroAddress, ethers, parseUnits } from 'ethers'
import { useEffect, useState } from 'react'
import { message } from 'antd'
import { useAccount, useChainId } from 'wagmi'
import { CoreContracts } from '@/contract/coreContracts'
import { MessageError } from '@/enums/error'
import type { LoanForm } from '@/models/LoanForm'
import { tokenList } from '@/contract/tradingPairTokenMap'
import type { Models } from '@/.generated/api/models'
import loanService from '@/services/loanService'
import { handleTransactionResponse } from '@/helpers/helpers'

const useCoreContract = () => {
  const [coreContracts, setCoreContracts] = useState<CoreContracts>()
  const { address } = useAccount()
  const chainId = useChainId()

  const initializeContracts = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const coreContracts = CoreContracts.getCoreContractsInstance(signer, chainId)
    setCoreContracts(coreContracts)
  }

  type Task<T> = (coreContracts: CoreContracts) => Promise<T>
  const executeTask = async<T>(task: Task<T>) => {
    if (coreContracts) {
      try {
        return task(coreContracts)
      }
      catch (error) {
        if (error instanceof Error) {
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
   * @deprecated
   * if true, the user can create new order
   */
  const canCreateNewLoan = async () => {
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
   * @deprecated
   * check if the signer is in Blacklist
   */
  const inBlacklist = async () => {
    const task = async (coreContracts: CoreContracts) => {
      return coreContracts.processCenterContract._getIfBlackList(coreContracts.signer.address)
    }
    return executeTask(task)
  }

  /**
   * init the capital/refund pool contract and address, maybe undefined
   */
  const initPoolContracts = async () => {
    const task = async (coreContracts: CoreContracts) => {
      await coreContracts.getUserCapitalPoolAddress()
      await coreContracts.getUserRefundPoolAddress()
      return Promise.resolve(true)
    }
    return executeTask(task)
  }

  /**
   * Loan State
   */
  const getLoanState = async () => {
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
   * @deprecated
   * create capital pool and refund pool
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
   * get user's latest trader Id
   */
  const getLatestTradeIdByUser = async () => {
    const task = async (coreContracts: CoreContracts) => {
      if (coreContracts.capitalPoolAddress === ZeroAddress)
        await coreContracts.getUserCapitalPoolAddress()
      if (coreContracts.capitalPoolContract)
        return coreContracts.capitalPoolContract.getLastId()
      else
        return Promise.reject(MessageError.PoolsDoNotExist)
    }
    return executeTask(task)
  }

  /**
   * @deprecated
   * create order
   *
   * @param {LoanRequisitionEditModel} model
   */
  const createLoan = async (model: LoanForm) => {
    const task = async (coreContracts: CoreContracts) => {
      const decimals = await coreContracts.usdcContract.decimals()
      const res = await coreContracts.routerContract.borrowerCreateOrder(
        {
          _timePeriod: BigInt(model.duration),
          _repayTimes: BigInt(model.installments),
          _interestRate: BigInt(model.interest * 100),
          _shareRate: BigInt((model.dividend ?? 0) * 100),
          _goalShareCount: BigInt(model.numberOfShares),
          _minShareCount: BigInt(model.minimumRequiredRaisingShares ?? 0),
          _collectEndTime: BigInt(model.raisingTime!) * BigInt(86400), // seconds
          _goalMoney: BigInt(model.loanAmount!) * (BigInt(10) ** decimals), // decimals token for usdc
          uri: model.imageUrl!,
          name: model.name!,
        },
      )
      await handleTransactionResponse(res)
      const latestTradeId = await getLatestTradeIdByUser()
      const tradeDetail: Models.ISubmitNewLoanParams = {
        tradeId: Number(latestTradeId),
        loanPicUrl: model.imageUrl,
        loanName: model.name ?? '',
        loanIntro: model.description ?? '',
        tradingFormType: model.specifiedTradingType,
        tradingPlatformType: model.specifiedPlatformType,
        transactionPairs: model.specifiedPairs,
      }
      return loanService.submitNewLoan(chainId, tradeDetail)
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
  const followLoan = async (tradeId: bigint, shares: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const res = await coreContracts.routerContract.lendMoney(tradeId, shares)
      return handleTransactionResponse(res)
    }
    return executeTask(task)
  }

  /**
   * when trade is uncollected, the lender recover principal
   * @param tradeId
   */
  const recoverPrincipal = async (tradeId: bigint) => {
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
  const liquidateLoan = async (tradeId: bigint, installment: boolean) => {
    const task = async (coreContracts: CoreContracts) => {
      if (coreContracts.capitalPoolAddress === ZeroAddress)
        await coreContracts.getUserCapitalPoolAddress()

      if (coreContracts.capitalPoolContract) {
        if (installment) {
          const res = await coreContracts.capitalPoolContract.multiLiquidate(tradeId, 3000)
          return handleTransactionResponse(res)
        }
        else {
          const res = await coreContracts.capitalPoolContract.singleLiquidate(tradeId, 3000)
          return handleTransactionResponse(res)
        }
      }
      else {
        return Promise.reject(MessageError.PoolsDoNotExist)
      }
    }
    return executeTask(task)
  }

  /**
   * repay the loan
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

  /**
   * the lender or borrower withdraw all profits
   * @param tradeId
   */
  const withdrawProfit = async (tradeId: bigint, isLender: boolean) => {
    const task = async (coreContracts: CoreContracts) => {
      if (coreContracts.refundPoolAddress === ZeroAddress)
        coreContracts.getUserRefundPoolAddress()

      if (isLender) {
        const tokenId = await coreContracts.sharesContract.getPersonalSlotToTokenId(coreContracts.signer.address, tradeId)
        if (!tokenId)
          throw new Error(MessageError.TokenIdIsNotFound)
        const res = await coreContracts.refundPoolContract!.lenderWithdraw(tokenId)
        return handleTransactionResponse(res)
      }
      else {
        const res = await coreContracts.refundPoolContract!.borrowerWithdraw(tradeId)
        return handleTransactionResponse(res)
      }
    }
    return executeTask(task)
  }

  /**
   * deposit fund to capital pool. Anyone can call it
   * @param amount
   * @param tradeId
   */
  const deposit = async (amount: bigint, tradeId: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const allowance = await coreContracts.usdcContract.allowance(coreContracts.signer.address, await coreContracts.processCenterContract.getAddress())
      if (allowance < amount)
        return Promise.reject(MessageError.AllowanceIsNotEnough)
      const res = await coreContracts.processCenterContract.supply(import.meta.env.VITE_TOKEN_USDC, amount, tradeId)
      return handleTransactionResponse(res)
    }
    return executeTask(task)
  }

  /**
   * @deprecated
   * check if the token has been claimed
   * @param token
   */
  const claimStatusFromFaucet = async (token: string) => {
    const task = async (coreContracts: CoreContracts) => {
      try {
        await coreContracts.faucetContract.faucet.staticCall(token)
      }
      catch (error) {
        console.log('claim Error:', coreContracts.signer.address, error)
        if (error instanceof Error && error.toString().includes('Not withdraw'))
          return Promise.resolve(false)
      }
      return Promise.resolve(true)
    }
    return executeTask(task)
  }

  /**
   * claim the test token from faucet, like usdc
   * @deprecated
   * @param token
   */
  const claimTokenFromFaucet = async (token: string) => {
    const task = async (coreContracts: CoreContracts) => {
      const res = await coreContracts.faucetContract.faucet(token)
      return handleTransactionResponse(res)
    }
    return executeTask(task)
  }

  /**
   * approve usdc to spender
   * @param spender
   * @param amount
   */
  const approveUsdc = async (spender: string, amount: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const allowance = await coreContracts.usdcContract.allowance(coreContracts.signer.address, spender)
      if (allowance < amount) {
        const res = await coreContracts.usdcContract.approve(spender, amount)
        await handleTransactionResponse(res)
      }
      return Promise.resolve(true)
    }
    return executeTask(task)
  }

  /**
   * @deprecated
   * get FOF Balance
   */
  const getFofBalance = async () => {
    const task = async (coreContracts: CoreContracts) => {
      return coreContracts.fofContract.balanceOf(coreContracts.signer.address)
    }
    return executeTask(task)
  }

  /**
   * @deprecated
   * get NFT Balance
   */
  const getNftBalance = async () => {
    const task = async (coreContracts: CoreContracts) => {
      return [
        await coreContracts.nftContract.balanceOf(coreContracts.signer.address, 0),
        await coreContracts.nftContract.balanceOf(coreContracts.signer.address, 1),
        await coreContracts.nftContract.balanceOf(coreContracts.signer.address, 2),
        await coreContracts.nftContract.balanceOf(coreContracts.signer.address, 3),
      ]
    }
    return executeTask(task)
  }

  /**
   * check NFT mint whitelist
   * @param nftId
   */
  const checkNftWhitelist = async (nftId: number) => {
    const task = async (coreContracts: CoreContracts) => {
      return coreContracts.nftContract.getIfWhitelist(coreContracts.signer.address, nftId)
    }
    return executeTask(task)
  }
  /**
   * approve $FOF
   * @param spender
   * @param amount
   */
  const approveFof = async (spender: string, amount: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const allowance = await coreContracts.fofContract.allowance(coreContracts.signer.address, spender)
      if (allowance < amount) {
        const res = await coreContracts.fofContract.approve(spender, amount)
        await handleTransactionResponse(res)
      }
      return Promise.resolve(true)
    }
    return executeTask(task)
  }

  /**
   * do mint nft
   * @param id
   * @param amount
   */
  const mintNft = async (id: bigint, amount: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const res = await coreContracts.nftContract.doMint(id, amount)
      return handleTransactionResponse(res)
    }
    return executeTask(task)
  }

  /**
   * check claimable $FOF amount for user
   */
  const checkClaimableFoF = async (tradeId: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      return coreContracts.routerContract.getUserEarnTokenAmount(tradeId)
    }
    return executeTask(task)
  }

  /**
   * claim $FOF
   */
  const claimFoF = async (tradeId: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      const res = await coreContracts.routerContract.claimToken(tradeId)
      return handleTransactionResponse(res)
    }
    return executeTask(task)
  }

  /**
   * check if user has withdrawn
   * @param tradeId
   */
  const hasWithdrawn = async (tradeId: bigint) => {
    const task = async (coreContracts: CoreContracts) => {
      return coreContracts.routerContract.getUserIfWithdraw(tradeId)
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
  }, [address, chainId])

  // useEffect(() => {
  //   initializeContracts()
  // }, [])

  const resetProvider = () => {
    setCoreContracts(undefined)
    initializeContracts()
  }

  return {
    coreContracts,
    resetProvider,
    getShareProfitByUser,
    initPoolContracts,
    getLoanState,
    getAllowanceOfShares,
    approveShares,
    listShares,
    unlistShares,
    buyShares,
    getLatestTradeIdByUser,
    getAmountForShares,
    followLoan,
    recoverPrincipal,
    liquidateLoan,
    repay,
    getHandleIndex,
    swapUniV3,
    withdrawProfit,
    deposit,
    checkNftWhitelist,
    approveFof,
    mintNft,
    checkClaimableFoF,
    claimFoF,
    hasWithdrawn,
    claimStatusFromFaucet,
    claimTokenFromFaucet,
    canCreateNewLoan,
    inBlacklist,
    createPools,
    createLoan,
    getFofBalance,
    getNftBalance,

    approveUsdc,
    approveErc20,
    allowanceErc20,
  }
}

export default useCoreContract
