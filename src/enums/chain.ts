/* eslint-disable @typescript-eslint/indent */
import { ZeroAddress } from 'ethers'

// import USDCLogo from '@/assets/images/loan-details/usdc.png'

import BTCLogo from '@/assets/images/apply-loan/token-icons/BTC.png'
import ETHLogo from '@/assets/images/apply-loan/token-icons/ETH.png'
import ARBLogo from '@/assets/images/apply-loan/token-icons/ARB.png'
import LINKLogo from '@/assets/images/apply-loan/token-icons/LINK.png'
import UNILogo from '@/assets/images/apply-loan/token-icons/UNI.png'
import LDOLogo from '@/assets/images/apply-loan/token-icons/LDO.png'
import AAVELogo from '@/assets/images/apply-loan/token-icons/AAVE.png'
import SOLLogo from '@/assets/images/apply-loan/token-icons/SOL.png'

interface IChainAddresses {
    apiEndpoint: string
    capitalFactory: string
    refundFactory: string
    processCenter: string
    manage: string
    market: string
    router: string
    handle: string
    shares: string
    fof: string
    nft: string
    USDC: string
    BTC: string
    SOL: string
    ETH: string
    ARB: string
    LINK: string
    UNI: string
    LDO: string
    AAVE: string
    capitalPool: string
    refundPool: string
    faucet: string
    liquidity: string
    nativeFaucetUrl: string
    [key: string]: string
}

const ChainAddressEnums: { [key: number]: IChainAddresses } = {
    11155420: {
        apiEndpoint: import.meta.env.VITE_OPSEPOLIA_API_ENDPOINT,
        capitalFactory: import.meta.env.VITE_OPSEPOLIA_CORE_CAPITAL_FACTORY as string,
        refundFactory: import.meta.env.VITE_OPSEPOLIA_CORE_REFUND_FACTORY as string,
        processCenter: import.meta.env.VITE_OPSEPOLIA_CORE_PROCESS_CENTER as string,
        manage: import.meta.env.VITE_OPSEPOLIA_CORE_MANAGE as string,
        market: import.meta.env.VITE_OPSEPOLIA_CORE_MARKET as string,
        router: import.meta.env.VITE_OPSEPOLIA_CORE_ROUTER as string,
        handle: import.meta.env.VITE_OPSEPOLIA_CORE_HANDLE as string,
        shares: import.meta.env.VITE_OPSEPOLIA_CORE_SHARES as string,
        fof: import.meta.env.VITE_OPSEPOLIA_CORE_FOF as string,
        nft: import.meta.env.VITE_OPSEPOLIA_CORE_NFT as string,
        USDC: import.meta.env.VITE_OPSEPOLIA_TOKEN_USDC as string,
        BTC: import.meta.env.VITE_OPSEPOLIA_TOKEN_BTC as string,
        SOL: import.meta.env.VITE_OPSEPOLIA_TOKEN_SOL as string,
        ETH: import.meta.env.VITE_OPSEPOLIA_TOKEN_ETH as string,
        ARB: import.meta.env.VITE_OPSEPOLIA_TOKEN_ARB as string,
        LINK: import.meta.env.VITE_OPSEPOLIA_TOKEN_LINK as string,
        UNI: import.meta.env.VITE_OPSEPOLIA_TOKEN_UNI as string,
        LDO: import.meta.env.VITE_OPSEPOLIA_TOKEN_LDO as string,
        AAVE: import.meta.env.VITE_OPSEPOLIA_TOKEN_AAVE as string,
        capitalPool: ZeroAddress,
        refundPool: ZeroAddress,
        faucet: import.meta.env.VITE_OPSEPOLIA_CORE_FAUCET as string,
        liquidity: import.meta.env.VITE_OPSEPOLIA_CORE_LIQUIDITY as string,
        nativeFaucetUrl: 'https://mumbaifaucet.com/',
    },
    80001: {
        apiEndpoint: import.meta.env.VITE_MUMBAI_API_ENDPOINT,
        capitalFactory: import.meta.env.VITE_MUMBAI_CORE_CAPITAL_FACTORY as string,
        refundFactory: import.meta.env.VITE_MUMBAI_CORE_REFUND_FACTORY as string,
        processCenter: import.meta.env.VITE_MUMBAI_CORE_PROCESS_CENTER as string,
        manage: import.meta.env.VITE_MUMBAI_CORE_MANAGE as string,
        market: import.meta.env.VITE_MUMBAI_CORE_MARKET as string,
        router: import.meta.env.VITE_MUMBAI_CORE_ROUTER as string,
        handle: import.meta.env.VITE_MUMBAI_CORE_HANDLE as string,
        shares: import.meta.env.VITE_MUMBAI_CORE_SHARES as string,
        fof: import.meta.env.VITE_MUMBAI_CORE_FOF as string,
        nft: import.meta.env.VITE_MUMBAI_CORE_NFT as string,
        USDC: import.meta.env.VITE_MUMBAI_TOKEN_USDC as string,
        BTC: import.meta.env.VITE_MUMBAI_TOKEN_BTC as string,
        SOL: import.meta.env.VITE_MUMBAI_TOKEN_SOL as string,
        ETH: import.meta.env.VITE_MUMBAI_TOKEN_ETH as string,
        ARB: import.meta.env.VITE_MUMBAI_TOKEN_ARB as string,
        LINK: import.meta.env.VITE_MUMBAI_TOKEN_LINK as string,
        UNI: import.meta.env.VITE_MUMBAI_TOKEN_UNI as string,
        LDO: import.meta.env.VITE_MUMBAI_TOKEN_LDO as string,
        AAVE: import.meta.env.VITE_MUMBAI_TOKEN_AAVE as string,
        capitalPool: ZeroAddress,
        refundPool: ZeroAddress,
        faucet: import.meta.env.VITE_MUMBAI_CORE_FAUCET as string,
        liquidity: import.meta.env.VITE_MUMBAI_CORE_LIQUIDITY as string,
        nativeFaucetUrl: 'https://mumbaifaucet.com/',
    },
}

const TokenLogo: { [key: string]: string } = {
    USDC: UNILogo,
    BTC: BTCLogo,
    SOL: SOLLogo,
    ETH: ETHLogo,
    ARB: ARBLogo,
    LINK: LINKLogo,
    UNI: UNILogo,
    LDO: LDOLogo,
    AAVE: AAVELogo,
}

export {
    ChainAddressEnums,
    TokenLogo,
}
