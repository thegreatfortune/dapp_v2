// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import type { Models } from '@/.generated/api/models'

// import { Image, message } from 'antd'
// import { maskWeb3Address } from '@/utils/maskWeb3Address'

interface DetailProps {
  address: string
  props: string
  item: Models.LoanOrderVO

}

const DetailCard: React.FC<DetailProps> = ({ item }) => {
  return (

    <div className='box-border h160 w321 b-1px b-#171822 b-#303241 b-rd-16 b-solid opacity-100'>
      {/* <Image width={300} height={271} src={item.balance} className='b-rd-12'/> */}

      <img src="/src/assets/images/personal-center/cardBackGround.png" alt="" />
    </div>
  )
}

// const DetailCard = () => {
//   return (
//     <div>
//       {/* style={{ backgroundImage: 'url(/src/assets/images/loan-details/cardBackGround.png)' }} */}
//       <div className='flex justify-between'>
//         <div className='grid gap-40' >
//           <div className='flex'>
//             <img src="/src/assets/images/loan-details/cardBackGround.png" alt="" className='z-1 h160 w321 opacity-100' />
//             <div className='absolute z-2'>
//               <div className='w321 flex'>
//                 <img src="/src/assets/images/loan-details/XRP.png" alt="" className='ml-16 mt-35 h32 w32' />
//                 <span className='ml-13 mt-35 h32 w105 text-21 font-400 lh-32 c-#FFF'>XRP(5%)</span>
//                 <span className='mt-47 h13 w43 text-11 font-400 lh-13 c-#22d49f'>1.56XRP</span>
//               </div>
//               <div className='w321 flex'>
//                 <li className='ml-16 mt-11 h37 text-32 lh-38 c-#505368'>$</li>
//                 <span className='ml-11 mt-11 h37 w170 text-32 font-600 lh-38 c-#fff'>9,589.55</span>
//               </div>
//             </div>
//           </div>
//           <div className='flex'>
//             <img src="/src/assets/images/loan-details/cardBackGround.png" alt="" className='z-1 h160 w321 opacity-100' />
//             <div className='absolute z-2'>
//               <div className='w321 flex'>
//                 <img src="/src/assets/images/loan-details/SOL.png" alt="" className='ml-16 mt-35 h32 w32' />
//                 <span className='ml-13 mt-35 h32 w105 text-21 font-400 lh-32 c-#FFF'>SOL(10%)</span>
//                 <span className='mt-47 h13 w43 text-11 font-400 lh-13 c-#22d49f'>1.56SOL</span>
//               </div>
//               <div className='w321 flex'>
//                 <li className='ml-16 mt-11 h37 text-32 lh-38 c-#505368'>$</li>
//                 <span className='ml-11 mt-11 h37 w170 text-32 font-600 lh-38 c-#fff'>32,482.44</span>
//               </div>
//             </div>
//           </div>
//           <div className='flex'>
//             <img src="/src/assets/images/loan-details/cardBackGround.png" alt="" className='z-1 h160 w321 opacity-100' />
//             <div className='absolute z-2'>
//               <div className='w321 flex'>
//                 <img src="/src/assets/images/loan-details/BTC.png" alt="" className='ml-16 mt-35 h32 w32' />
//                 <span className='ml-13 mt-35 h32 w105 text-21 font-400 lh-32 c-#FFF'>BTC(65%)</span>
//                 <span className='mt-47 h13 w43 text-11 font-400 lh-13 c-#22d49f'>1.56BTC</span>
//               </div>
//               <div className='w321 flex'>
//                 <li className='ml-16 mt-11 h37 text-32 lh-38 c-#505368'>$</li>
//                 <span className='ml-11 mt-11 h37 w170 text-32 font-600 lh-38 c-#fff'>32,482.44</span>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className='grid ml-50 gap-40'>
//           <div className='flex'>
//             <img src="/src/assets/images/loan-details/cardBackGround.png" alt="" className='z-1 h160 w321 opacity-100' />
//             <div className='absolute z-2'>
//               <div className='w321 flex'>
//                 <img src="/src/assets/images/loan-details/ETH.png" alt="" className='ml-16 mt-35 h32 w32' />
//                 <span className='ml-13 mt-35 h32 w173 text-21 font-400 lh-32 c-#FFF'>USDCETH(+20%)</span>
//                 <span className='mt-47 h13 w43 text-11 font-400 lh-13 c-#22d49f'>1.56ETH</span>
//               </div>
//               <div className='w321 flex'>
//                 <li className='ml-16 mt-11 h37 text-32 lh-38 c-#505368'>$</li>
//                 <span className='ml-11 mt-11 h37 w170 text-32 font-600 lh-38 c-#fff'>438.76</span>
//               </div>
//             </div>
//           </div>
//           <div className='flex'>
//             <img src="/src/assets/images/loan-details/cardBackGround.png" alt="" className='z-1 h160 w321 opacity-100' />
//             <div className='absolute z-2'>
//               <div className='w321 flex'>
//                 <img src="/src/assets/images/loan-details/SOL.png" alt="" className='ml-16 mt-35 h32 w32' />
//                 <span className='ml-13 mt-35 h32 w173 text-21 font-400 lh-32 c-#FFF'>USDCSOL(-30%)</span>
//                 <span className='mt-47 h13 w43 text-11 font-400 lh-13 c-#22d49f'>1.56SOL</span>
//               </div>
//               <div className='w321 flex'>
//                 <li className='ml-16 mt-11 h37 text-32 lh-38 c-#505368'>$</li>
//                 <span className='ml-11 mt-11 h37 w170 text-32 font-600 lh-38 c-#fff'>1,021.49</span>
//               </div>
//             </div>
//           </div>
//           <div className='flex'>
//             <img src="/src/assets/images/loan-details/cardBackGround.png" alt="" className='z-1 h160 w321 opacity-100' />
//             <div className='absolute z-2'>
//               <div className='w321 flex'>
//                 <img src="/src/assets/images/loan-details/ETH.png" alt="" className='ml-16 mt-35 h32 w32' />
//                 <span className='ml-13 mt-35 h32 w105 text-21 font-400 lh-32 c-#FFF'>ETH(20%)</span>
//                 <span className='mt-47 h13 w43 text-11 font-400 lh-13 c-#22d49f'>1.56ETH</span>
//               </div>
//               <div className='w321 flex'>
//                 <li className='ml-16 mt-11 h37 text-32 lh-38 c-#505368'>$</li>
//                 <span className='ml-11 mt-11 h37 w170 text-32 font-600 lh-38 c-#fff'>1,021.49</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

export default DetailCard
