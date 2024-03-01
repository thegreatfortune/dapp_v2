/* eslint-disable @typescript-eslint/indent */
import { ZeroAddress } from 'ethers'
import { polygonMumbai } from 'wagmi/chains'
import { opSepolia } from '@/main'

const getChainAddresses = (chainId: number) => {
    switch (chainId) {
        case opSepolia.id:
            return {
                capitalFactory: import.meta.env.VITE_OPSEPOLIA_CORE_CAPITAL_FACTORY,
                refundFactory: import.meta.env.VITE_OPSEPOLIA_CORE_REFUND_FACTORY,
                processCenter: import.meta.env.VITE_OPSEPOLIA_CORE_PROCESS_CENTER,
                manage: import.meta.env.VITE_OPSEPOLIA_CORE_MANAGE,
                market: import.meta.env.VITE_OPSEPOLIA_CORE_MARKET,
                router: import.meta.env.VITE_OPSEPOLIA_CORE_ROUTER,
                handle: import.meta.env.VITE_OPSEPOLIA_CORE_HANDLE,
                shares: import.meta.env.VITE_OPSEPOLIA_CORE_SHARES,
                fof: import.meta.env.VITE_OPSEPOLIA_CORE_FOF,
                nft: import.meta.env.VITE_OPSEPOLIA_CORE_NFT,
                usdc: import.meta.env.VITE_OPSEPOLIA_TOKEN_USDC,
                btc: import.meta.env.VITE_OPSEPOLIA_TOKEN_BTC,
                sol: import.meta.env.VITE_OPSEPOLIA_TOKEN_SOL,
                eth: import.meta.env.VITE_OPSEPOLIA_TOKEN_ETH,
                arb: import.meta.env.VITE_OPSEPOLIA_TOKEN_ARB,
                link: import.meta.env.VITE_OPSEPOLIA_TOKEN_LINK,
                uni: import.meta.env.VITE_OPSEPOLIA_TOKEN_UNI,
                ldo: import.meta.env.VITE_OPSEPOLIA_TOKEN_LDO,
                aave: import.meta.env.VITE_OPSEPOLIA_TOKEN_AAVE,
                capitalPool: ZeroAddress,
                refundPool: ZeroAddress,
                faucet: import.meta.env.VITE_OPSEPOLIA_CORE_FAUCET,
                liquidity: import.meta.env.VITE_OPSEPOLIA_LIQUIDITY,
            }
        case polygonMumbai.id:
        default:
            return {
                capitalFactory: import.meta.env.VITE_MUMBAI_CORE_CAPITAL_FACTORY,
                refundFactory: import.meta.env.VITE_MUMBAI_CORE_REFUND_FACTORY,
                processCenter: import.meta.env.VITE_MUMBAI_CORE_PROCESS_CENTER,
                manage: import.meta.env.VITE_MUMBAI_CORE_MANAGE,
                market: import.meta.env.VITE_MUMBAI_CORE_MARKET,
                router: import.meta.env.VITE_MUMBAI_CORE_ROUTER,
                handle: import.meta.env.VITE_MUMBAI_CORE_HANDLE,
                shares: import.meta.env.VITE_MUMBAI_CORE_SHARES,
                fof: import.meta.env.VITE_MUMBAI_CORE_FOF,
                nft: import.meta.env.VITE_MUMBAI_CORE_NFT,
                usdc: import.meta.env.VITE_MUMBAI_TOKEN_USDC,
                btc: import.meta.env.VITE_MUMBAI_TOKEN_BTC,
                sol: import.meta.env.VITE_MUMBAI_TOKEN_SOL,
                eth: import.meta.env.VITE_MUMBAI_TOKEN_ETH,
                arb: import.meta.env.VITE_MUMBAI_TOKEN_ARB,
                link: import.meta.env.VITE_MUMBAI_TOKEN_LINK,
                uni: import.meta.env.VITE_MUMBAI_TOKEN_UNI,
                ldo: import.meta.env.VITE_MUMBAI_TOKEN_LDO,
                aave: import.meta.env.VITE_MUMBAI_TOKEN_AAVE,
                capitalPool: ZeroAddress,
                refundPool: ZeroAddress,
                faucet: import.meta.env.VITE_MUMBAI_CORE_FAUCET,
                liquidity: import.meta.env.VITE_MUMBAI_LIQUIDITY,
            }
    }
}

export {
    getChainAddresses,
}
