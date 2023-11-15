import Avatar from 'antd/es/avatar'
import Button from 'antd/es/button'
import { useNavigate } from 'react-router-dom'
import type { Models } from '@/.generated/api/models'

interface CardProps {
  item: Models.LoanOrderVO
}

interface CustomAvatarProps {
  src: string
  name: string
  twitter: string
}

const InfoCard = () => {
  const navigate = useNavigate()

  return (
        <div className="box-border h-419 w-321 flex flex-col border-2 border-#303241 rounded-16 border-solid bg-[#171822] p-24">
            <img
                src=''
                alt=''
                className="h-232 w-266 rounded-16 object-cover"
            />
            <div className='text-left'>
                <div className='h11 w-full'></div>

                <div className='flex justify-between'>
                    <ul className='m0 flex flex-col list-none gap-8 p0'>
                        <li className='h18 flex flex-col text-14 c-#999999'>
                            bu.d1
                        </li>
                        <li className='h29 text-16 c-#FFFFFF'>
                            @aaa
                        </li>
                        <li>
                          100
                        </li>
                    </ul>

                </div>
            </div>
        </div>
  )
}

export default InfoCard
