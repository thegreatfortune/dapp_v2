import USDC_Icon from '@/assets/images/loan-details/usdc.png'
import BTC_Icon from '@/assets/images/loan-details/BTC.png'
import ETH_Icon from '@/assets/images/loan-details/ETH.png'
import UNI_Icon from '@/assets/images/loan-details/UNI.png'

const tradingPairTokenMap = {
  USDC: import.meta.env.VITE_USDC_TOKEN,
  FollowToken: import.meta.env.VITE_FOLLOW_TOKEN,
  FTT: import.meta.env.VITE_FOLLOW_TOKEN,
  BTC: import.meta.env.VITE_BTC_TOKEN,
  ETH: import.meta.env.VITE_ETH_TOKEN,
  SOL: import.meta.env.VITE_SOL_TOKEN,
  DOGE: import.meta.env.VITE_DOGE_TOKEN,
  ARB: import.meta.env.VITE_ARB_TOKEN,
  LINK: import.meta.env.VITE_LINK_TOKEN,
  UNI: import.meta.env.VITE_UNI_TOKEN,
  LDO: import.meta.env.VITE_LDO_TOKEN,
  AAVE: import.meta.env.VITE_AAVE_TOKEN,
}

export const tokenList = [
  {
    name: 'USDC',
    address: import.meta.env.VITE_USDC_TOKEN,
    icon: USDC_Icon,
  },
  {
    name: 'FTT',
    address: import.meta.env.VITE_FOLLOW_TOKEN,
    icon: UNI_Icon,
  },
  {
    name: 'BTC',
    address: import.meta.env.VITE_BTC_TOKEN,
    icon: BTC_Icon,
  },
  {
    name: 'ETH',
    address: import.meta.env.VITE_ETH_TOKEN,
    icon: ETH_Icon,
  },
]

export default tradingPairTokenMap
