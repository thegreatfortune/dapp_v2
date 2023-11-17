import type { ethers } from 'ethers'
import { Contract, JsonRpcProvider } from 'ethers'
import type { ERC20, FollowCapitalPool, FollowFactory, FollowManage, FollowRefundFactory, FollowRefundPool, ProcessCenter } from '@/abis/types'
import followFactory_ABI from '@/abis/FollowFactory.json'
import followCapitalPool_ABI from '@/abis/FollowCapitalPool.json'
import followRefundFactory_ABI from '@/abis/FollowRefundFactory.json'
import followRefundPool_ABI from '@/abis/FollowRefundPool.json'
import processCenter_ABI from '@/abis/ProcessCenter.json'
import followManage_ABI from '@/abis/FollowManage.json'
import ERC20_ABI from '@/abis/ERC20.json'

const BLACK_HOLE_ADDRESS = '0x0000000000000000000000000000000000000000'

function createContract<T>(
  address: string,
  abi: any,
  signer: ethers.Signer,
): T {
  return new Contract(address, abi, signer) as T
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
  private _followFactoryContract: FollowFactory | undefined

  /**
   *还款池
   *
   * @private
   * @type {(FollowRefundPool | undefined)}
   * @memberof BrowserContractService
   */
  private _followRefundPoolContract: FollowRefundPool | undefined

  /**
   *还款池工厂
   *
   * @private
   * @type {(FollowRefundFactory | undefined)}
   * @memberof BrowserContractService
   */
  private _followRefundFactoryContract: FollowRefundFactory | undefined

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
   * @return {*}  {(Promise<string | undefined>)}
   * @memberof BrowserContractService
   */
  async getCapitalPoolAddress(): Promise<string | undefined> {
    const followFactoryContract = await this.getFollowFactoryContract()

    const cp = await followFactoryContract?.AddressGetCapitalPool(this.getSigner.address)

    if (cp === BLACK_HOLE_ADDRESS) {
      console.error('%cCapitalPoolAddress:', cp)

      Promise.reject(new Error(`capital pool address is black hole: ${cp}`))
      return
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
  async getERC20Contract(): Promise<ERC20 | undefined> {
    if (this._ERC20Contract)
      return this._ERC20Contract

    return this._ERC20Contract = createContract<ERC20>(
      import.meta.env.VITE_USDC_ADDRESS,
      ERC20_ABI,
      this.signer,
    )
  }

  async getFollowCapitalPoolContract(cp?: string): Promise<FollowCapitalPool | undefined> {
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
    if (this._followFactoryContract)
      return this._followFactoryContract

    return this._followFactoryContract = createContract<FollowFactory>(
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
  async getFollowRefundPoolContract(): Promise<FollowRefundPool> {
    if (this._followRefundPoolContract)
      return this._followRefundPoolContract

    const refundPoolAddress: string = ''

    return this._followRefundPoolContract = createContract<FollowRefundPool>(
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
  async getFollowRefundFactoryContract(): Promise<FollowRefundFactory> {
    if (this._followRefundFactoryContract)
      return this._followRefundFactoryContract

    return this._followRefundFactoryContract = createContract<FollowRefundFactory>(
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

    // console.log('%c [ import.meta.env.VITE_FOLLOW_MANAGE_ADDRESS ]-223', 'font-size:13px; background:#99e25d; color:#ddffa1;', import.meta.env.VITE_FOLLOW_MANAGE_ADDRESS)
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
  async getFollowCapitalPoolContractByTradeId(tradeId: bigint) {
    const followManageContract = await this.getFollowManageContract()
    const cp = await followManageContract?.getTradeIdToCapitalPool(BigInt(tradeId))
    return this.getFollowCapitalPoolContract(cp)
  }
}
