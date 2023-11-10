import { Contract, ethers } from 'ethers'
import type { FollowCapitalPool, FollowFactory, FollowRefundFactory, FollowRefundPool, ProcessCenter } from '@/abis/types'
import followFactory_ABI from '@/abis/FollowFactory.json'
import followCapitalPool_ABI from '@/abis/FollowCapitalPool.json'
import followRefundFactory_ABI from '@/abis/FollowRefundFactory.json'
import followRefundPool_ABI from '@/abis/FollowRefundPool.json'
import processCenter_ABI from '@/abis/ProcessCenter.json'

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
   *@deprecated 不要直接使用未初始化的值 使用getterProvider
   * @static
   * @type {(ethers.BrowserProvider | undefined)}
   * @memberof BrowserContractService
   */
  static provider: ethers.BrowserProvider | undefined

  /**
   *@deprecated 不要直接使用未初始化的值 使用getSigner
   * @static
   * @type {(ethers.JsonRpcSigner | undefined)}
   * @memberof BrowserContractService
   */
  static signer: ethers.JsonRpcSigner | undefined

  static get getterProvider(): ethers.BrowserProvider | undefined {
    if (this.provider)
      return this.provider

    return this.provider = new ethers.BrowserProvider(window.ethereum)
  }

  static async getSigner(): Promise<ethers.JsonRpcSigner | undefined> {
    if (this.signer)
      return this.signer

    // if (import.meta.env.MODE === 'development')
    //   return ({ address: import.meta.env.VITE_OFFICIAL_PRIVATE_ADDRESS }) as any

    return this.signer = await this.getterProvider?.getSigner()
  }

  /**
   *贷款
   *
   * @static
   * @return {*}
   * @memberof BrowserContractService
   */
  static async getFollowCapitalPoolContract(capitalPoolAddress: string) {
    return createContract<FollowCapitalPool>(
      capitalPoolAddress,
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
    return createContract<FollowFactory>(
      import.meta.env.VITE_FOLLOW_FACTORY_ADDRESS,
      followFactory_ABI,
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
    return createContract<FollowRefundFactory>(
      import.meta.env.VITE_FOLLOW_REFUND_FACTORY_ADDRESS,
      followRefundFactory_ABI,
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
  static async getFollowRefundPoolContract(refundPoolAddress: string): Promise<FollowRefundPool> {
    return createContract<FollowRefundPool>(
      refundPoolAddress,
      followRefundPool_ABI,
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
    return createContract<ProcessCenter>(
      import.meta.env.VITE_PROCESS_CENTER_ADDRESS,
      processCenter_ABI,
      (await this.getSigner())!,
    )
  }
}
