import type { FollowCapitalPool, FollowFactory } from '@/abis/types'
import followCapitalPool_ABI from '@/abis/FollowCapitalPool.json'
import followFactory_ABI from '@/abis/FollowFactory.json'
import { useJsonContract } from '@/hooks/useJsonContract'

// import useBrowserContract from '@/hooks/useBrowserContract'

export class ContractService {
  /**
   *贷款
   *
   * @static
   * @return {*}
   * @memberof ContractService
   */
  static getFollowCapitalPoolContract() {
    return useJsonContract<FollowCapitalPool>(import.meta.env.VITE_FOLLOW_CAPITAL_POOL_ADDRESS, followCapitalPool_ABI)
  }

  /**
   *资金池的工厂合约
   *
   * @static
   * @return {*}
   * @memberof ContractService
   */
  static getFollowFactoryContract() {
    return useJsonContract<FollowFactory>(import.meta.env.VITE_FOLLOW_FACTORY_ADDRESS, followFactory_ABI)
  }

  // static browserFollowFactoryContract() {
  //   return useBrowserContract<FollowFactory>(import.meta.env.VITE_FOLLOW_FACTORY_ADDRESS, followFactory_ABI)
  // }
}