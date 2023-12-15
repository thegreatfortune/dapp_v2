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
