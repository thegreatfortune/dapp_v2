import { Contract, ethers } from 'ethers'
import type { FollowCapitalPool, FollowFactory, FollowManage, FollowRefundFactory, FollowRefundPool, ProcessCenter } from '@/abis/types'
import followFactory_ABI from '@/abis/FollowFactory.json'
import followCapitalPool_ABI from '@/abis/FollowCapitalPool.json'
import followRefundFactory_ABI from '@/abis/FollowRefundFactory.json'
import followRefundPool_ABI from '@/abis/FollowRefundPool.json'
import processCenter_ABI from '@/abis/ProcessCenter.json'
import followManage_ABI from '@/abis/FollowManage.json'

function createContract<T>(
  address: string,
  abi: any,
  signer: ethers.Signer,
): T {
  return new Contract(address, abi, signer) as T
}

export class BrowserContractService {
  /**
   *
   * @static
   * @type {(ethers.BrowserProvider | undefined)}
   * @memberof BrowserContractService
   */
  private static _provider: ethers.BrowserProvider | undefined

  /**
   * @static
   * @type {(ethers.JsonRpcSigner | undefined)}
   * @memberof BrowserContractService
   */
  private static _signer: ethers.JsonRpcSigner | undefined

  static get getterProvider(): ethers.BrowserProvider | undefined {
    if (this._provider)
      return this._provider

    return this._provider = new ethers.BrowserProvider(window.ethereum)
  }

  static async getSigner(): Promise<ethers.JsonRpcSigner | undefined> {
    if (this._signer)
      return this._signer

    return this._signer = await this.getterProvider?.getSigner()
  }

  /**
   *资金池
   *
   * @private
   * @static
   * @type {(FollowCapitalPool | undefined)}
   * @memberof BrowserContractService
   */
  private static _followCapitalPoolContract: FollowCapitalPool | undefined

  /**
   *资金池工厂
   *
   * @private
   * @static
   * @type {(FollowFactory | undefined)}
   * @memberof BrowserContractService
   */
  private static _followFactoryContract: FollowFactory | undefined

  /**
   *还款池
   *
   * @private
   * @static
   * @type {(FollowRefundPool | undefined)}
   * @memberof BrowserContractService
   */
  private static _followRefundPoolContract: FollowRefundPool | undefined

  /**
   *还款池工厂
   *
   * @private
   * @static
   * @type {(FollowRefundFactory | undefined)}
   * @memberof BrowserContractService
   */
  private static _followRefundFactoryContract: FollowRefundFactory | undefined

  /**
   *ProcessCenter
   *
   * @private
   * @static
   * @type {(ProcessCenter | undefined)}
   * @memberof BrowserContractService
   */
  private static _processCenterContract: ProcessCenter | undefined

  private static _followManageContract: FollowManage | undefined

  /**
   *资金池
   *
   * @static
   * @return {*}  {Promise<FollowCapitalPool>}
   * @memberof BrowserContractService
   */
  static async getFollowCapitalPoolContract(): Promise<FollowCapitalPool> {
    if (this._followCapitalPoolContract)
      return this._followCapitalPoolContract

    const signer = await this.getSigner()

    const followFactoryContract = await this.getFollowFactoryContract()

    const capitalPoolAddress = await followFactoryContract?.AddressGetCapitalPool(signer ?? '')

    return this._followCapitalPoolContract = createContract<FollowCapitalPool>(
      capitalPoolAddress!,
      followCapitalPool_ABI,
      (await this.getSigner())!,
    )
  }

  /**
   *资金池工厂
   *
   * @static
   * @return {*}  {Promise<FollowFactory>}
   * @memberof BrowserContractService
   */
  static async getFollowFactoryContract(): Promise<FollowFactory> {
    if (this._followFactoryContract)
      return this._followFactoryContract

    return this._followFactoryContract = createContract<FollowFactory>(
      import.meta.env.VITE_FOLLOW_FACTORY_ADDRESS,
      followFactory_ABI,
      (await this.getSigner())!,
    )
  }

  /**
   *还款池
   *
   * @static
   * @return {*}  {Promise<FollowRefundPool>}
   * @memberof BrowserContractService
   */
  static async getFollowRefundPoolContract(): Promise<FollowRefundPool> {
    if (this._followRefundPoolContract)
      return this._followRefundPoolContract

    const refundPoolAddress: string = ''

    return this._followRefundPoolContract = createContract<FollowRefundPool>(
      refundPoolAddress,
      followRefundPool_ABI,
      (await this.getSigner())!,
    )
  }

  /**
   *还款池工厂
   *
   * @static
   * @return {*}  {Promise<FollowRefundFactory>}
   * @memberof BrowserContractService
   */
  static async getFollowRefundFactoryContract(): Promise<FollowRefundFactory> {
    if (this._followRefundFactoryContract)
      return this._followRefundFactoryContract

    return this._followRefundFactoryContract = createContract<FollowRefundFactory>(
      import.meta.env.VITE_FOLLOW_REFUND_FACTORY_ADDRESS,
      followRefundFactory_ABI,
      (await this.getSigner())!,
    )
  }

  /**
   *ProcessCenter
   *
   * @static
   * @return {*}  {Promise<ProcessCenter>}
   * @memberof BrowserContractService
   */
  static async getProcessCenterContract(): Promise<ProcessCenter> {
    if (this._processCenterContract)
      return this._processCenterContract

    return this._processCenterContract = createContract<ProcessCenter>(
      import.meta.env.VITE_PROCESS_CENTER_ADDRESS,
      processCenter_ABI,
      (await this.getSigner())!,
    )
  }

  /**
   *FollowManage
   *
   * @static
   * @return {*}  {Promise<FollowManage>}
   * @memberof BrowserContractService
   */
  static async getFollowManageContract(): Promise<FollowManage> {
    if (this._followManageContract)
      return this._followManageContract

    return this._followManageContract = createContract<FollowManage>(
      import.meta.env.VITE_FOLLOW_MANAGE_ADDRESS,
      followManage_ABI,
      (await this.getSigner())!,
    )
  }
}
