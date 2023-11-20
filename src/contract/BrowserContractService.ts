import type { ethers } from 'ethers'
import { Contract, JsonRpcProvider } from 'ethers'
import { message, notification } from 'antd'
import type { ERC20, FollowCapitalPool, FollowFactory, FollowHandle, FollowManage, FollowRefundFactory, FollowRefundPool, ProcessCenter } from '@/abis/types'
import followFactory_ABI from '@/abis/FollowFactory.json'
import followCapitalPool_ABI from '@/abis/FollowCapitalPool.json'
import followRefundFactory_ABI from '@/abis/FollowRefundFactory.json'
import followRefundPool_ABI from '@/abis/FollowRefundPool.json'
import processCenter_ABI from '@/abis/ProcessCenter.json'
import followManage_ABI from '@/abis/FollowManage.json'
import ERC20_ABI from '@/abis/ERC20.json'
import FollowHandle_ABI from '@/abis/FollowHandle.json'

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
    return
  }

  try {
    const receipt = await transactionResponse.wait()

    if (!receipt) {
      console.error('Transaction receipt is undefined')
      return
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

    return undefined
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

    return this._followCapitalPoolContract = createContract<FollowCapitalPool>(
      capitalPoolAddress!,
      followCapitalPool_ABI,
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
   * @return {*}  {Promise<FollowRefundPool>}
   * @memberof BrowserContractService
   */
  async getRefundPoolContract(): Promise<FollowRefundPool> {
    if (this._refundPoolContract)
      return this._refundPoolContract

    const refundPoolAddress: string = ''

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
      import.meta.env.VITE_FOLLOW_REFUND_FACTORY_ADDRESS,
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
   * 贷款人退款
   * 未达成目标,贷款人取回token
   *
   * @param {bigint} tradeId 未完成筹款目标的最小份数的已创建订单id
   * @return {*}
   * @memberof BrowserContractService
   */
  async capitalPool_Refund(tradeId: bigint): Promise<ethers.ContractTransactionReceipt | undefined> {
    const capitalPoolAddress = await this.getCapitalPoolAddress(tradeId)

    if (!capitalPoolAddress) {
      message.error('Capital pool address is undefined')
      throw new Error('Capital pool address is undefined')
    }

    const capitalPoolContract = await this.getCapitalPoolContract(capitalPoolAddress)
    const transaction = await capitalPoolContract?.refund(tradeId)

    return handleTransaction(transaction)
  }

  /**
   * 资金池授权handle
   *
   * @param {bigint} tradeId
   * @param {string} token token为已被允许的token组任何一个包括USDC
   * @param {string} handleAddress handleAddress handle合约地址
   * @memberof BrowserContractService
   */
  async capitalPool_ApproveHandle(tradeId: bigint, token: string) {
    const capitalPoolAddress = await this.getCapitalPoolAddress(tradeId)

    const capitalPoolContract = await this.getCapitalPoolContract(capitalPoolAddress)

    const transaction = await capitalPoolContract?.approveHandle(token, import.meta.env.VITE_SPOT_GOODS_HANDLE_ADDRESS)

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
  async capitalPool_MultiClearing(tradeId: bigint) {
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
  async capitalPool_ClearingMoney(token: string, tradeId: bigint, fee: bigint = BigInt(3000), amount: bigint = BigInt(100)) {
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
  async capitalPool_Repay(tradeId: bigint) {
    const cp = await this.getCapitalPoolAddress(tradeId)

    const capitalPoolContract = await this.getCapitalPoolContract(cp)

    // const getList = await capitalPoolContract?.getList(tradeId)

    const transaction = await capitalPoolContract?.repay(tradeId)

    return handleTransaction(transaction)
  }

  /**
   *
   *
   * @param {bigint} tradeId
   * @param {string} swapToken
   * @param {bigint} buyOrSell
   * @param {bigint} amount
   * @param {bigint} [fee]
   * @return {*}
   * @memberof BrowserContractService
   */
  async followHandle_SwapERC20(tradeId: bigint, swapToken: string, buyOrSell: bigint, amount: bigint, fee: bigint = BigInt(3000)) {
    const cp = await this.getCapitalPoolAddress(tradeId)

    const contract = await this.getFollowHandleContract()

    const transaction = await contract.swapERC20(cp!, tradeId, swapToken, buyOrSell, amount, fee)

    return handleTransaction(transaction)
  }
}
