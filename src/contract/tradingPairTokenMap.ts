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

console.log('%c [ import.meta.env ]-8', 'font-size:13px; background:#b0f6ae; color:#f4fff2;', import.meta.env)
const tradingPairTokenMap = {
  USDC: import.meta.env.VITE_USDC_TOKEN,
  // FollowToken: import.meta.env.VITE_FOLLOW_TOKEN,
  // FTT: import.meta.env.VITE_FOLLOW_TOKEN,
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
  // {
  //   name: 'FTT',
  //   address: import.meta.env.VITE_FOLLOW_TOKEN,
  //   icon: UNI_Icon,
  // },
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
  {
    name: 'SOL',
    address: import.meta.env.VITE_SOL_TOKEN,
    icon: SOL_Icon,
  },
  {
    name: 'DOGE',
    address: import.meta.env.VITE_DOGE_TOKEN,
    icon: DOGE_Icon,
  },
  {
    name: 'ARB',
    address: import.meta.env.VITE_ARB_TOKEN,
    icon: ARB_Icon,
  },
  {
    name: 'LINK',
    address: import.meta.env.VITE_LINK_TOKEN,
    icon: LINK_Icon,
  },
  {
    name: 'UNI',
    address: import.meta.env.VITE_UNI_TOKEN,
    icon: UNI_Icon,
  },
  {
    name: 'LDO',
    address: import.meta.env.VITE_LDO_TOKEN,
    icon: LDO_Icon,
  },
  {
    name: 'AAVE',
    address: import.meta.env.VITE_AAVE_TOKEN,
    icon: AAVE_Icon,
  },
]

export default tradingPairTokenMap
