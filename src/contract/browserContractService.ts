import { Contract, ethers } from 'ethers'

import { message, notification } from 'antd'

// import Quoter_ABI from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
// import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'

// import type { IQuoter } from './IQuoter'
import type { ERC20, ERC3525, FollowCapitalPool, FollowFactory, FollowHandle, FollowManage, FollowRefundFactory, FollowRefundPool, LocalCapitalPool, ProcessCenter, UniswapV3 } from '@/abis/types'
import followFactory_ABI from '@/abis/FollowFactory.json'
import followCapitalPool_ABI from '@/abis/FollowCapitalPool.json'
import LocalCapitalPool_ABI from '@/abis/LocalCapitalPool.json'
import followRefundFactory_ABI from '@/abis/FollowRefundFactory.json'
import followRefundPool_ABI from '@/abis/FollowRefundPool.json'
import processCenter_ABI from '@/abis/ProcessCenter.json'
import followManage_ABI from '@/abis/FollowManage.json'
import ERC20_ABI from '@/abis/ERC20.json'
import TEST_LIQUIDITY_ABI from '@/abis/UniswapV3.json'
import FollowHandle_ABI from '@/abis/FollowHandle.json'
import ERC3525_ABI from '@/abis/ERC3525.json'
import { Models } from '@/.generated/api/models'
import type { LoanRequisitionEditModel } from '@/models/LoanRequisitionEditModel'
import { LoanService } from '@/.generated/api/Loan'

const BLACK_HOLE_ADDRESS = '0x0000000000000000000000000000000000000000'

function createContract<T>(
  address: string,
  abi: any,
  signer: ethers.Signer,
): T {
  return new Contract(address, abi, signer) as T
}

async function handleTransaction(
  transactionResponse: ethers.ContractTransactionResponse | undefined,
  successMessage = 'Transaction Successful',
  failureMessage = 'Transaction Failed',
): Promise<ethers.ContractTransactionReceipt | undefined> {
  if (!transactionResponse) {
    console.error('Transaction response is undefined')
    return undefined
  }

  try {
    const receipt = await transactionResponse.wait()

    if (!receipt) {
      console.error('Transaction receipt is undefined')
      return undefined
    }

    if (receipt.status === 1) {
      // Transaction succeeded
      notification.success({
        message: successMessage,
        description: 'Your transaction was successful!',
      })
    }
    else {
      // Transaction failed
      notification.error({
        message: failureMessage,
        description: 'Your transaction failed. Please try again.',
      })
    }

    return receipt
  }
  catch (error) {
    console.error('Error while waiting for transaction receipt:', error)

    notification.error({
      message: 'Transaction Error',
      description: 'An error occurred during the transaction. Please try again.',
    })

    throw error
  }
}

export class BrowserContractService {
  constructor(private signer: ethers.JsonRpcSigner) {
  }

  /**
   *not a address
   *
   * @readonly
   * @type {ethers.JsonRpcSigner}
   * @memberof BrowserContractService
   */
  get getSigner(): ethers.JsonRpcSigner {
    return this.signer
  }

  /**
   *资金池
   *
   * @private
   * @type {(FollowCapitalPool | undefined)}
   * @memberof BrowserContractService
   */
  private _followCapitalPoolContract: FollowCapitalPool | undefined

  /**
   *资金池工厂
   *
   * @private
   * @type {(FollowFactory | undefined)}
   * @memberof BrowserContractService
   */
  private _FollowFactoryContract: FollowFactory | undefined

  /**
   *还款池
   *
   * @private
   * @type {(FollowRefundPool | undefined)}
   * @memberof BrowserContractService
   */
  private _refundPoolContract: FollowRefundPool | undefined

  /**
   *还款池工厂
   *
   * @private
   * @type {(FollowRefundFactory | undefined)}
   * @memberof BrowserContractService
   */
  private _refundFactoryContract: FollowRefundFactory | undefined

  /**
   *ProcessCenter
   *
   * @private
   * @type {(ProcessCenter | undefined)}
   * @memberof BrowserContractService
   */
  private _processCenterContract: ProcessCenter | undefined

  private _followManageContract: FollowManage | undefined

  /**
   *资金池地址
   *
   * @private
   * @type {(string | undefined)}
   * @memberof BrowserContractService
   */
  private _capitalPoolAddress: string | undefined

  private _ERC20Contract: ERC20 | undefined

  /**
   *获取资金池地址
   *
   * @param {bigint} [tradeId]
   * @return {*}  {(Promise<string | undefined>)}
   * @memberof BrowserContractService
   */
  async getCapitalPoolAddress(tradeId?: bigint): Promise<string> {
    const followFactoryContract = await this.getFollowFactoryContract()

    if (Number(tradeId) >= 0 && tradeId) {
      const followManageContract = await this.getFollowManageContract()
      return followManageContract?.getTradeIdToCapitalPool(tradeId)
    }

    const cp = await followFactoryContract?.AddressGetCapitalPool(this.getSigner.address)
    console.log('%c [ cp ]-160', 'font-size:13px; background:#683c68; color:#ac80ac;', cp)

    if (cp === BLACK_HOLE_ADDRESS) {
      console.error('%cCapitalPoolAddress:', cp)
      throw new Error(`capital pool address is black hole: ${cp}`)
    }

    return this._capitalPoolAddress = cp
  }

  /**
   *ERC20
   *
   * .
   * @return {*}  {Promise<FollowCapitalPool>}
   * @memberof BrowserContractService
   */
  async getERC20Contract(token?: string): Promise<ERC20 | undefined> {
    // if (this._ERC20Contract && !token)
    //   return this._ERC20Contract

    return this._ERC20Contract = createContract<ERC20>(
      token ?? import.meta.env.VITE_USDC_TOKEN,
      ERC20_ABI,
      this.signer,
    )
  }

  /**
   * 获取报价
   *
   * @param {string} [token]
   * @return {*}  {(Promise<UniswapV3 | undefined>)}
   * @memberof BrowserContractService
   */
  async getTestLiquidityContract(token?: string): Promise<UniswapV3 | undefined> {
    // if (this._ERC20Contract && !token)
    //   return this._ERC20Contract

    return createContract<UniswapV3>(
      token ?? import.meta.env.VITE_TEST_LIQUIDITY_ADDRESS,
      TEST_LIQUIDITY_ABI,
      this.signer,
    )
  }

  /**
   * FollowHandle
   *
   * @return {*}
   * @memberof BrowserContractService
   */
  async getFollowHandleContract() {
    return createContract<FollowHandle>(
      import.meta.env.VITE_FOLLOW_HANDLE_ADDRESS,
      FollowHandle_ABI,
      this.signer,
    )
  }

  async getCapitalPoolContract(cp?: string): Promise<FollowCapitalPool | undefined> {
    const capitalPoolAddress = cp ?? await this.getCapitalPoolAddress()

    const abi = import.meta.env.DEV ? LocalCapitalPool_ABI : followCapitalPool_ABI

    return this._followCapitalPoolContract = createContract<FollowCapitalPool>(
      capitalPoolAddress!,
      abi,
      this.signer,
    )
  }

  /**
   *资金池工厂
   *
   * @return {*}  {Promise<FollowFactory>}
   * @memberof BrowserContractService
   */
  async getFollowFactoryContract(): Promise<FollowFactory> {
    if (this._FollowFactoryContract)
      return this._FollowFactoryContract

    return this._FollowFactoryContract = createContract<FollowFactory>(
      import.meta.env.VITE_FOLLOW_FACTORY_ADDRESS,
      followFactory_ABI,
      this.signer,
    )
  }

  /**
   *还款池
   *
   * @param {bigint} [tradeId]
   * @return {*}  {Promise<FollowRefundPool>}
   * @memberof BrowserContractService
   */
  async getRefundPoolContract(tradeId: bigint): Promise<FollowRefundPool> {
    const refundFactoryContract = await this.getRefundFactoryContract()

    const cp = this.getCapitalPoolAddress(tradeId)

    const refundPoolAddress = await refundFactoryContract.getRefundPool(cp)

    if (!refundPoolAddress) {
      message.error(`refund pool address is undefined: ${refundPoolAddress}`)
      throw new Error(`refund pool address is undefined: ${refundPoolAddress}`)
    }

    return this._refundPoolContract = createContract<FollowRefundPool>(
      refundPoolAddress,
      followRefundPool_ABI,
      this.signer,
    )
  }

  /**
   *还款池工厂
   *
   * @return {*}  {Promise<FollowRefundFactory>}
   * @memberof BrowserContractService
   */
  async getRefundFactoryContract(): Promise<FollowRefundFactory> {
    if (this._refundFactoryContract)
      return this._refundFactoryContract

    return this._refundFactoryContract = createContract<FollowRefundFactory>(
      import.meta.env.VITE_REFUND_FACTORY_ADDRESS,
      followRefundFactory_ABI,
      this.signer,
    )
  }

  /**
   *ProcessCenter
   *
   * @return {*}  {Promise<ProcessCenter>}
   * @memberof BrowserContractService
   */
  async getProcessCenterContract(): Promise<ProcessCenter> {
    if (this._processCenterContract)
      return this._processCenterContract

    return this._processCenterContract = createContract<ProcessCenter>(
      import.meta.env.VITE_PROCESS_CENTER_ADDRESS,
      processCenter_ABI,
      this.signer,
    )
  }

  /**
   *FollowManage
   *
   * @return {*}  {Promise<FollowManage>}
   * @memberof BrowserContractService
   */
  async getFollowManageContract(): Promise<FollowManage> {
    if (this._followManageContract)
      return this._followManageContract

    // const provider = new JsonRpcProvider(import.meta.env.VITE_RPC)

    // return new Contract(import.meta.env.VITE_FOLLOW_MANAGE_ADDRESS, followManage_ABI, provider) as unknown as FollowManage

    return this._followManageContract = createContract<FollowManage>(
      import.meta.env.VITE_FOLLOW_MANAGE_ADDRESS,
      followManage_ABI,
      this.signer,
    )
  }

  /**
   * ERC3525
   *
   * @return {*}  {Promise<ERC3525>}
   * @memberof BrowserContractService
   */
  async getERC3525Contract() {
    return createContract<ERC3525>(
      import.meta.env.VITE_ERC3525_ADDRESS,
      ERC3525_ABI,
      this.signer,
    )
  }

  /**
   *swap quote
   *
   * @return {*}
   * @memberof BrowserContractService
   */
  // async getSwapQuoteContract() {
  //   return createContract<IQuoter>(
  //     import.meta.env.VITE_QUOTER_CONTRACT_ADDRESS,
  //     Quoter_ABI.abi,
  //     this.signer,
  //   )
  // }

  // view

  // async quote() {
  //   const swapQuoteContract = await this.getSwapQuoteContract()
  //   // swapQuoteContract.quoteExactInputSingle()
  // }

  /**
   *根据订单ID获取资金池合约
   *
   * @param {bigint} tradeId
   * @return {*}
   * @memberof BrowserContractService
   */
  async getCapitalPoolContractByTradeId(tradeId: bigint) {
    const followManageContract = await this.getFollowManageContract()
    const cp = await followManageContract?.getTradeIdToCapitalPool(BigInt(tradeId))
    console.log('%c [ cp ]-248', 'font-size:13px; background:#42e6ce; color:#86ffff;', cp)

    const capitalPoolContract = await this.getCapitalPoolContract(cp)
    const getList = await capitalPoolContract?.getList(tradeId)

    console.log('%c [ getList ]-269', 'font-size:13px; background:#64b998; color:#a8fddc;', getList)

    return capitalPoolContract
  }

  /**
   * 根据用户地址得到用户拥有的所有ERC3525 tokenid
   */
  async ERC3525_getPersonalMes() {
    const ERC3525Contract = await this.getERC3525Contract()
    return ERC3525Contract.getPersonalMes(this.signer.address)
  }

  /**
   *获取还款池地址
   *
   * @param {bigint} tradeId
   * @return {*}
   * @memberof BrowserContractService
   */
  async getRefundPoolAddress(tradeId: bigint) {
    const cp = await this.getCapitalPoolAddress(tradeId)

    const pcc = await this.getProcessCenterContract()

    return pcc._getRefundPool(cp)
  }

  // write

  /**
   *授权 true为已授权
   *
   * @param {bigint} tradeId
   * @return {*}  {Promise<boolean>}
   * @memberof BrowserContractService
   */
  async ERC20_approve(tradeId: bigint): Promise<boolean> {
    const ERC20Contract = await this?.getERC20Contract()

    const followManageContract = await this?.getFollowManageContract()

    const cp = await followManageContract?.getTradeIdToCapitalPool(BigInt(tradeId))

    if (!cp)
      return false

    const allowance = await ERC20Contract?.allowance(cp, this?.getSigner.address)
    console.log('%c [ allowance ]-418', 'font-size:13px; background:#3174f1; color:#75b8ff;', allowance)

    if ((allowance ?? BigInt(0)) <= BigInt(0)) {
      const approveRes = await ERC20Contract?.approve(cp, BigInt(200 * 10 ** 6) * BigInt(10 ** 18))
      if (!approveRes)
        return false

      const approveResult = await approveRes?.wait()

      if (approveResult?.status !== 1)
        return true
    }

    return true
  }

  /**
   * 铸币
   *
   * @param {string} token
   * @param {number} [amount]
   * @return {*}
   * @memberof BrowserContractService
   */
  async ERC20_mint(token: string, amount: bigint = ethers.parseEther(String(10 ** 8))) {
    console.log('%c [ amount ]-442', 'font-size:13px; background:#fd89f9; color:#ffcdff;', amount)
    console.log('%c [ token ]-444', 'font-size:13px; background:#b56a27; color:#f9ae6b;', token)
    const contract = await this.getERC20Contract(token)
    console.log('%c [ contract ]-445', 'font-size:13px; background:#3646cb; color:#7a8aff;', contract)
    const res = await contract?._mint(this.getSigner.address, amount)
    return handleTransaction(res)
  }

  /**
   *创建订单
   *
   * @param {LoanRequisitionEditModel} model
   * @return {*}
   * @memberof BrowserContractService
   */
  async capitalPool_createOrder(model: LoanRequisitionEditModel) {
    const capitalPoolContract = await this.getCapitalPoolContract()

    if (import.meta.env.DEV) {
      const cp = await capitalPoolContract?.getAddress()

      if (!cp)
        return

      const localCapitalPoolContract = createContract<LocalCapitalPool>(
        cp,
        LocalCapitalPool_ABI,
        this.signer,
      )

      const t1 = await localCapitalPoolContract.set([import.meta.env.VITE_USDC_TOKEN, import.meta.env.VITE_ERC3525_ADDRESS, import.meta.env.VITE_FOLLOW_MANAGE_ADDRESS, this.getSigner.address])
      const res = await handleTransaction(t1, 'Authorization succeeds', 'Authorization failed')
      if (res?.status !== 1)
        return
    }

    const transaction = await capitalPoolContract?.createOrder(
      [
        BigInt(model.cycle),
        BigInt(model.period),
      ],
      [
        BigInt((model.interest * 100)),
        BigInt(model.dividend),
        BigInt(model.numberOfCopies),
        BigInt(model.minimumRequiredCopies),
      ],
      BigInt(model.raisingTime) * BigInt(60), // TODO 秒数
      BigInt(model.applyLoan) * BigInt(10 ** 18),
      'https://6a32f35977ea4e1844ce0dbab6b9c6d9.ipfs.4everland.link/ipfs/bafybeidnzira46v3ebmq3qw7vlovr4lgx4ytwgsyzi5ym4pf43ycki2g3u',
      'image1',
    )

    const result = await handleTransaction(transaction)

    if (result?.status === 1) {
      const loanConfirm = {
        ...new Models.LoanConfirmParam(),
        loanName: model.itemTitle ?? '',
        loanIntro: model.description ?? '',
        transactionPairs: model.transactionPairs,
        tradingFormType: model.tradingFormType,
        tradingPlatformType: model.tradingPlatformType,
      }

      const cp = await capitalPoolContract?.getAddress()

      const followManageContract
        = await this.getFollowManageContract()

      const tids = await followManageContract?.getborrowerAllOrdersId(
        this.getSigner.address ?? '',
        cp ?? '',
      )

      loanConfirm.tradeId = String(Number(tids?.at(-1)) ?? 0)

      return LoanService.ApiLoanConfirm_POST(loanConfirm)
    }
  }

  /**
   * 贷款人存入份数数量(贷款人借出)
   * 使用订单ID对应的资金池地址来进行认购初始化合约
   *
   * @param {bigint} copies 输入的份数超过订单id的目标份数报错
   * @param {string} tradeId
   * @return {*}
   * @memberof BrowserContractService
   */
  async capitalPool_lend(copies: bigint, tradeId: bigint) {
    const capitalPoolAddress = await this.getCapitalPoolAddress(tradeId)

    const capitalPoolContract = await this.getCapitalPoolContract(capitalPoolAddress)

    const transaction = await capitalPoolContract?.lend(copies, tradeId)
    return handleTransaction(transaction, 'Transaction Successful', 'Transaction Failed. Please try again.')
  }

  /**
   * 贷款人退款
   * 未达成目标,贷款人取回token
   *
   * @param {bigint} tradeId 未完成筹款目标的最小份数的已创建订单id
   * @return {*}
   * @memberof BrowserContractService
   */
  async capitalPool_refund(tradeId: bigint): Promise<ethers.ContractTransactionReceipt | undefined> {
    const capitalPoolAddress = await this.getCapitalPoolAddress(tradeId)

    if (!capitalPoolAddress) {
      message.error('Capital pool address is undefined')
      throw new Error('Capital pool address is undefined')
    }

    const capitalPoolContract = await this.getCapitalPoolContract(capitalPoolAddress)
    const transaction = await capitalPoolContract?.refund(tradeId)

    return handleTransaction(transaction, 'Transaction Successful', 'Transaction Failed. Please try again.')
  }

  /**
   * 资金池授权handle
   *
   * @param {bigint} tradeId
   * @param {string} token token为已被允许的token组任何一个包括USDC
   * @param {string} handleAddress handleAddress handle合约地址
   * @memberof BrowserContractService
   */
  async capitalPool_approveHandle(tradeId: bigint, token: string) {
    const capitalPoolAddress = await this.getCapitalPoolAddress(tradeId)

    const capitalPoolContract = await this.getCapitalPoolContract(capitalPoolAddress)

    const transaction = await capitalPoolContract?.approveHandle(token, import.meta.env.VITE_FOLLOW_HANDLE_ADDRESS)

    return handleTransaction(transaction)
  }

  /**
   * 分期性还款清算
   * 借款人在资金池有充足的资金准备清算下可以完成所有清算次数
   * 如果没有随便传一个已允许的token
   *
   * @param {bigint} tradeId 已创建的达成最小份数的订单id
   * @return {*}
   * @memberof BrowserContractService
   */
  async capitalPool_multiClearing(tradeId: bigint) {
    const capitalPoolAddress = await this.getCapitalPoolAddress(tradeId)

    const capitalPoolContract = await this.getCapitalPoolContract(capitalPoolAddress)

    const transaction = await capitalPoolContract?.multiClearing(tradeId)

    return handleTransaction(transaction)
  }

  /**
   *清算其余资产 （非USDC）
   *
   * @param {string} token 非USDC的已被允许的token，如果该token在合约有剩余即转换为USDC
   * @param {bigint} tradeId 已创建的达成最小份数的订单id
   * @param {bigint} fee UniswapV3对应交易对的fee，默认选择3000
   * @param {bigint} amount 传入的token的数量
   * @memberof BrowserContractService
   */
  async capitalPool_clearingMoney(token: string, tradeId: bigint, fee: bigint = BigInt(3000), amount: bigint = BigInt(100)) {
    const cp = await this.getCapitalPoolAddress(tradeId)

    if (!cp) {
      message.error('capital pool address is undefined')
      Promise.reject(new Error('capital pool address is undefined'))
    }

    const capitalPoolContract = await this.getCapitalPoolContract(cp)

    const transaction = await capitalPoolContract?.clearingMoney(token, tradeId, fee, amount)

    return handleTransaction(transaction)
  }

  /**
   * 一次性还款清算(如果借款人不主动触发清算，任何人都可以触发该函数进行清算)
   * 在达到最小份数，并且结束后才可触发
   *
   * @param {bigint} tradeId 已创建的达成最小份数的订单id
   * @return {*}
   * @memberof BrowserContractService
   */
  async capitalPool_singleClearing(tradeId: bigint) {
    const cp = await this.getCapitalPoolAddress(tradeId)

    const capitalPoolContract = await this.getCapitalPoolContract(cp)

    const getList = await capitalPoolContract?.getList(tradeId)
    console.log('%c [ getList ]-381', 'font-size:13px; background:#5511ee; color:#9955ff;', getList)

    const transaction = await capitalPoolContract?.singleClearing(tradeId)

    return handleTransaction(transaction)
  }

  /**
   * 借款人偿还欠款
   * 借款人结束时间后剩余需要偿还的坏账
   *
   * @param {bigint} tradeId
   * @return {*}
   * @memberof BrowserContractService
   */
  async capitalPool_repay(tradeId: bigint) {
    const approve = this.ERC20_approve(tradeId)

    if (!approve) {
      message.error('approve is error')
      throw new Error('approve is error')
    }

    const cp = await this.getCapitalPoolAddress(tradeId)

    const capitalPoolContract = await this.getCapitalPoolContract(cp)

    // const getList = await capitalPoolContract?.getList(tradeId)

    const transaction = await capitalPoolContract?.repay(tradeId)

    return handleTransaction(transaction)
  }

  /**
   * swap操作，仅由传入的已创建的资金池创建者可以调用
   *
   * @param {bigint} tradeId
   * @param {string} swapToken
   * @param {bigint} buyOrSell
   * @param {bigint} amount
   * @param {bigint} [fee]
   * @return {*}
   * @memberof BrowserContractService
   */
  async followHandle_swapERC20(tradeId: bigint, swapToken: string, buyOrSell: bigint, amount: bigint, fee: bigint = BigInt(3000)) {
    await this.capitalPool_approveHandle(tradeId, swapToken)

    const cp = await this.getCapitalPoolAddress(tradeId)

    const contract = await this.getFollowHandleContract()

    const transaction = await contract.swapERC20(cp!, tradeId, swapToken, buyOrSell, amount, fee)

    return handleTransaction(transaction)
  }

  /**
   * 贷款人提取最后清算的资金+还款资金+分红资金(订单结束时间10天后才可提取)
   *
   * @param {bigint} tradeId
   * @return {*}
   * @memberof BrowserContractService
   */
  async refundPool_lenderWithdraw(tradeId: bigint) {
    const refundPoolContract = await this.getRefundPoolContract(tradeId)

    const tokenIds = await this.ERC3525_getPersonalMes()

    const tokenId = tokenIds.at(-1)

    if (!tokenId) {
      message.error('refund pool tokenId is undefined')
      throw new Error('refund pool tokenId is undefined')
    }

    const transaction = await refundPoolContract.lenderWithdraw(tokenId) // tokenId用户持有的ERC3525的tokenId

    return handleTransaction(transaction)
  }

  /**
   * 借款人提取
   *
   * @param {bigint} tradeId 借款人发起的订单id，即对应槽值
   * @return {*}
   * @memberof BrowserContractService
   */
  async refundPool_borrowerWithdraw(tradeId: bigint) {
    const refundPoolContract = await this.getRefundPoolContract(tradeId)

    const transaction = await refundPoolContract.borrowerWithdraw(tradeId)
    console.log('%c [ transaction ]-529', 'font-size:13px; background:#f5a83f; color:#ffec83;', transaction)

    return handleTransaction(transaction)
  }

  /**
   * 供应(所有人皆可触发)
   *
   * @param {bigint} amount USDC数量
   * @param {bigint} tradeId 订单id
   * @return {*}
   * @memberof BrowserContractService
   */
  async refundPool_supply(amount: bigint, tradeId: bigint) {
    const approve = this.ERC20_approve(tradeId)

    if (!approve) {
      message.error('approve is error')
      throw new Error('approve is error')
    }

    const refundPoolContract = await this.getRefundPoolContract(tradeId)

    const transaction = await refundPoolContract.supply(amount, tradeId)

    return handleTransaction(transaction)
  }
}
