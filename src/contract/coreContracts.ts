import { Contract, ZeroAddress, ethers } from 'ethers'
import { message } from 'antd'
import BigNumber from 'bignumber.js'
import type {
  FollowFiERC1155 as ERC1155,
  ERC20,
  UniswapV3,
  FollowFactory as capitalFactory,
  FollowCapitalPool as capitalPool,
  FollowFaucet as faucet,
  FollowHandle as handle,
  FollowManage as manage,
  FollowMarket as market,
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
import ERC3525_ABI from '@/abis/ERC3525.json'
import ERC20_ABI from '@/abis/ERC20.json'
import ERC1155_ABI from '@/abis/FollowFiERC1155.json'
import TEST_LIQUIDITY_ABI from '@/abis/UniswapV3.json'
import { MessageError } from '@/enums/error'

function createContract<T>(address: string, abi: ethers.InterfaceAbi | ethers.Interface, signer: ethers.Signer): T {
  return new Contract(address, abi, signer) as T
}

export class CoreContracts {
  constructor(private _signer: ethers.JsonRpcSigner) {
    this._capitalFactoryContract = createContract(import.meta.env.VITE_CORE_CAPITAL_FACTORY, capitalFactoryABI, this.signer)
    this._refundFactoryContract = createContract(import.meta.env.VITE_CORE_REFUND_FACTORY, refundFactoryABI, this.signer)
    this._processCenterContract = createContract(import.meta.env.VITE_CORE_PROCESS_CENTER, processCenterABI, this.signer)
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

  set signer(signer: ethers.JsonRpcSigner) {
    this._signer = signer
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

  get refundFactoryContract(): refundFactory {
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
      return Promise.reject(new Error(MessageError.CapitalPoolOrRefundPoolAddressIsUnavailable))
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
      return Promise.reject(new Error(MessageError.CapitalPoolOrRefundPoolAddressIsUnavailable))
    }
    this._refundPoolAddress = refundPoolAddress
    this._refundPoolContract = createContract<refundPool>(this._refundPoolAddress, refundPoolABI, this.signer)
    return this._refundPoolAddress
  }

  /**
   * create a ERC20 contract
   */
  async getERC20Contract(token: string) {
    this._ERC20Contract = createContract<ERC20>(
      token,
      ERC20_ABI,
      this.signer,
    )
    return this._ERC20Contract
  }

  async getERC1155Contract(token: string) {
    this._ERC1155Contract = createContract<ERC1155>(
      token,
      ERC1155_ABI,
      this.signer,
    )
    return this._ERC1155Contract
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
}
