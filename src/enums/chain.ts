/* eslint-disable @typescript-eslint/indent */
import { ZeroAddress } from 'ethers'

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
    usdc: string
    btc: string
    sol: string
    eth: string
    arb: string
    link: string
    uni: string
    ldo: string
    aave: string
    capitalPool: string
    refundPool: string
    faucet: string
    liquidity: string
    nativeFaucetUrl: string
}

const chainAddressEnums: { [key: number]: IChainAddresses } = {
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
        usdc: import.meta.env.VITE_OPSEPOLIA_TOKEN_USDC as string,
        btc: import.meta.env.VITE_OPSEPOLIA_TOKEN_BTC as string,
        sol: import.meta.env.VITE_OPSEPOLIA_TOKEN_SOL as string,
        eth: import.meta.env.VITE_OPSEPOLIA_TOKEN_ETH as string,
        arb: import.meta.env.VITE_OPSEPOLIA_TOKEN_ARB as string,
        link: import.meta.env.VITE_OPSEPOLIA_TOKEN_LINK as string,
        uni: import.meta.env.VITE_OPSEPOLIA_TOKEN_UNI as string,
        ldo: import.meta.env.VITE_OPSEPOLIA_TOKEN_LDO as string,
        aave: import.meta.env.VITE_OPSEPOLIA_TOKEN_AAVE as string,
        capitalPool: ZeroAddress,
        refundPool: ZeroAddress,
        faucet: import.meta.env.VITE_OPSEPOLIA_CORE_FAUCET as string,
        liquidity: import.meta.env.VITE_OPSEPOLIA_LIQUIDITY as string,
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
        usdc: import.meta.env.VITE_MUMBAI_TOKEN_USDC as string,
        btc: import.meta.env.VITE_MUMBAI_TOKEN_BTC as string,
        sol: import.meta.env.VITE_MUMBAI_TOKEN_SOL as string,
        eth: import.meta.env.VITE_MUMBAI_TOKEN_ETH as string,
        arb: import.meta.env.VITE_MUMBAI_TOKEN_ARB as string,
        link: import.meta.env.VITE_MUMBAI_TOKEN_LINK as string,
        uni: import.meta.env.VITE_MUMBAI_TOKEN_UNI as string,
        ldo: import.meta.env.VITE_MUMBAI_TOKEN_LDO as string,
        aave: import.meta.env.VITE_MUMBAI_TOKEN_AAVE as string,
        capitalPool: ZeroAddress,
        refundPool: ZeroAddress,
        faucet: import.meta.env.VITE_MUMBAI_CORE_FAUCET as string,
        liquidity: import.meta.env.VITE_MUMBAI_LIQUIDITY as string,
        nativeFaucetUrl: 'https://mumbaifaucet.com/',
    },
}

export {
    chainAddressEnums,
}
