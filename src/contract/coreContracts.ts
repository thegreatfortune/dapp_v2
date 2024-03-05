import type { ethers } from 'ethers'
import { Contract, ZeroAddress } from 'ethers'
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
import TESTLIQUIDITY_ABI from '@/abis/UniswapV3.json'
import { ChainAddressEnums } from '@/enums/chain'

// import USDCLogo from '@/assets/images/loan-details/usdc.png'
import BTCLogo from '@/assets/images/apply-loan/token-icons/BTC.png'
import ETHLogo from '@/assets/images/apply-loan/token-icons/ETH.png'
import ARBLogo from '@/assets/images/apply-loan/token-icons/ARB.png'
import LINKLogo from '@/assets/images/apply-loan/token-icons/LINK.png'
import UNILogo from '@/assets/images/apply-loan/token-icons/UNI.png'
import LDOLogo from '@/assets/images/apply-loan/token-icons/LDO.png'
import AAVELogo from '@/assets/images/apply-loan/token-icons/AAVE.png'
import SOLLogo from '@/assets/images/apply-loan/token-icons/SOL.png'

function createContract<T>(address: string, abi: ethers.InterfaceAbi | ethers.Interface, signer: ethers.Signer): T {
  return new Contract(address, abi, signer) as T
}

export class CoreContracts {
  constructor(private _signer: ethers.JsonRpcSigner, private _chainId: number) {
    const chainAddresses = ChainAddressEnums[this._chainId]
    this._capitalFactoryContract = createContract(chainAddresses.capitalFactory, capitalFactoryABI, this.signer)
    this._refundFactoryContract = createContract(chainAddresses.refundFactory, refundFactoryABI, this.signer)
    this._processCenterContract = createContract(chainAddresses.processCenter, processCenterABI, this.signer)
    this._manageContract = createContract(chainAddresses.manage, manageABI, this.signer)
    this._marketContract = createContract(chainAddresses.market, marketABI, this.signer)
    this._routerContract = createContract(chainAddresses.router, routerABI, this.signer)
    this._handleContract = createContract(chainAddresses.handle, handleABI, this.signer)
    this._sharesContract = createContract(chainAddresses.shares, ERC3525_ABI, this.signer)
    this._fofContract = createContract(chainAddresses.fof, ERC20_ABI, this.signer)
    this._nftContract = createContract(chainAddresses.nft, ERC1155_ABI, this.signer)
    this._usdcContract = createContract(chainAddresses.USDC, ERC20_ABI, this.signer)
    this._capitalPoolAddress = ZeroAddress
    this._refundPoolAddress = ZeroAddress
    this._faucetContract = createContract(chainAddresses.faucet, faucetABI, this.signer)
    this._specifiedTradingPairsOfSpot = [
      {
        logo: BTCLogo,
        name: 'BTC',
        address: chainAddresses.BTC,
      },
      {
        logo: ETHLogo,
        name: 'ETH',
        address: chainAddresses.ETH,
      },
      {
        logo: SOLLogo,
        name: 'SOL',
        address: chainAddresses.SOL,
      },
      {
        logo: ARBLogo,
        name: 'ARB',
        address: chainAddresses.ARB,
      },
      {
        logo: LINKLogo,
        name: 'LINK',
        address: chainAddresses.LINK,
      },
      {
        logo: UNILogo,
        name: 'UNI',
        address: chainAddresses.UNI,
      },
      {
        logo: LDOLogo,
        name: 'LDO',
        address: chainAddresses.LDO,
      },
      {
        logo: AAVELogo,
        name: 'AAVE',
        address: chainAddresses.AAVE,
      },
    ]
    this._specifiedTradingPairsOfFuture = []
    this._liquidityContract = createContract(chainAddresses.liquidity, TESTLIQUIDITY_ABI, this.signer,
    )
  }

  private static _instance: CoreContracts
  public static getCoreContractsInstance(signer: ethers.JsonRpcSigner, chainId: number) {
    if (!CoreContracts._instance || CoreContracts._instance.chainId !== chainId)
      return CoreContracts._instance = new CoreContracts(signer, chainId)
    if (CoreContracts._instance.signer.address !== signer.address) {
      CoreContracts._instance._capitalPoolContract = undefined
      CoreContracts._instance._capitalPoolAddress = ZeroAddress

      CoreContracts._instance._refundPoolContract = undefined
      CoreContracts._instance._refundPoolAddress = ZeroAddress
      CoreContracts._instance._signer = signer
    }
    return CoreContracts._instance
  }

  get chainId(): number {
    return this._chainId
  }

  get signer(): ethers.JsonRpcSigner {
    return this._signer
  }

  private _capitalPoolContract: capitalPool | undefined

  private _capitalPoolAddress: string

  private _refundPoolContract: refundPool | undefined

  private _refundPoolAddress: string

  private _capitalFactoryContract: capitalFactory

  private _refundFactoryContract: refundFactory

  private _processCenterContract: processCenter

  private _routerContract: router

  private _manageContract: manage

  private _marketContract: market

  private _handleContract: handle

  private _fofContract: ERC20

  private _usdcContract: ERC20

  private _nftContract: ERC1155

  private _sharesContract: shares

  private _ERC20Contract: ERC20 | undefined

  private _ERC1155Contract: ERC1155 | undefined

  private _faucetContract: faucet

  private _specifiedTradingPairsOfSpot: { logo: string; name: string; address: string }[]

  private _specifiedTradingPairsOfFuture: { logo: string; name: string; address: string }[]

  private _liquidityContract: UniswapV3

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

  get specifiedTradingPairsOfSpot() {
    return this._specifiedTradingPairsOfSpot
  }

  get specifiedTradingPairsOfFuture() {
    return this._specifiedTradingPairsOfFuture
  }

  /**
   * @deprecated
   * get Capital Pool Address and assign Capital Pool Contract
   */
  async getUserCapitalPoolAddress(): Promise<string> {
    const capitalPoolAddress = await this.processCenterContract._userToCatpitalPool(this.signer)
    if (capitalPoolAddress === ZeroAddress)
      return this._capitalPoolAddress
    this._capitalPoolAddress = capitalPoolAddress
    this._capitalPoolContract = createContract<capitalPool>(this._capitalPoolAddress, capitalPoolABI, this.signer)
    return this._capitalPoolAddress
  }

  /**
   * @deprecated
   * get Refund Pool Contract and assign Refund Pool Address
   */
  async getUserRefundPoolAddress(): Promise<string> {
    if (this.capitalPoolAddress === ZeroAddress)
      await this.getUserCapitalPoolAddress()
    const refundPoolAddress = await this.processCenterContract._getRefundPool(this.capitalPoolAddress)
    if (refundPoolAddress === ZeroAddress)
      return this._refundPoolAddress
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
  async getTestLiquidityContract() {
    return this._liquidityContract
  }
}
