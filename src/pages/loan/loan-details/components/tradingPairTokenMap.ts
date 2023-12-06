const tradingPairTokenMap = {
  USDC: import.meta.env.VITE_USDC_TOKEN as string,
  FollowToken: import.meta.env.VITE_FOLLOW_TOKEN as string,
  FTT: import.meta.env.VITE_FOLLOW_TOKEN as string,
  BTCToken: import.meta.env.VITE_BTC_TOKEN,
  ETHToken: import.meta.env.VITE_ETH_TOKEN,
}

export const tokenList = [
  {
    name: 'USDC',
    address: import.meta.env.VITE_USDC_TOKEN,
  },
  {
    name: 'FTT',
    address: import.meta.env.VITE_FOLLOW_TOKEN,
  },
  {
    name: 'BTC',
    address: import.meta.env.VITE_BTC_TOKEN,
  },
  {
    name: 'ETH',
    address: import.meta.env.VITE_ETH_TOKEN,
  },
]

export default tradingPairTokenMap
