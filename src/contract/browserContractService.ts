import { Contract, ethers } from 'ethers'
import { message, notification } from 'antd'
import BigNumber from 'bignumber.js'
import type { ERC20, ERC3525, FollowCapitalPool, FollowFactory, FollowFaucet, FollowFiERC1155, FollowHandle, FollowManage, FollowMarket, FollowRefundFactory, FollowRefundPool, FollowRouter, ProcessCenter, UniswapV3 } from '@/abis/types'
import followFactory_ABI from '@/abis/FollowFactory.json'
import followCapitalPool_ABI from '@/abis/FollowCapitalPool.json'
import followRefundFactory_ABI from '@/abis/FollowRefundFactory.json'
import followRefundPool_ABI from '@/abis/FollowRefundPool.json'
import processCenter_ABI from '@/abis/ProcessCenter.json'
import followManage_ABI from '@/abis/FollowManage.json'
import FollowMarket_ABI from '@/abis/FollowMarket.json'
import FollowRouter_ABI from '@/abis/FollowRouter.json'
import FollowFaucet_ABI from '@/abis/FollowFaucet.json'

// import LocalERC20_ABI from '@/abis/LocalERC20.json'
import TEST_LIQUIDITY_ABI from '@/abis/UniswapV3.json'
import FollowHandle_ABI from '@/abis/FollowHandle.json'
import ERC3525_ABI from '@/abis/ERC3525.json'
import ERC20_ABI from '@/abis/ERC20.json'
import ERC1155_ABI from '@/abis/FollowFiERC1155.json'
import { Models } from '@/.generated/api/models'

// import type { LoanRequisitionEditModel } from '@/models/LoanRequisitionEditModel'
import { LoanService } from '@/.generated/api/Loan'
import { tokenList } from '@/contract/tradingPairTokenMap'
import { ChainAddressEnums } from '@/enums/chain'

const BLACK_HOLE_ADDRESS = '0x0000000000000000000000000000000000000000'

const LocalEnv = true

type LocalContractType<T extends boolean, U> = T extends true
  ? U
  : U

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
  if (!transactionResponse)
    throw new Error('Transaction response is undefined')

  try {
    const receipt = await transactionResponse.wait()

    if (!receipt)
      throw new Error('HandleTransaction: Transaction receipt is undefined')

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
      throw new Error('HandleTransaction: Your transaction failed. Please try again.')
    }

    console.log('Receipt Info', receipt)
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
  constructor(private signer: ethers.JsonRpcSigner, private _chainId: number) {
    this._chainAddresses = ChainAddressEnums[this._chainId]
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

  get chainId(): number {
    return this._chainId
  }

  private _chainAddresses: { [key: string]: string }

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

  private _faucetContract: FollowFaucet | undefined

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

    if (import.meta.env.DEV) {
      const c = await this.getCapitalPoolContract(cp)

      if (tradeId) {
        const list = await c.getList(tradeId)

        console.log('%c [ list ]-183', 'font-size:13px; background:#bb6424; color:#ffa868;', list)
      }
    }
    return this._capitalPoolAddress = cp
  }

  /**
   * ERC20
   *
   * @param {string} [token]
   * @return {*}
   * @memberof BrowserContractService
   */

  async getERC20Contract(token?: string) {
    return createContract<LocalContractType<typeof LocalEnv, ERC20>>(
      token ?? this._chainAddresses.USDC,
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
      token ?? this._chainAddresses.liquidity,
      TEST_LIQUIDITY_ABI,
      this.signer,
    )
  }

  /**
   * FollowMarket
   *
   * @return {*}
   * @memberof BrowserContractService
   */
  async getFollowMarketContract(marketId?: bigint) {
    const contract = createContract<FollowMarket>(
      this._chainAddresses.market,
      FollowMarket_ABI,
      this.signer,
    )

    if (marketId) {
      const info = await contract.getIdToSaleMes(marketId)
      console.log('%c [ getIdToSaleMes info ]-250', 'font-size:13px; background:#0b82a6; color:#4fc6ea;', info)
    }

    return contract
  }

  /**
   * FollowHandle
   *
   * @return {*}
   * @memberof BrowserContractService
   */
  async getFollowHandleContract() {
    return createContract<FollowHandle>(
      this._chainAddresses.handle,
      FollowHandle_ABI,
      this.signer,
    )
  }

  /**
   * FollowRouter
   *
   * @return {*}
   * @memberof BrowserContractService
   */
  async getFollowRouterContract() {
    return createContract<FollowRouter>(
      this._chainAddresses.router,
      FollowRouter_ABI,
      this.signer,
    )
  }

  async getCapitalPoolContract(cp?: string) {
    const capitalPoolAddress = cp ?? await this.getCapitalPoolAddress()

    // if (LocalEnv) {
    //   return createContract<LocalContractType<typeof LocalEnv, LocalCapitalPool>>(
    //     capitalPoolAddress!,
    //     LocalCapitalPool_ABI,
    //     this.signer,
    //   )
    // }

    return this._followCapitalPoolContract = createContract<LocalContractType<typeof LocalEnv, FollowCapitalPool>>(
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
    // if (this._FollowFactoryContract)
    //   return this._FollowFactoryContract

    return this._FollowFactoryContract = createContract<FollowFactory>(
      this._chainAddresses.capitalFactory,
      followFactory_ABI,
      this.signer,
    )
  }

  /**
   * 还款池
   *
   * @param {bigint} tradeId
   * @return {*}
   * @memberof BrowserContractService
   */
  async getRefundPoolContract(tradeId: bigint) {
    const refundFactoryContract = await this.getRefundFactoryContract()

    const cp = await this.getCapitalPoolAddress(tradeId)

    const refundPoolAddress = await refundFactoryContract.getRefundPool(cp)

    if (!refundPoolAddress) {
      message.error(`refund pool address is undefined: ${refundPoolAddress}`)
      throw new Error(`refund pool address is undefined: ${refundPoolAddress}`)
    }

    // if (LocalEnv) {
    //   return this._refundPoolContract = createContract<LocalContractType<typeof LocalEnv, LocalRefundPool>>(
    //     refundPoolAddress,
    //     LocalRefundPool_ABI,
    //     this.signer,
    //   )
    // }

    this._refundPoolContract = createContract<LocalContractType<typeof LocalEnv, FollowRefundPool>>(
      refundPoolAddress,
      followRefundPool_ABI,
      this.signer,
    )

    // if (LocalEnv) {
    //   const followManageContract = await this.getFollowManageContract()
    //   const res = await this._refundPoolContract.testSet(import.meta.env.VITE_TOKEN_USDC, await followManageContract.getAddress())
    //   console.log('%c [ testSet ]-320', 'font-size:13px; background:#4ad8b6; color:#8efffa;', res)
    //   await res?.wait()
    // }

    return this._refundPoolContract
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
      this._chainAddresses.refundFactory,
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
      this._chainAddresses.processCenter,
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

    // return new Contract(import.meta.env.VITE_CORE_MANAGE, followManage_ABI, provider) as unknown as FollowManage

    return this._followManageContract = createContract<FollowManage>(
      this._chainAddresses.manage,
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
      this._chainAddresses.shares,
      ERC3525_ABI,
      this.signer,
    )
  }

  /**
   * ERC1155
   *
   * @return {*}  {Promise<ERC3525>}
   * @memberof BrowserContractService
   */
  async getERC1155Contract() {
    return createContract<FollowFiERC1155>(
      this._chainAddresses.nft,
      ERC1155_ABI,
      this.signer,
    )
  }

  /**
   * ERC20 $FOF
   *
   * @return {*}  {Promise<ERC3525>}
   * @memberof BrowserContractService
   */
  async getERC20FOFContract() {
    return createContract<ERC20>(
      this._chainAddresses.fof,
      ERC20_ABI,
      this.signer,
    )
  }

  /**
   * Faucet
   */
  async getFaucetContract(): Promise<FollowFaucet> {
    if (this._faucetContract)
      return this._faucetContract

    return this._faucetContract = createContract<FollowFaucet>(
      this._chainAddresses.faucet,
      FollowFaucet_ABI,
      this.signer,
    )
  }

  /**
   * 获取token标志位
   *
   * @param {string} token
   * @return {*}  {Promise<bigint>}
   * @memberof BrowserContractService
   */
  async ERC20_decimals(token: string): Promise<bigint> {
    const contract = await this.getERC20Contract(token)
    return contract.decimals()
  }

  /**
   * 检查授权额度 tokenId下的_operator
   *
   * @param {bigint} tokenId ERC3525的tokenID
   * @param {string} operator 被授予花费的地址kenId下的份数
   * @return {*}
   * @memberof BrowserContractService
   */
  async ERC3525_allowance(tokenId: bigint, operator: string) {
    const c = await this.getERC3525Contract()

    return c.allowance(tokenId, operator)
  }

  /**
   * 授权tokenId下的数量到_operator
   *
   * @param {bigint} tokenId ERC3525的tokenID
   * @param {string} operator 被授予花费的地址
   * @param {bigint} value tokenId下的份数
   * @return {*}
   * @memberof BrowserContractService
   */
  async ERC3525_approve(tokenId: bigint, operator: string, value: bigint) {
    const c = await this.getERC3525Contract()

    return c.approveValue(tokenId, operator, value)
  }

  /**
   * 获取到tokenId下的ERC3525数量(份额)
   *
   * @param {bigint} tradeId
   * @return {*}
   * @memberof BrowserContractService
   */
  async ERC3525_balanceOf(tradeId: bigint): Promise<bigint> {
    const c = await this.getERC3525Contract()

    console.log('%c [ tradeId ]-457', 'font-size:13px; background:#de9093; color:#ffd4d7;', tradeId)
    const tokenId = await c.getPersonalSlotToTokenId(this.getSigner.address, tradeId)

    if (tokenId === BigInt(0)) {
      message.error(`ERC3525 is not owned: ${tokenId}`)
      throw new Error(`ERC3525 is not owned: ${tokenId}`)
    }

    return c.tokenIdBalanceOf(tokenId)
  }

  /**
   * 根据订单查询tokenId
   *
   * @param {bigint} tradeId
   * @return {*}
   * @memberof BrowserContractService
   */
  async ERC3525_getTokenId(tradeId: bigint) {
    const c = await this.getERC3525Contract()

    return c.getPersonalSlotToTokenId(this.getSigner.address, tradeId)
  }

  /**
   * 得到ERC3525的持有人分红收益
   *
   * @param {bigint} tradeId
   * @return {*}
   * @memberof BrowserContractService
   */
  async getShareProfit(tradeId: bigint) {
    const tokenId = await this.ERC3525_getTokenId(tradeId)

    if (!tokenId)
      throw new Error(`tokenId is undefined: ${tokenId}`)

    const c = await this.getProcessCenterContract()

    return c.getShareProfit(tokenId)
  }

  /**
   * 检查订单是否可再次创建
   *
   * @return {*}  {Promise<boolean>}
   * @memberof BrowserContractService
   */
  async checkOrderCanCreateAgain(): Promise<boolean> {
    // const followFactoryContract = await this.getFollowFactoryContract()

    // const cp = await followFactoryContract?.AddressGetCapitalPool(this.getSigner.address)

    // if (cp === BLACK_HOLE_ADDRESS)
    //   return true

    const followFactoryContract = await this.getFollowFactoryContract()

    console.log('%c [ followFactoryContract ]-528', 'font-size:13px; background:#62793f; color:#a6bd83;', followFactoryContract)

    const state = await followFactoryContract.getIfCreate(this.getSigner.address)

    console.log('%c [ state ]-530', 'font-size:13px; background:#e42355; color:#ff6799;', state)

    if (state === BigInt(0))
      return true

    const processCenterContract = await this.getProcessCenterContract()

    // const cp = await processCenterContract?._userToCatpitalPool(this.getSigner.address)

    // if (cp === BLACK_HOLE_ADDRESS)
    //   return true

    return processCenterContract?.getIfAgainCreateOrder(this.getSigner.address)
  }

  /**
   * 得到当前资金池的订单创建状态(用于判断用户当前是否可以再创建订单)
   *
   * @return {*}  {Promise<boolean>} false可重新创建订单
   * @memberof BrowserContractService
   */
  async getOrderCreateState(): Promise<boolean> {
    const followFactoryContract = await this.getFollowFactoryContract()

    const cp = await followFactoryContract?.AddressGetCapitalPool(this.getSigner.address)

    if (cp === BLACK_HOLE_ADDRESS)
      return false

    const contract = await this.getProcessCenterContract()
    return contract.getOrderCreateState(cp)
  }

  /**
   * 检查资金池和还款池的创建
   *
   * @param {FollowRouter} [contract]
   * @return {*}  {Promise<[boolean, boolean]>}
   * @memberof BrowserContractService
   */
  async checkPoolCreateState(contract?: FollowRouter): Promise<[capitalPoolState: boolean, refundPoolState: boolean]> {
    const followRouterContract = contract ?? (await this.getFollowRouterContract())

    const capitalPoolState = await followRouterContract.getCreateCapitalState(this.getSigner.address)

    if (!capitalPoolState)
      return [capitalPoolState, false]

    // const cp = await this.getCapitalPoolAddress()

    const refundPoolState = await followRouterContract.getCreateRefundState(this.getSigner.address)

    return [capitalPoolState, refundPoolState]
  }

  // async checkOrderStateIsCreateAgain() {

  // }

  /**
   * 检查最新订单的状态
   *
   * @memberof BrowserContractService
   */
  // async checkLatestOrderInProgress(): Promise<boolean> {
  //   const followFactoryContract = await this.getFollowFactoryContract()

  //   const cp = await followFactoryContract?.AddressGetCapitalPool(this.getSigner.address)
  //   if (cp === BLACK_HOLE_ADDRESS)
  //     return true

  //   const followManageContract = await this.getFollowManageContract()

  //   const tids = await followManageContract.getCapitalPoolAllOradeId(cp)
  //   const currenTid = tids.at(-1)

  //   if (currenTid && currenTid >= BigInt(0)) {
  //     const processCenterContract = await this.getProcessCenterContract()

  //     const status = await processCenterContract.getOrderState(currenTid)

  //     if (status === BigInt(7) || status === BigInt(8)) {
  //       return true
  //     }
  //     else {
  //       message.error(`Existing order, status is : ${status}`)
  //       return false
  //     }
  //   }
  //   else {
  //     return true
  //   }
  // }

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

  //

  /**
   * getList
   *
   * @param {bigint} tradeId
   * @memberof BrowserContractService
   */
  async capitalPool_getList(tradeId: bigint) {
    if (import.meta.env.DEV) {
      const cp = await this.getCapitalPoolAddress(tradeId)

      const c = await this.getCapitalPoolContract(cp)

      if (tradeId) {
        const list = await c.getList(tradeId)
        console.log('%c [ list ]-183', 'font-size:13px; background:#bb6424; color:#ffa868;', list)
      }
    }
  }

  /**
   * 获取HIndex
   *
   * @return {*}
   * @memberof BrowserContractService
   */
  async getHIndex() {
    const followManageContract = await this.getFollowManageContract()

    const handles = await followManageContract.getAllAllowHandle()

    const c = await this.getFollowHandleContract()
    const a = await c.getAddress()

    return handles.findIndex(handle => handle === a)
  }

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
   *  授权TimeMarket合约
   *  @param {bigint} tradeId ERC3525的tokenId
   */
  async followMarketContract_approveERC3525(tradeId: bigint, amount: bigint) {
    console.log(tradeId.toString(), amount.toString())

    const tid = await this.ERC3525_getTokenId(tradeId)
    if (!tid)
      throw new Error(`tokenId is undefined: ${tid}`)

    const marketContract = await this.getFollowMarketContract()

    const allowance = await this.ERC3525_allowance(tid, await marketContract.getAddress())

    console.log(allowance)

    if (BigNumber(allowance.toString()).lt(BigNumber(amount.toString()))) {
      console.log('need approve')
      const approveRes = await this.ERC3525_approve(tid, await marketContract.getAddress(), amount)
      await approveRes.wait()
      const res = await handleTransaction(approveRes)
      if (res?.status === 1) {
        return Promise.resolve(true)
      }
      else {
        message.error('Transaction Failed!')
        throw new Error('Transaction Failed!')
      }
    }
    return Promise.resolve(true)
  }

  /**
   * 卖出质押ERC3525（需要授权TimeMarket合约）
   *
   * @param {bigint} tradeId ERC3525的tokenId
   * @param {bigint} price 出售价格
   * @param {bigint} amount 出售数量
   * @return {*}
   * @memberof BrowserContractService
   */
  async followMarketContract_saleERC3525(tradeId: bigint, price: bigint, amount: bigint) {
    const tid = await this.ERC3525_getTokenId(tradeId)

    if (!tid)
      throw new Error(`TokenId is undefined: ${tid}`)

    // TODO: allowance 检查授权
    const marketContract = await this.getFollowMarketContract()

    // const approveRes = await this.ERC3525_approve(tid, await marketContract.getAddress(), amount)

    // await approveRes.wait()

    console.log('%c [ tid, price, amount ]-616', 'font-size:13px; background:#8d01d2; color:#d145ff;', tid, price, amount)

    const decimals = await this.ERC20_decimals(this._chainAddresses.USDC)
    console.log('%c [ decimals ]-630', 'font-size:13px; background:#7c3b4e; color:#c07f92;', decimals)

    const wei = ethers.parseUnits(String(price), decimals)
    // const wei = BigInt(BigNumber(String(price)).times(BigNumber(10).pow(String(decimals))).toString())

    console.log('%c [ wei ]-632', 'font-size:13px; background:#2c6ca4; color:#70b0e8;', wei)

    // TODO price * 标志位
    const res = await marketContract.saleERC3525(tid, wei, amount)

    console.log('%c [ saleERC3525 ]-637', 'font-size:13px; background:#d26b9f; color:#ffafe3;', res)

    return handleTransaction(res)
  }

  /**
   * 购买ERC3525（需要授权TimeMarket合约）
   *
   * @param {bigint} marketId
   * @param {bigint} tradeId
   * @param {bigint} amount
   * @return {*}
   * @memberof BrowserContractService
   */
  async followMarketContract_buyERC3525(marketId: bigint, amount: bigint) {
    console.log('%c [ marketId ]-654', 'font-size:13px; background:#8e6612; color:#d2aa56;', marketId)
    const marketContract = await this.getFollowMarketContract(marketId)

    const state = await this.ERC20_approve(this._chainAddresses.USDC, await marketContract.getAddress(), amount)

    if (!state)
      throw new Error(' approval failed ')

    const res = await marketContract.buyERC3525(marketId)
    return handleTransaction(res)
  }

  /**
   * 取消挂单
   *
   * @param {bigint} marketId
   * @return {*}
   * @memberof BrowserContractService
   */
  async followMarketContract_cancelOrder(marketId: bigint) {
    const marketContract = await this.getFollowMarketContract(marketId)
    const res = await marketContract.cancelOrder(marketId)
    return handleTransaction(res)
  }

  /**
   * 资金池授权 true为已授权
   * owner（代币所有者的地址）和 spender（被授权地址的地址）
   *
   * @param {bigint} tradeId
   * @return {*}  {Promise<boolean>}
   * @memberof BrowserContractService
   */
  async ERC20_capitalPool_approve(tradeId: bigint): Promise<boolean> {
    const ERC20Contract = await this?.getERC20Contract()

    const followManageContract = await this?.getFollowManageContract()

    const cp = await followManageContract?.getTradeIdToCapitalPool(BigInt(tradeId))
    console.log('%c [approve cp ]-817', 'font-size:13px; background:#c57017; color:#ffb45b;', cp)

    if (!cp)
      return false
    // TODO
    const allowance = await ERC20Contract?.allowance(this?.getSigner.address, cp)
    console.log('%c [ capitalPool_approve ]-418', 'font-size:13px; background:#3174f1; color:#75b8ff;', allowance)

    if ((allowance ?? BigInt(0)) <= BigInt(0)) {
      const approveRes = await ERC20Contract?.approve(cp, BigInt(200 * 10 ** 6) * BigInt(10 ** 18))
      if (!approveRes)
        return false

      const approveResult = await approveRes?.wait()

      if (approveResult?.status !== 1)
        return false
    }

    return true
  }

  /**
   * 还款池授权
   *
   * @param {bigint} tradeId
   * @return {*}  {Promise<boolean>}
   * @memberof BrowserContractService
   */
  async ERC20_refundPool_approve(tradeId: bigint): Promise<boolean> {
    const ERC20Contract = await this?.getERC20Contract()

    const refundPoolAddress = await this.getRefundPoolAddress(tradeId)
    console.log('%c [ refundPoolAddress ]-475', 'font-size:13px; background:#538b57; color:#97cf9b;', refundPoolAddress)

    if (!refundPoolAddress)
      return false

    const allowance = await ERC20Contract?.allowance(this?.getSigner.address, refundPoolAddress)
    console.log('%c [ allowance ]-475', 'font-size:13px; background:#570fae; color:#9b53f2;', allowance)

    if ((allowance ?? BigInt(0)) <= BigInt(0)) {
      const approveRes = await ERC20Contract?.approve(refundPoolAddress, ethers.parseEther(BigNumber(2 * 10 ** 6).toString()))
      // const allowance = await ERC20Contract?.allowance(refundPoolAddress, this?.getSigner.address)
      // console.log('%c [asa allowance ]-418', 'font-size:13px; background:#3174f1; color:#75b8ff;', allowance)
      if (!approveRes)
        return false

      const approveResult = await approveRes?.wait()
      console.log('%c [ approveResult ]-490', 'font-size:13px; background:#a8dd6c; color:#ecffb0;', approveResult)

      if (approveResult?.status !== 1)
        return false
    }

    return true
  }

  /**
   * 授权
   *
   * @param {bigint} tradeId
   * @param {bigint} copies
   * @param {string} token
   * @param {string} spender
   * @return {*}  {Promise<boolean>}
   * @memberof BrowserContractService
   */
  async processCenter_checkERC20Allowance(tradeId: bigint, copies: bigint, token: string, spender: string): Promise<boolean> {
    const processContract = await this.getProcessCenterContract()

    const checkAmount = await processContract.getLendStakeMoney(tradeId, copies)

    const approveState = await processContract.checkERC20Allowance(token, this.getSigner.address, spender, checkAmount)

    if (!approveState) {
      const ERC20Contract = await this?.getERC20Contract(token)

      const approveRes = await ERC20Contract?.approve(spender, ethers.parseEther(BigNumber(2 * 10 ** 6).toString()))
      if (!approveRes)
        return false

      const approveResult = await approveRes?.wait()
      console.log('%c [ approveResult ]-490', 'font-size:13px; background:#a8dd6c; color:#ecffb0;', approveResult)

      if (approveResult?.status !== 1)
        return false
    }

    return true
  }

  /**
   * ERC20授权 为真已授权
   *
   * @param {(string | undefined)} [spender] 授权者
   * @param {string} [grantee] 被授权者
   * @param {bigint} [amount] 授权数量
   * @return {*}  {Promise<boolean>}
   * @memberof BrowserContractService
   */
  async ERC20_approve(spender: string, grantee: string, amount: bigint): Promise<boolean> {
    const ERC20Contract = await this?.getERC20Contract(spender)

    const allowance = await ERC20Contract?.allowance(this.getSigner.address, grantee)

    console.log('%c [111 allowance amount]-782', 'font-size:13px; background:#8d2f8a; color:#d173ce;', allowance, amount)

    if ((allowance ?? BigInt(0)) < (amount ?? BigInt(0))) {
      const approveRes = await ERC20Contract?.approve(grantee, ethers.parseEther(BigNumber(2 * 10 ** 6).toString()))
      if (!approveRes)
        return false

      const approveResult = await approveRes?.wait()
      console.log('%c [ approveResult ]-490', 'font-size:13px; background:#a8dd6c; color:#ecffb0;', approveResult)

      if (approveResult?.status !== 1)
        return false
    }

    return true
  }

  /**
   * 铸币
   *
   * @param {string} token
   * @return {*}
   * @memberof BrowserContractService
   */
  async ERC20_mint(token: string) {
    try {
      const contract = await this.getERC20Contract(token)
      const res = await contract?.doMint()
      return handleTransaction(res)
    }
    catch (error) {
      console.log('%c [ error ]-951', 'font-size:13px; background:#0db197; color:#51f5db;', error)
    }
  }

  /**
   * 创建资金池和还款池
   *
   * @return {*}
   * @memberof BrowserContractService
   */
  async followRouter_createPool() {
    const followRouterContract = await this.getFollowRouterContract()
    const res = await followRouterContract.createPool(this.getSigner.address)
    res?.wait()
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
    const followRouterContract = await this.getFollowRouterContract()

    const transaction = await followRouterContract?.borrowerCreateOrder(
      {
        _timePeriod: BigInt(model.cycle),
        _repayTimes: BigInt(model.period!),
        _interestRate: BigInt(BigNumber(model.interest!).times(100).toString()),
        _shareRate: BigInt(BigNumber(model.dividend ?? 0).times(100).toString()),
        _goalShareCount: BigInt(model.numberOfCopies),
        _minShareCount: BigInt(model.minimumRequiredCopies ?? 0),
        _collectEndTime: BigInt(model.raisingTime!) * BigInt(86400), // TODO 秒数
        _goalMoney: BigInt(model.applyLoan!) * BigInt(10 ** 18), // TODO: decimals token标志位
        uri: model.imageUrl!,
        name: model.itemTitle!,
      },
    )

    const result = await handleTransaction(transaction)

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

  async calculateFollowAmountFromCopies(tradeId: bigint, copies: bigint) {
    const processContract = await this.getProcessCenterContract()
    const checkAmount = await processContract.getLendStakeMoney(tradeId, copies)
    return checkAmount
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
    const followRouterContract = await this.getFollowRouterContract()

    // const approveState = await this.processCenter_checkERC20Allowance(BigInt(tradeId), BigInt(copies), import.meta.env.VITE_TOKEN_USDC, await followRouterContract.getAddress())

    // if (!approveState)
    // throw new Error('Authorization failed')

    const transaction = await followRouterContract.lendMoney(tradeId, copies)

    console.log('transaction', transaction)

    return handleTransaction(transaction, 'Transaction Successful', 'Transaction Failed. Please try again.')
  }

  /**
   * 退款
   */
  async followRouter_refund(tradeId: bigint) {
    const contract = await this.getFollowRouterContract()

    const res = await contract.refundMoney(tradeId)

    return handleTransaction(res)
  }

  /**
   * 贷款人退款
   * 未达成目标,贷款人取回token
   *
   * @param {bigint} tradeId 未完成筹款目标的最小份数的已创建订单id
   * @return {*}
   * @memberof BrowserContractService
   */
  // async capitalPool_refund(tradeId: bigint): Promise<ethers.ContractTransactionReceipt | undefined> {
  //   const capitalPoolAddress = await this.getCapitalPoolAddress(tradeId)

  //   if (!capitalPoolAddress) {
  //     message.error('Capital pool address is undefined')
  //     throw new Error('Capital pool address is undefined')
  //   }

  //   const capitalPoolContract = await this.getCapitalPoolContract(capitalPoolAddress)
  //   const transaction = await capitalPoolContract?.refund(tradeId)

  //   return handleTransaction(transaction, 'Transaction Successful', 'Transaction Failed. Please try again.')
  // }

  /**
   * @deprecated
   * 资金池授权handle
   *
   * @param {bigint} tradeId
   * @param {string} token token为已被允许的token组任何一个包括USDC
   * @param {string} handleAddress handleAddress handle合约地址
   * @memberof BrowserContractService
   */
  async capitalPool_approveHandle(tradeId: bigint, token: string, spender: string, amount: bigint) {
    const capitalPoolAddress = await this.getCapitalPoolAddress(tradeId)

    const capitalPoolContract = await this.getCapitalPoolContract(capitalPoolAddress)

    const processCenterContract = await this.getProcessCenterContract()

    const approveState = await processCenterContract.checkERC20Allowance(token, capitalPoolAddress, spender, amount)
    if (!approveState) {
      const index = tokenList.findIndex(t => t.address === token)
      const hIndex = await this.getHIndex()

      const transaction = await capitalPoolContract?.approveHandle(BigInt(index), BigInt(hIndex), amount)
      const res = await handleTransaction(transaction)
      return res?.status === 1
    }
    return true
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
  async capitalPool_multiLiquidate(tradeId: bigint) {
    const capitalPoolAddress = await this.getCapitalPoolAddress(tradeId)

    const capitalPoolContract = await this.getCapitalPoolContract(capitalPoolAddress)

    const transaction = await capitalPoolContract?.multiLiquidate(tradeId, BigInt(3000))

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
  // async capitalPool_clearingMoney(token: string, tradeId: bigint, fee: bigint = BigInt(3000), amount: bigint = BigInt(100)) {
  //   const cp = await this.getCapitalPoolAddress(tradeId)

  //   if (!cp) {
  //     message.error('capital pool address is undefined')
  //     Promise.reject(new Error('capital pool address is undefined'))
  //   }

  //   const capitalPoolContract = await this.getCapitalPoolContract(cp)

  //   const transaction = await capitalPoolContract?.clearingMoney(token, tradeId, fee)

  //   return handleTransaction(transaction)
  // }

  /**
   * 一次性还款清算(如果借款人不主动触发清算，任何人都可以触发该函数进行清算)
   * 在达到最小份数，并且结束后才可触发
   *
   * @param {bigint} tradeId 已创建的达成最小份数的订单id
   * @return {*}
   * @memberof BrowserContractService
   */
  async capitalPool_singleLiquidate(tradeId: bigint) {
    const cp = await this.getCapitalPoolAddress(tradeId)

    const capitalPoolContract = await this.getCapitalPoolContract(cp)

    const getList = await capitalPoolContract?.getList(tradeId)
    console.log('%c [ getList ]-381', 'font-size:13px; background:#5511ee; color:#9955ff;', getList)

    const transaction = await capitalPoolContract?.singleLiquidate(tradeId, BigInt(3000))

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
  async followRouter_doRepay(tradeId: bigint) {
    const approve = await this.ERC20_capitalPool_approve(tradeId)

    console.log('%c [ approve ]-1197', 'font-size:13px; background:#751462; color:#b958a6;', approve)

    if (!approve) {
      message.error('approve is error')
      throw new Error('approve is error')
    }

    const followRouterContract = await this.getFollowRouterContract()

    const transaction = await followRouterContract.doRepay(tradeId)

    return handleTransaction(transaction)

    // const cp = await this.getCapitalPoolAddress(tradeId)

    // const capitalPoolContract = await this.getCapitalPoolContract(cp)

    // // const getList = await capitalPoolContract?.getList(tradeId)

    // const transaction = await capitalPoolContract?.repay(tradeId)

    // return handleTransaction(transaction)
  }

  async testLiquidity_calculateSwapRatio(swapToken: string, fee = BigInt(3000)): Promise<string> {
    const contract = await this.getTestLiquidityContract()

    const price = await contract?.getTokenPrice(
      this._chainAddresses.USDC,
      swapToken,
      fee,
      ethers.parseEther(String(1)),
    )
    // console.log('%c [ price ]-1227', 'font-size:13px; background:#f1ca51; color:#ffff95;', price)

    const ratio = BigNumber(ethers.formatUnits(price ?? 0)).toFixed(18)
    // console.log('%c [ ratio ]-1235', 'font-size:13px; background:#cea8a4; color:#ffece8;', ratio)

    return ratio
  }

  /**
   *
   * @param {bigint} tradeId
   * @param {string} token
   * @param {string} spender
   * @param {bigint} amount
   * @param {bigint} tokenIndex
   * @return {*}
   * @memberof BrowserContractService
   */
  // async capitalPool_newApproveHandle(tradeId: bigint, token: string, spender: string, amount: bigint, tokenIndex: bigint) {
  //   const capitalPoolAddress = await this.getCapitalPoolAddress(tradeId)

  //   const capitalPoolContract = await this.getCapitalPoolContract(capitalPoolAddress)

  //   const processCenterContract = await this.getProcessCenterContract()

  //   const approveState = await processCenterContract.checkERC20Allowance(token, capitalPoolAddress, spender, amount)
  //   if (!approveState) {
  //     const followManageContract = await this.getFollowManageContract()

  //     const handles = await followManageContract.getAllAllowHandle()

  //     const hIndex = await handles.findIndex(handle => handle === spender)
  //     console.log('%c [ hIndex ]-1136', 'font-size:13px; background:#b42fbb; color:#f873ff;', hIndex)

  //     const transaction = await capitalPoolContract?.approveHandle(tokenIndex, BigInt(hIndex))
  //     const res = await handleTransaction(transaction)
  //     return res?.status === 1
  //   }
  //   return true
  // }

  async followRouter_doV3Swap(tradeId: bigint, swapToken: string, buyOrSell: bigint, amount: bigint, fee: bigint = BigInt(3000)) {
    const followRouterContract = await this.getFollowRouterContract()

    const tIndex = tokenList.findIndex(e => e.address === swapToken)

    const hIndex = await this.getHIndex()

    const res = await followRouterContract.doV3Swap(tradeId, BigInt(tIndex), hIndex, buyOrSell, amount, fee)
    console.log('%c [ tradeId, BigInt(tIndex), hIndex, buyOrSell, amount, fee ]-1281', 'font-size:13px; background:#b5288d; color:#f96cd1;', tradeId, BigInt(tIndex), hIndex, buyOrSell, amount, fee)
    return handleTransaction(res)
  }

  async followFaucetClaim(token_address: string) {
    const faucetContract = await this.getFaucetContract()
    const res = await faucetContract?.faucet(token_address)
    return handleTransaction(res)
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
  // async followHandle_swapERC20(tradeId: bigint, swapToken: string, buyOrSell: bigint, amount: bigint, fee: bigint = BigInt(3000)) {
  //   const contract = await this.getFollowHandleContract()

  //   // const res = await this.capitalPool_approveHandle(tradeId, buyOrSell === BigInt(1) ? swapToken : import.meta.env.VITE_TOKEN_USDC, await contract.getAddress(), amount)
  //   const res = await this.capitalPool_newApproveHandle(tradeId, buyOrSell === BigInt(1) ? swapToken : import.meta.env.VITE_TOKEN_USDC, await contract.getAddress(), amount, buyOrSell)

  //   if (!res) {
  //     message.error('approveHandle is error')
  //     throw new Error('approveHandle is error')
  //   }

  //   // const cp = await this.getCapitalPoolAddress(tradeId)

  //   const transaction = await contract.swapERC20(tradeId, swapToken, buyOrSell, amount, fee)

  //   return handleTransaction(transaction)
  // }

  /**
   * 贷款人提取最后清算的资金+还款资金+分红资金(订单结束时间10天后才可提取) 非订单发起人
   *
   * @param {bigint} tradeId
   * @param {bigint} value 份数（全部）
   * @return {*}
   * @memberof BrowserContractService
   */
  async refundPool_lenderWithdraw(tradeId: bigint, value: bigint) {
    this.capitalPool_getList(tradeId)

    const refundPoolContract = await this.getRefundPoolContract(tradeId)

    const ERC3525Contract = await this.getERC3525Contract()

    console.log('%c [ this.getSigner.address, tradeId ]-868', 'font-size:13px; background:#ef6ffe; color:#ffb3ff;', this.getSigner.address, tradeId)
    const tokenId = await ERC3525Contract.getPersonalSlotToTokenId(this.getSigner.address, tradeId)
    console.log('%c [ tokenId ]-847', 'font-size:13px; background:#ce01db; color:#ff45ff;', tokenId)

    // const tokenIds = await this.ERC3525_getPersonalMes()
    // console.log('%c [ tokenIds ]-845', 'font-size:13px; background:#976c4f; color:#dbb093;', tokenIds)

    // const tokenId = tokenIds.at(-1)

    if (!tokenId) {
      message.error(`refund pool tokenId is ${tokenId}`)
      throw new Error(`refund pool tokenId is ${tokenId}`)
    }

    // TODO 提取授权
    // const res = await ERC3525Contract.approveValue(tokenId, await refundPoolContract.getAddress(), value)
    // console.log('%c [  ERC3525Contractres approve ]-882', 'font-size:13px; background:#235bbc; color:#679fff;', res)

    // const result = await handleTransaction(res)

    // if (result?.status !== 1)
    //   throw new Error('approve is error')

    const transaction = await refundPoolContract.lenderWithdraw(tokenId) // tokenId用户持有的ERC3525的tokenId

    return handleTransaction(transaction)
  }

  /**
   * 借款人提取 订单发起人
   *
   * @param {bigint} tradeId 借款人发起的订单id，即对应槽值
   * @return {*}
   * @memberof BrowserContractService
   */
  async refundPool_borrowerWithdraw(tradeId: bigint) {
    this.capitalPool_getList(tradeId)

    const refundPoolContract = await this.getRefundPoolContract(tradeId)
    console.log('%c [ refundPoolContract ]-906', 'font-size:13px; background:#30d60a; color:#74ff4e;', refundPoolContract)

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
  // async refundPool_supply(amount: bigint, tradeId: bigint) {
  //   const approve = await this.ERC20_refundPool_approve(tradeId)

  //   if (!approve) {
  //     message.error('approve is error')
  //     throw new Error('approve is error')
  //   }

  //   const refundPoolContract = await this.getRefundPoolContract(tradeId)

  //   if (LocalEnv) {
  //     const fmc = await this.getFollowManageContract()

  //     const fmce = await refundPoolContract.testSet(import.meta.env.VITE_TOKEN_USDC, await fmc.getAddress())
  //     console.log('%c [ fmce ]-844', 'font-size:13px; background:#c4d0d6; color:#ffffff;', fmce)
  //     handleTransaction(fmce)
  //   }

  //   console.log('%c [ tradeId ]-828', 'font-size:13px; background:#50e35d; color:#94ffa1;', tradeId)
  //   console.log('%c [ amount ]-828', 'font-size:13px; background:#ba17aa; color:#fe5bee;', amount)
  //   const transaction = await refundPoolContract.supply(amount, tradeId)

  //   return handleTransaction(transaction)
  // }

  /**
   *  退款
   */
  async followRouter_refundMoney(tradeId: bigint) {
    const contract = await this.getFollowRouterContract()
    const res = await contract.refundMoney(tradeId)
    return handleTransaction(res)
  }

  /**
   * 供应
   *
   * @param {bigint} amount
   * @param {bigint} tradeId
   * @return {*}
   * @memberof BrowserContractService
   */
  async processCenter_supply(amount: bigint, tradeId: bigint) {
    const processCenterContract = await this.getProcessCenterContract()

    const processCenterAddress = await processCenterContract.getAddress()

    const approve = await this.ERC20_approve(this._chainAddresses.USDC, processCenterAddress, amount)

    if (!approve) {
      message.error('approve is error')
      throw new Error('approve is error')
    }

    const transaction = await processCenterContract.supply(this._chainAddresses.USDC, amount, tradeId)
    return handleTransaction(transaction)
  }

  /**
   * ERC20
   */
  async getFofBalance() {
    const fofContract = await this.getERC20FOFContract()
    const balance = await fofContract.balanceOf(this.signer)
    return balance
  }

  /**
   * ERC1155
   */
  async getNftBalance() {
    const fofContract = await this.getERC1155Contract()
    const balanceOfOctopus = await fofContract.balanceOf(this.signer, 0)
    const balanceOfDolphin = await fofContract.balanceOf(this.signer, 1)
    const balanceOfShark = await fofContract.balanceOf(this.signer, 2)
    const balanceOfWhale = await fofContract.balanceOf(this.signer, 3)
    return [balanceOfOctopus, balanceOfDolphin, balanceOfShark, balanceOfWhale]
    // return [0n, 0n, 0n, 0n]
  }

  /**
   * ERC1155 whitelist
   */
  async checkWhitelist(id: number) {
    const erc1155Contract = await this.getERC1155Contract()
    const whitelist = await erc1155Contract.getIfWhitelist(this.signer, id)
    return whitelist
  }

  /**
   * approve $fof for ERC1155
   */
  async approveFofForERC1155(amount: bigint) {
    const erc1155Contract = await this.getERC1155Contract()
    const fofContract = await this.getERC20FOFContract()
    const res = await fofContract.approve(erc1155Contract.getAddress(), amount)
    return handleTransaction(res)
  }

  /**
   * do mint nft
   */
  async mintNft(id: bigint) {
    const erc1155Contract = await this.getERC1155Contract()
    const res = await erc1155Contract.doMint(id, 1)
    return handleTransaction(res)
  }

  async checkClaimableFofAmount(id: number) {
    const routerContract = await this.getFollowRouterContract()
    const result = await routerContract.getUserEarnTokenAmount(id)
    return result
  }

  async claimFof(id: number) {
    const routerContract = await this.getFollowRouterContract()
    const res = await routerContract.claimToken(id)
    return handleTransaction(res)
  }

  async approveBeforeFollow(amount: bigint) {
    const routerContract = await this.getFollowRouterContract()

    const ERC20Contract = await this?.getERC20Contract(this._chainAddresses.USDC)

    const approveRes = await ERC20Contract?.approve(routerContract.getAddress(), amount)

    return handleTransaction(approveRes)
  }

  async checkUsdcAllowance() {
    const routerContract = await this.getFollowRouterContract()

    const ERC20Contract = await this?.getERC20Contract(this._chainAddresses.USDC)

    const allowance = await ERC20Contract?.allowance(this.signer, routerContract.getAddress())

    return allowance
  }

  async checkWithdrawed(id: number) {
    const routerContract = await this.getFollowRouterContract()
    const result = await routerContract.getUserIfWithdraw(id)
    return result
  }
}
