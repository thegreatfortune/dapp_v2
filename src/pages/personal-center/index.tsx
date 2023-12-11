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
<<<<<<< HEAD
        message.warning(`order cant not repetition create :${orderCanCreatedAgain}`)
=======
        message.warning('order can not repetition create')
>>>>>>> dev-Personal
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
<<<<<<< HEAD
    <div>
      <div className='z-1 flex justify-between bg-#171822'>
        <div className='relative'>
          <img src="src/assets/images/Ellipse 795.png" alt="头像" className='absolute z-2' />
          <div className='relative flex'>
            <div className='z-3 ml-166 mt-91 h-31 w-179 text-32 font-400 lh-31'>bu.darmani1</div>
            <div className='absolute z-4 float-left ml-166 mt-137 h-18 w-80 font-400 c-#9fa0a4 opacity-60'>@Artist</div>
            <div className='absolute float-right m-a ml-394 mt-96 h-23 w-104 b-rd-15px bg-#333A81 text-center text-10 font-400 lh-23 c-#4959EE opacity-100'> 0xf34cc...6fefa</div>
          </div>

<<<<<<< HEAD
        </div>
=======
      <Button loading={loading} type="primary" onClick={checkLoanOrderAndUserState}>
        Apply for a loan666
      </Button>
>>>>>>> master

        <div className='w-496 flex justify-between'>
          <Button loading={loading}
            type="primary" onClick={checkLoanOrderAndUserState}
            className='mr-76 mt-107 inline-block h-60 w-254 transform cursor-pointer b-rd-54px border-none bg-gradient-to-r p-0 font-400 lh-27 text-#000 transition-transform active:scale-95 hover:scale-105 !bg-#D9D9D9 !font-400 !hover:c-pink'>
            Apply for a loan
          </Button>

          <Button type="primary" onClick={reSet}
            className='mt-107 inline-block h-60 w-117 transform cursor-pointer b-rd-54 border-none from-[#0154fa] to-[#11b5dd] bg-gradient-to-r p-0 text-18 font-400 lh-27 text-white transition-transform active:scale-95 hover:scale-105 !hover:c-pink'>
            Follow</Button>
          <div className='w-76'></div>
        </div>
       <div className='h-full w-full bg-#171822'>
       <div className='absolute mt-222 w-220 flex justify-between bg-#171822'>
          <div className='h-24 w-110 text-16 font-400 lh-24 c-#fff'>Invitation link</div>
          <div className='h-23 w-104 b-rd-15px bg-#333A81 text-center text-10 font-400 lh-23 c-#4959EE opacity-100'> 0xf34cc...6fefa</div>
        </div>
       </div>
      </div>
      <div className='h-55'></div>
=======
    <div className='flex justify-around'>
      <img src="src/assets/images/personal-center/navImage.png" alt="" className='h-368 w-1920'/>
      <div className='absolute flex justify-between'>
      <Button loading={loading} type="primary" onClick={checkLoanOrderAndUserState} className=''>
        Apply for a loan666
      </Button>
       <Button type="primary" onClick={reSet} className=''>reSet</Button>
      </div>
>>>>>>> master

    </div>
  )
}

export default PersonalCenter
