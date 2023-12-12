import Button from 'antd/es/button'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { message } from 'antd'
import useBrowserContract from '@/hooks/useBrowserContract'

const PersonalCenter = () => {
  const navigate = useNavigate()

  const { browserContractService } = useBrowserContract()

  const [loading, setLoading] = useState(false)

  async function reSet() {
    try {
      // const cp = await browserContractService?.getCapitalPoolAddress(testTradeId)

      const followCapitalPoolContract
        = await browserContractService?.getCapitalPoolContract()
      console.log('%c [ followCapitalPoolContract ]-122', 'font-size:13px; background:#6485d8; color:#a8c9ff;', followCapitalPoolContract)

      await followCapitalPoolContract?.initCreateOrder()
    }
    catch (error) {
      console.log(
        '%c [ error ]-75',
        'font-size:13px; background:#69bdf3; color:#adffff;',
        error,
      )
    }
  }

  const checkLoanOrderAndUserState = async () => {
    try {
      if (!browserContractService)
        return

      setLoading(true)
      // const isOrderCreated = await browserContractService?.getOrderCreateState()
      // console.log('%c [ isOrderCreated ]-40', 'font-size:13px; background:#a23f4c; color:#e68390;', isOrderCreated)

      const processCenterContract = await browserContractService?.getProcessCenterContract()

      const orderCanCreatedAgain = await browserContractService?.checkOrderCanCreateAgain()
      // console.log('%c [ orderCanCreatedAgain ]-45', 'font-size:13px; background:#bcdd20; color:#ffff64;', orderCanCreatedAgain)

      const isBlack = await processCenterContract?._getIfBlackList(browserContractService?.getSigner.address)
      console.log('%c [ isBlack ]-45', 'font-size:13px; background:#fde876; color:#ffffba;', isBlack)

      if (isBlack)
        message.error('You must be not black list to continue processing your order')

      if (!isBlack && orderCanCreatedAgain)
        navigate('/apply-loan')
      else
        message.warning(`order cant not repetition create :${orderCanCreatedAgain}`)
    }
    catch (error) {
      message.error('Error: order status error')
      console.log('%c [ error ]-15', 'font-size:13px; background:#eccc7f; color:#ffffc3;', error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* <img src="src/assets/images/personal-center/navImage.png" alt="" className='h-368 w-1920' /> */}
      {/* <img src="src/assets/images/personal-center/mypcbg.png" alt="" /> */}
      {/* <div className='h-103 w-full'></div> */}
      <div className='relative'>
        <img src="src/assets/images/personal-center/panda.png" alt="" className='absolute z-2 ml-298 mt-5 h140 w140 b-rd-0 opacity-100' />
        <div className='absolute z-1 ml-288 h-160 w-160 b-rd-150 bg-#171822 opacity-100'></div>
      </div>
      <div>
        <div className='h80'></div>
        <div className='w-1920 flex justify-between bg-#171822 bg-cover'>
          <div className='flex justify-around'>
            <div>
              {/* <img src="src/assets/images/personal-center/panda.png" alt="" className='h160 w160 b-rd-0 opacity-100' /> */}
              <div></div>
            </div>
            <div>

            </div>
            <div className='ml-286 h-88 w-188'>
              <div className='ml-179 mt-11 h31 w179 text-32 font-400 lh-31 c-#fff'>bu.darmani1</div>
              <div className='ml-179 mt-15 h18 w80 text-24 font-400 lh-18 c-#d1d5db opacity-60'>@Artist</div>
            </div>
            <div className='ml-198 mt-15 h-23 w-104 b-rd-15px bg-#333A81 text-center text-10 font-400 lh-23 c-#4959EE opacity-100'> 0xf34cc...6fefa</div>
          </div>
          <div className='mr-337 flex justify-between bg-#171822'>
            <Button loading={loading}
              type="primary" onClick={checkLoanOrderAndUserState}
              className='mr-76 mt-27 inline-block h-60 w-254 transform cursor-pointer b-rd-54px border-none bg-gradient-to-r p-0 font-400 lh-27 text-#000 transition-transform active:scale-95 hover:scale-105 !bg-#D9D9D9 !font-400 !hover:c-pink'>
              Apply for a loan
            </Button>
            <Button type="primary" onClick={reSet}
              className='mt-27 inline-block h-60 w-117 transform cursor-pointer b-rd-54 border-none from-[#0154fa] to-[#11b5dd] bg-gradient-to-r p-0 text-18 font-400 lh-27 text-white transition-transform active:scale-95 hover:scale-105 !hover:c-pink'>
              Follow</Button>
          </div>
        </div>
        <div className='h-54 w-full bg-#171822'></div>
        <div className='flex bg-#171822'>
          <div className='ml-288 h-24 w-110 text-16 font-400 lh-24 c-#fff'>Invitation link</div>
          <div className='ml-6 h-23 w-104 b-rd-15px bg-#333A81 text-center text-10 font-400 lh-23 c-#4959EE opacity-100'> 0xf34cc...6fefa</div>
        </div>
        <div className='h20 w-full bg-#171822'></div>
        <div className='h0 w1920 b-1px b-#373737 b-rd-0 b-solid opacity-100'></div>
        <div className='h40 w-full bg-#171822'></div>
        <div className='w1920 flex justify-between'>
          <div className='h204 w960 flex justify-between bg-#171822'>
            <button className='ml-314 inline-block h115 w136 transform cursor-pointer b-rd-15 border-none from-[#0154fa] to-[#11b5dd] bg-gradient-to-b p-0 text-white opacity-100 transition-transform active:scale-95 hover:scale-105 !hover:c-pink'>
              <div className='m-auto h16 w62 text-16 font-400 lh-16 c-#fff'>Points</div>
              <div className='m-auto mt-13 h27 w44 text-24 font-400 lh-27 c-#fff'>300</div>
            </button>
            <button className='mr-114 inline-block h115 w312 flex transform cursor-pointer justify-between b-rd-15 border-none bg-#333341 bg-gradient-to-r p-0 text-white opacity-100 transition-transform active:scale-95 hover:scale-105 !hover:c-pink'>
              <div className='flex-col text-center'>
                <div className='ml-23 mt-29 h21 text-20 font-400 lh-21 c-#fff'>Credit score</div>
                <div className='ml-26 mt-8 h27 text-24 font-400 lh-27 c-#fff'>120</div>
              </div>
              <div className='mt-15 h85 w0 b-1 b-#5e5e5e b-rd-0 b-solid opacity-100'></div>
              <div className='flex-col'>
                <div className='flex justify-between'>
                  <div className='mr-50 mt-23 h33 text-14 font-400 lh-32 c-#fff'>Initial Points</div>
                  <div className='mr-5 mt-30'>90</div>
                </div>
                <div className='flex justify-between'>
                <div className='mr-20 h33 text-14 font-400 lh-32 c-#fff'>Additional Points</div>
                <div className='mr-5 mt-8'>30</div>
                </div>
              </div>
            </button>
          </div>
          <div className='h204 w960 bg-#171822'></div>
        </div>
        <div className='h45 w-full'></div>

        <div className='ml-260 h124 flex justify-between opacity-100'>
          <div className='h79 w486 flex justify-around b-rd-14 bg-#131218 text-center'>
            <button className='mt-15 inline-block h49 w210 transform cursor-pointer b-rd-15 border-none from-[#0154fa] to-[#11b5dd] bg-gradient-to-r p-0 text-white opacity-130 transition-transform active:scale-95 hover:scale-105 !hover:c-pink'>Points details</button>
            <button className='mt-15 inline-block h49 w210 transform cursor-pointer b-rd-15 border-none bg-#333341 bg-gradient-to-r p-0 text-white opacity-100 transition-transform active:scale-95 hover:scale-105 !hover:c-pink'>NFT</button>
          </div>
          <div className='mr-260 h127 w127'>
            <img src="src/assets/images/personal-center/coin.png" alt="图呢" className='h70 w70' />
          </div>
        </div>
        <div className='h51 w-full'></div>
        <div className='ml-260 h35 flex justify-between'>
          <div className='ml-67 h16 w33 text-14 font-400 lh-16 c-#7f8fa4'>TEMI</div>
          <div className='mr-497 h16 w33 text-14 font-400 lh-16 c-#7f8fa4'>Quantify</div>
          <div></div>
        </div>
        <div className='ml-260 h68 w1400 flex justify-between b-1px b-#303241 b-rd-11 b-solid opacity-100'>
          <div className='ml-69 mt-26 h26 w200 text-center text-14 font-400 lh-16 c-#fff'>2023-10-27;10:00:52(static版)</div>
          <div className='mr-379 mt-26 h26 w81 text-center text-14 font-400 lh-16 c-#fff'>30(static版)</div>
          <div></div>
        </div>
        <div className='ml-260 h68 w1400 flex justify-between b-1px b-#303241 b-rd-11 b-solid opacity-100'>
          <div className='ml-69 mt-26 h26 w200 text-center text-14 font-400 lh-16 c-#fff'>2023-10-27;10:00:52(static版)</div>
          <div className='mr-379 mt-26 h26 w81 text-center text-14 font-400 lh-16 c-#fff'>30(static版)</div>
          <div></div>
        </div>
        <div className='ml-260 h68 w1400 flex justify-between b-1px b-#303241 b-rd-11 b-solid opacity-100'>
          <div className='ml-69 mt-26 h26 w200 text-center text-14 font-400 lh-16 c-#fff'>2023-10-27;10:00:52(static版)</div>
          <div className='mr-379 mt-26 h26 w81 text-center text-14 font-400 lh-16 c-#fff'>30(static版)</div>
          <div></div>
        </div>
        <div className='ml-260 h68 w1400 flex justify-between b-1px b-#303241 b-rd-11 b-solid opacity-100'>
          <div className='ml-69 mt-26 h26 w200 text-center text-14 font-400 lh-16 c-#fff'>2023-10-27;10:00:52(static版)</div>
          <div className='mr-379 mt-26 h26 w81 text-center text-14 font-400 lh-16 c-#fff'>30(static版)</div>
          <div></div>
        </div>
        <div className='ml-260 h68 w1400 flex justify-between b-1px b-#303241 b-rd-11 b-solid opacity-100'>
          <div className='ml-69 mt-26 h26 w200 text-center text-14 font-400 lh-16 c-#fff'>2023-10-27;10:00:52(static版)</div>
          <div className='mr-379 mt-26 h26 w81 text-center text-14 font-400 lh-16 c-#fff'>30(static版)</div>
          <div></div>
        </div>
        <div className='ml-260 h68 w1400 flex justify-between b-1px b-#303241 b-rd-11 b-solid opacity-100'>
          <div className='ml-69 mt-26 h26 w200 text-center text-14 font-400 lh-16 c-#fff'>2023-10-27;10:00:52(static版)</div>
          <div className='mr-379 mt-26 h26 w81 text-center text-14 font-400 lh-16 c-#fff'>30(static版)</div>
          <div></div>
        </div>
        <div className='ml-260 h68 w1400 flex justify-between b-1px b-#303241 b-rd-11 b-solid opacity-100'>
          <div className='ml-69 mt-26 h26 w200 text-center text-14 font-400 lh-16 c-#fff'>2023-10-27;10:00:52(static版)</div>
          <div className='mr-379 mt-26 h26 w81 text-center text-14 font-400 lh-16 c-#fff'>30(static版)</div>
          <div></div>
        </div>
      </div>

    </div>
  )
}

export default PersonalCenter
