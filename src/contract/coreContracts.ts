import { Contract, ZeroAddress, ethers } from 'ethers'
import { message, notification } from 'antd'
import BigNumber from 'bignumber.js'
import type {
  ERC20,
  UniswapV3,
  FollowFactory as capitalFactory,
  FollowCapitalPool as capitalPool,
  FollowFaucet as faucet,
  FollowHandle as handle,
  FollowManage as manage,
  FollowMarket as market,
  FollowFiERC1155 as ERC1155,
  ProcessCenter as processCenter,
  FollowRefundFactory as refundFactory,
  FollowRefundPool as refundPool,
  FollowRouter as router,
  ERC3525 as shares,
} from '@/abis/types'
import capitalFactoryABI from '@/abis/FollowFactory.json'
import refundFactoryABI from '@/abis/FollowRefundFactory.json'
import capitalPoolABI from '@/abis/FollowCapitalPool.json'
import refundPoolABI from '@/abis/FollowRefundPool.json'
import processCenterABI from '@/abis/ProcessCenter.json'
import manageABI from '@/abis/FollowManage.json'
import marketABI from '@/abis/FollowMarket.json'
import routerABI from '@/abis/FollowRouter.json'
import faucetABI from '@/abis/FollowFaucet.json'
import handleABI from '@/abis/FollowHandle.json'

// import LocalERC20_ABI from '@/abis/LocalERC20.json'
import TEST_LIQUIDITY_ABI from '@/abis/UniswapV3.json'
import ERC3525_ABI from '@/abis/ERC3525.json'
import ERC20_ABI from '@/abis/ERC20.json'
import ERC1155_ABI from '@/abis/FollowFiERC1155.json'
import { Models } from '@/.generated/api/models'
import type { LoanRequisitionEditModel } from '@/models/LoanRequisitionEditModel'
import { LoanService } from '@/.generated/api/Loan'
import { tokenList } from '@/contract/tradingPairTokenMap'
import { Errors } from '@/errors/errors'
import { MessageError } from '@/enums/error'

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

export class CoreContracts {
  constructor(private _signer: ethers.JsonRpcSigner) {
    this._capitalFactoryContract = createContract(import.meta.env.VITE_CORE_CAPITAL_FACTORY, capitalFactoryABI, this.signer)
    this._refundFactoryContract = createContract(import.meta.env.VITE_CORE_REFUND_FACTORY, refundFactoryABI, this.signer)
    this._processCenterContract = createContract(import.meta.env.VITE_VITE_CORE_PROCESS_CENTER, processCenterABI, this.signer)
    this._manageContract = createContract(import.meta.env.VITE_CORE_MANAGE, manageABI, this.signer)
    this._marketContract = createContract(import.meta.env.VITE_CORE_MARKET, marketABI, this.signer)
    this._routerContract = createContract(import.meta.env.VITE_CORE_ROUTER, routerABI, this.signer)
    this._handleContract = createContract(import.meta.env.VITE_CORE_HANDLE, handleABI, this.signer)
    this._sharesContract = createContract(import.meta.env.VITE_CORE_SHARES, ERC3525_ABI, this.signer)
    this._fofContract = createContract(import.meta.env.VITE_CORE_FOF, ERC20_ABI, this.signer)
    this._usdcContract = createContract(import.meta.env.VITE_TOKEN_USDC, ERC20_ABI, this.signer)
    this._nftContract = createContract(import.meta.env.VITE_CORE_NFT, ERC1155_ABI, this.signer)
    this._capitalPoolAddress = ZeroAddress
    this._refundPoolAddress = ZeroAddress
    this._faucetContract = createContract(import.meta.env.VITE_CORE_FAUCET, faucetABI, this.signer)
  }

  private static _instance: CoreContracts
  public static getCoreContractsInstance(signer: ethers.JsonRpcSigner) {
    if (!CoreContracts._instance)
      CoreContracts._instance = new CoreContracts(signer)
    return CoreContracts._instance
  }

  get signer(): ethers.JsonRpcSigner {
    return this._signer
  }

  /**
   * Capital Pool
   */
  private _capitalPoolContract: capitalPool | undefined

  /**
   * Capital Pool Address
   */
  private _capitalPoolAddress: string

  /**
   * Refund Pool
   */
  private _refundPoolContract: refundPool | undefined

  /**
   * Refund Pool Address
   */
  private _refundPoolAddress: string

  /**
   * Capital Factory
   */
  private _capitalFactoryContract: capitalFactory

  /**
   * Refund Factory
   */
  private _refundFactoryContract: refundFactory

  /**
   * Process Center
   */
  private _processCenterContract: processCenter

  /**
   * Router
   */
  private _routerContract: router

  /**
   * Manage
   */
  private _manageContract: manage

  /**
   * Market
   */
  private _marketContract: market

  /**
   * Handle
   */
  private _handleContract: handle

  private _fofContract: ERC20

  private _usdcContract: ERC20

  private _nftContract: ERC1155

  private _sharesContract: shares

  private _ERC20Contract: ERC20 | undefined

  private _ERC1155Contract: ERC1155 | undefined

  private _faucetContract: faucet

  get capitalFactoryContract(): capitalFactory {
    return this._capitalFactoryContract
  }

  get refundFactoryContract(): capitalFactory {
    return this._refundFactoryContract
  }

  get manageContract(): manage {
    return this._manageContract
  }

  get marketContract(): market {
    return this._marketContract
  }

  get handleContract(): handle {
    return this._handleContract
  }

  get routerContract(): router {
    return this._routerContract
  }

  get processCenterContract(): processCenter {
    return this._processCenterContract
  }

  get capitalPoolContract(): capitalPool | undefined {
    return this._capitalPoolContract
  }

  get refundPoolContract(): refundPool | undefined {
    return this._refundPoolContract
  }

  get capitalPoolAddress(): string {
    return this._capitalPoolAddress
  }

  get refundPoolAddress(): string {
    return this._refundPoolAddress
  }

  get fofContract() {
    return this._fofContract
  }

  get usdcContract() {
    return this._usdcContract
  }

  get nftContract() {
    return this._nftContract
  }

  get sharesContract() {
    return this._sharesContract
  }

  get faucetContract() {
    return this._faucetContract
  }

  /**
   * get Capital Pool Address and assign Capital Pool Contract
   */
  async getUserCapitalPoolAddress(): Promise<string> {
    const capitalPoolAddress = await this.processCenterContract._userToCatpitalPool(this.signer)
    if (capitalPoolAddress === ZeroAddress) {
      message.error(MessageError.CapitalPoolOrRefundPoolAddressIsUnavailable)
      return Promise.reject(new Error(Errors.CapitalPoolOrRefundPoolAddressIsUnavailable))
    }
    this._capitalPoolAddress = capitalPoolAddress
    this._capitalPoolContract = createContract<capitalPool>(this._capitalPoolAddress, capitalPoolABI, this.signer)
    return this._capitalPoolAddress
  }

  /**
   * get Refund Pool Contract and assign Refund Pool Address
   */
  async getUserRefundPoolAddress(): Promise<string> {
    if (this.capitalPoolAddress === ZeroAddress)
      await this.getUserCapitalPoolAddress()
    const refundPoolAddress = await this.processCenterContract._getRefundPool(this.capitalPoolAddress)
    if (refundPoolAddress === ZeroAddress) {
      message.error(MessageError.CapitalPoolOrRefundPoolAddressIsUnavailable)
      return Promise.reject(new Error(Errors.CapitalPoolOrRefundPoolAddressIsUnavailable))
    }
    this._refundPoolAddress = refundPoolAddress
    this._refundPoolContract = createContract<refundPool>(this._refundPoolAddress, capitalPoolABI, this.signer)
    return this._refundPoolAddress
  }

  /**
   * create a ERC20 contract
   */
  async getERC20Contract(token: string) {
    return createContract<ERC20>(
      token,
      ERC20_ABI,
      this.signer,
    )
  }

  async getERC1155Contract(token: string) {
    return createContract<ERC1155>(
      token,
      ERC1155_ABI,
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
      token ?? import.meta.env.VITE_CORE_LIQUIDITY,
      TEST_LIQUIDITY_ABI,
      this.signer,
    )
  }

  async testLiquidity_calculateSwapRatio(swapToken: string, fee = BigInt(3000)): Promise<string> {
    const contract = await this.getTestLiquidityContract()

    const price = await contract?.getTokenPrice(
      import.meta.env.VITE_TOKEN_USDC,
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

    const approve = await this.ERC20_approve(import.meta.env.VITE_TOKEN_USDC, processCenterAddress, amount)

    if (!approve) {
      message.error('approve is error')
      throw new Error('approve is error')
    }

    const transaction = await processCenterContract.supply(import.meta.env.VITE_TOKEN_USDC, amount, tradeId)
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

    const ERC20Contract = await this?.getERC20Contract(import.meta.env.VITE_TOKEN_USDC)

    const approveRes = await ERC20Contract?.approve(routerContract.getAddress(), amount)

    return handleTransaction(approveRes)
  }

  async checkUsdcAllowance() {
    const routerContract = await this.getFollowRouterContract()

    const ERC20Contract = await this?.getERC20Contract(import.meta.env.VITE_TOKEN_USDC)

    const allowance = await ERC20Contract?.allowance(this.signer, routerContract.getAddress())

    return allowance
  }

  async checkWithdrawed(id: number) {
    const routerContract = await this.getFollowRouterContract()
    const result = await routerContract.getUserIfWithdraw(id)
    return result
  }
}
