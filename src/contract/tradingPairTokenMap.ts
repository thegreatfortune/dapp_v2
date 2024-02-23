import USDC_Icon from '@/assets/images/loan-details/usdc.png'
import BTC_Icon from '@/assets/images/loan-details/BTC.png'
import ETH_Icon from '@/assets/images/loan-details/ETH.png'
import SOL_Icon from '@/assets/images/loan-details/SOL.png'
import UNI_Icon from '@/assets/images/loan-details/UNI.png'
import DOGE_Icon from '@/assets/images/loan-details/DOGE.png'
import ARB_Icon from '@/assets/images/loan-details/ARB.png'
import LINK_Icon from '@/assets/images/loan-details/LINK.png'
import LDO_Icon from '@/assets/images/loan-details/LDO.png'
import AAVE_Icon from '@/assets/images/loan-details/AAVE.png'

const tradingPairTokenMap = {
  USDC: import.meta.env.VITE_TOKEN_USDC,
  // FollowToken: import.meta.env.VITE_FOLLOW_TOKEN,
  // FTT: import.meta.env.VITE_FOLLOW_TOKEN,
  BTC: import.meta.env.VITE_TOKEN_BTC,
  ETH: import.meta.env.VITE_TOKEN_ETH,
  SOL: import.meta.env.VITE_TOKEN_SOL,
  DOGE: import.meta.env.VITE_DOGE_TOKEN,
  ARB: import.meta.env.VITE_TOKEN_ARB,
  LINK: import.meta.env.VITE_TOKEN_LINK,
  UNI: import.meta.env.VITE_TOKEN_UNI,
  LDO: import.meta.env.VITE_TOKEN_LDO,
  AAVE: import.meta.env.VITE_TOKEN_AAVE,
}

export const tokenList = [
  {
    name: 'USDC',
    address: import.meta.env.VITE_TOKEN_USDC,
    icon: USDC_Icon,
  },
  {
    name: 'BTC',
    address: import.meta.env.VITE_TOKEN_BTC,
    icon: BTC_Icon,
  },
  {
    name: 'ETH',
    address: import.meta.env.VITE_TOKEN_ETH,
    icon: ETH_Icon,
  },
  {
    name: 'SOL',
    address: import.meta.env.VITE_TOKEN_SOL,
    icon: SOL_Icon,
  },
  {
    name: 'ARB',
    address: import.meta.env.VITE_TOKEN_ARB,
    icon: ARB_Icon,
  },
  {
    name: 'LINK',
    address: import.meta.env.VITE_TOKEN_LINK,
    icon: LINK_Icon,
  },
  {
    name: 'UNI',
    address: import.meta.env.VITE_TOKEN_UNI,
    icon: UNI_Icon,
  },
  {
    name: 'LDO',
    address: import.meta.env.VITE_TOKEN_LDO,
    icon: LDO_Icon,
  },
  {
    name: 'AAVE',
    address: import.meta.env.VITE_TOKEN_AAVE,
    icon: AAVE_Icon,
  },
  {
    name: 'DOGE',
    address: import.meta.env.VITE_DOGE_TOKEN,
    icon: DOGE_Icon,
  },
]

export default tradingPairTokenMap
