import { Contract, ethers } from 'ethers'
import type { FollowCapitalPool, FollowFactory, FollowRefundFactory, FollowRefundPool } from '@/abis/types'
import followFactory_ABI from '@/abis/FollowFactory.json'
import followCapitalPool_ABI from '@/abis/FollowCapitalPool.json'
import followRefundFactory_ABI from '@/abis/FollowRefundFactory.json'
import followRefundPool_ABI from '@/abis/FollowRefundPool.json'

function createContract<T>(
  address: string,
  abi: any,
  signer: ethers.Signer,
): T {
  return new Contract(address, abi, signer) as T
}

export class BrowserContractService {
  static provider: ethers.BrowserProvider | undefined

  static signer: ethers.JsonRpcSigner | undefined

  static get getterProvider(): ethers.BrowserProvider | undefined {
    if (this.provider)
      return this.provider

    return this.provider = new ethers.BrowserProvider(window.ethereum)
  }

  static async getSigner(): Promise<ethers.JsonRpcSigner | undefined> {
    if (this.signer)
      return this.signer

    return this.signer = await this.getterProvider?.getSigner()
  }

  /**
   *贷款
   *
   * @static
   * @return {*}
   * @memberof BrowserContractService
   */
  static async getFollowCapitalPoolContract() {
    return createContract<FollowCapitalPool>(
      import.meta.env.VITE_FOLLOW_CAPITAL_POOL_ADDRESS,
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
  static async getFollowRefundPoolContract(): Promise<FollowRefundPool> {
    return createContract<FollowRefundPool>(
      import.meta.env.VITE_FOLLOW_REFUND_POOL_ADDRESS,
      followRefundPool_ABI,
      (await this.getSigner())!,
    )
  }
}
