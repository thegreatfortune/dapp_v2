import { useJsonContract } from './useJsonContract'
import type { FollowCapitalPool, FollowFactory } from '@/abis/types'

import followCapitalPool_ABI from '@/abis/FollowCapitalPool.json'
import followFactory_ABI from '@/abis/FollowFactory.json'

export default function useContracts() {
  function jsonFollowCapitalPoolContract() {
    return useJsonContract<FollowCapitalPool>(import.meta.env.VITE_FOLLOW_CAPITAL_POOL_ADDRESS, followCapitalPool_ABI)
  }

  /**
   *资金池的工厂读合约
   *
   * @static
   * @return {*}
   * @memberof ContractService
   */
  function useJsonFollowFactoryContract() {
    return useJsonContract<FollowFactory>(import.meta.env.VITE_CORE_CAPITAL_FACTORY, followFactory_ABI)
  }

  /**
   *资金池的工厂写合约
   *
   * @return {*}
   */
  // function useBrowserFollowFactoryContract() {
  //   return useBrowserContract<FollowFactory>(import.meta.env.VITE_CORE_CAPITAL_FACTORY, followFactory_ABI)
  // }

  return {
    jsonFollowCapitalPoolContract,
    useJsonFollowFactoryContract,
    // useBrowserFollowFactoryContract,
  }
}
