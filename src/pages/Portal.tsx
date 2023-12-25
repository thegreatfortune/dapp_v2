import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

// import { Image } from 'antd'
import homePageImage from '../assets/images/portalImages/homepage.png'
import TinyImage from '../assets/images/portalImages/portalImagesTiny.png'
import frame1Image from '../assets/images/portalImages/loanNoteFrame1.png'
import frame2Image from '../assets/images/portalImages/loanNoteFrame2.png'
import frame3Image from '../assets/images/portalImages/loanNoteFrame3.png'
import trading1Image from '../assets/images/portalImages/loanNoteTrading1.png'
import trading2Image from '../assets/images/portalImages/loanNoteTrading2.png'
import trading3Image from '../assets/images/portalImages/loanNoteTrading3.png'
import note1Image from '../assets/images/portalImages/loanNote1.jpg'
import note2Image from '../assets/images/portalImages/loanNote2.jpg'
import note3Image from '../assets/images/portalImages/loanNote3.jpg'
import noteCoin1 from '../assets/images/portalImages/loanNoteCoin1.png'
import noteCoin2 from '../assets/images/portalImages/loanNoteCoin2.png'
import noteCoin3 from '../assets/images/portalImages/loanNoteCoin3.png'
import pledgesImage from '../assets/images/portalImages/pledges.png'
import quotationsImage from '@/assets/images/portalImages/marketQuotations.png'

const Portal = () => {
  const { t } = useTranslation()
  //   const navigate = useNavigate()

  return (
        <div>
            <div className="h-20rem w-full"></div>
            <div className="relative flex justify-between">
                <div className="absolute z-3 pt-5rem text-16rem font-500 lh-21rem not-italic c-#fff">{`${t('portal.title.theme1')}`}</div>
                <div className="float-left mt-12.5rem">
                    <div className="z-2 mt-12.5rem h-81 w-753 flex-content-between pt-12.5rem text-26 font-400 lh-34 c-gray opacity-100">{`${t('portal.title.annotate1')}`}</div>
                    <NavLink to="/market" ><button className="mt-100 h-92 w-324 justify-between b-rd-8 text-24 c-#fff primary-btn" >{`${t('portal.login.button')}`}</button></NavLink>

                </div>
                <img src={ homePageImage } className='float-right'/>
            </div>
            <div className="h-20rem w-full"></div>
            <div>
                <img src="/src/assets/images/portalImages/advertising.jpg" alt="" />
            </div>
            <div className="h-6.75rem w-full"></div>
            <div className="h-43"></div>
            <div className="h-17.5rem w-full"></div>
            <div className="flex justify-between">
                <div className="relative">
                    <img src={ quotationsImage } className='absolute z-1'/>
                    <div className="absolute z-2 float-right ml-574 mt-219 h-143 w-297 transform transition-transform active:scale-95 hover:scale-105">
                        <img src={ TinyImage } className='absolute z-3'/>
                        <button className="absolute z-4 float-right m-auto ml-223 mt-104 h-25 w-46 b-rd-30px text-center text-12 lh-25 opacity-100 primary-btn">{`${t('portal.swap.button')}`}</button>
                    </div>
                </div>
                <div className="">
                    <div className="mr-auto h-192 w-440 text-64 font-500 lh-96 c-#fff">{`${t('portal.title.theme2')}`}</div>
                    <div className="h-10rem"></div>
                    <div className="mr-1 h-103 w-515 text-26 font-400 lh-8.55rem c-gray opacity-100">{`${t('portal.title.annotate2')}`}</div>
                    <div className="h-12.5rem"></div>
                    <NavLink to="/market"><button className="ml-30 h-92 w-324 b-rd-8 text-24 c-#fff primary-btn">{`${t('portal.login.button')}`}</button></NavLink>
                </div>
            </div>
            <div className="h-43rem w-full"></div>
            <div className="relative flex flex-col justify-center flex-items-center">
                <div className="text-16rem font-500 lh-18.55rem c-#fff">{`${t('portal.title.theme3')}`}</div>

                <div className="h-12.5rem"></div>
                <div className="text-7rem font-400 lh-8.55rem text-slate-300">{`${t('portal.title.annotate3')}`}</div>
            </div>

            <div className="flex justify-around">
                <div className="flex transform transition-transform active:scale-95 hover:scale-105">
                    <img src={ frame1Image } alt="" className="relative z-1 mt-200 h535 w393" />
                    <img src={ trading1Image } alt="" className="absolute z-2 ml-28 mt-538 h-23 w-151 text-24" />
                    <img src={ note1Image } alt="1" className="absolute z-3 ml-51 mt-242" />
                    <img src={ noteCoin1 } alt="1" className="absolute z-4 ml-26 mt-649" />
                    <div className="absolute z-5 m-a ml-230 mt-671 h-30 w-110 b-rd-8 text-center lh-30 primary-btn">{`${t('portal.follow.button')}`}</div>
                </div>
                <div className="flex transform transition-transform active:scale-95 hover:scale-105">
                    <img src={ frame2Image } alt="" className="relative z-1 mt-80 h655 w454" />
                    <img src={ trading2Image } alt="" className="absolute z-2 ml-28 mt-488 h-23 w-171 text-24" />
                    <img src={ note2Image } alt="1" className="absolute z-2 ml-61 mt-143" />
                    <img src={ noteCoin2 } alt="1" className="absolute z-3 ml-32 mt-637" />
                    <div className="absolute z-4 m-a ml-265 mt-661 h-30 w-110 b-rd-8 text-center lh-30 primary-btn">{`${t('portal.follow.button')}`}</div>
                </div>
                <div className="flex transform transition-transform active:scale-95 hover:scale-105">
                    <img src={ frame3Image } alt="" className="relative z-1 mt-200 h535 w393" />
                    <img src={ trading3Image } alt="" className="absolute z-2 ml-28 mt-538 h-23 w-151 text-24" />
                    <img src={ note3Image } className="absolute z-3 ml-51 mt-242" />
                    <img src={ noteCoin3 } alt="1" className="absolute z-4 ml-26 mt-649" />
                    <div className="absolute z-5 m-a ml-230 mt-671 h-30 w-110 b-rd-8 text-center lh-30 primary-btn">{`${t('portal.follow.button')}`}</div>
                </div>
            </div>

            <div className="h-80 w-full"></div>
            <div className="h-full w-full">
                <div className="m-auto h-79 w-750 flex text-center text-28 font-400 lh-44 text-slate-300">{`${t('portal.title.annotate4')}`}</div>
                <div className="h-50"></div>
                <NavLink to="/market"><button className="m-auto ml-538 h-92 w-324 b-rd-8 text-24 c-#fff primary-btn">{`${t('portal.loan.button')}`}</button></NavLink>
            </div>
            <div className="h-140 w-full"></div>
            <div>
                <div className="m-auto h-75 w-492 text-center text-64 font-500 c-#fff">{`${t('portal.title.theme4')}`}</div>
                <div className="h-100 w-full"></div>
            </div>
            <div className="flex justify-around">
                <div className="h-420 w-413 flex flex-col transform rounded-30 bg-#213f84 bg-opacity-40 transition-transform active:scale-95 hover:scale-105 hover:bg-opacity-150">
                    <div className="h-66 w-full"></div>
                    <div className="relative">
                        <div className="absolute z-2 m-auto ml-170 h-35 w-60 b-rd-0 b-rd-0 bg-#3f6ccc pt-20 text-center">1</div>
                        <div className="absolute z-1 m-auto ml-176 mt-4 h-35 w-60 b-rd-0 b-rd-0 bg-#274892 pt-20 text-center"></div>
                    </div>
                    <div className="h-84 w-full"></div>
                    <div className="m-auto mt-50 h-36 w-249 text-center text-28 font-500 lh-36 c-#fff">{`${t('portal.follow.way1')}`}</div>
                    <div className="h-42 w-full"></div>
                    <div className="m-auto mb-70 h-55 w-264 text-center text-16 font-400 lh-24 text-slate-200">{`${t('portal.follow.annotate1')}`}</div>
                </div>
                <div className="h-420 w-413 flex flex-col transform rounded-30 bg-#213f84 bg-opacity-40 transition-transform active:scale-95 hover:scale-105 hover:bg-opacity-150">
                    <div className="h-66"></div>
                    <div className="relative">
                        <div className="absolute z-2 m-auto ml-170 h-35 w-60 b-rd-0 b-rd-0 bg-#3f6ccc pt-20 text-center">2</div>
                        <div className="absolute z-1 m-auto ml-176 mt-4 h-35 w-60 b-rd-0 b-rd-0 bg-#274892 pt-20 text-center"></div>
                    </div>
                    <div className="h-84"></div>
                    <div className="m-auto mt-50 h-36 w-300 text-center text-28 font-500 lh-36 c-#fff">{`${t('portal.follow.way2')}`}</div>
                    <div className="h-42"></div>
                    <div className="m-auto mb-70 h-55 w-280 text-center text-16 font-400 lh-24 text-slate-200">{`${t('portal.follow.annotate2')}`}</div>
                </div>
                <div className="h-420 w-413 flex flex-col transform rounded-30 bg-#213F84 bg-opacity-40 transition-transform active:scale-95 hover:scale-105 hover:bg-opacity-150">
                    <div className="h-66"></div>
                    <div className="relative">
                        <div className="absolute z-2 m-auto ml-170 h-35 w-60 b-rd-0 b-rd-0 bg-#3f6ccc pt-20 text-center">3</div>
                        <div className="absolute z-1 m-auto ml-176 mt-4 h-35 w-60 b-rd-0 b-rd-0 bg-#274892 pt-20 text-center"></div>
                    </div>
                    <div className="h-84"></div>
                    <div className="m-auto mt-50 h-36 w-249 text-center text-28 font-500 lh-36 c-#fff">{`${t('portal.follow.way3')}`}</div>
                    <div className="h-42"></div>
                    <div className="m-auto mb-70 h-55 w-364 text-center text-16 font-400 lh-24 text-slate-200">{`${t('portal.follow.annotate3')}`}</div>
                </div>
            </div>
            <div className="h-35rem"></div>
            <div className="flex justify-between">
                <div className="relative">
                    <div className="opacity absolute z-1 mt-10.25rem h-664 w-473 transform rounded-30 bg-#2159e9 transition-transform active:scale-95 hover:scale-105"></div>
                    <img src={ pledgesImage } alt="" className="absolute z-2 float-inherit ml-10.25rem transform transition-transform active:scale-95 hover:scale-105" />
                </div>
                <div>
                    <div className="mr-12 h-75 w-775 text-64 font-500 lh-74 c-#fff">{`${t('portal.title.theme5')}`}</div>
                    {/* <div className="b-1 b-#FFF b-solid"></div> */}
                    <div className="h-64"></div>
                    <div className="h-664 w-793 overscroll-y-auto !overflow-scroll">
                        <div className="mb-50 h-52 w-900 text-24 font-400 lh-36 c-#fff">{`${t('portal.pledges1')}`}</div>
                        <div className="mb-50 h-52 w-900 text-24 font-400 lh-36 c-#fff">{`${t('portal.pledges2')}`}</div>
                        <div className="mb-50 h-52 w-900 text-24 font-400 lh-36 c-#fff">{`${t('portal.pledges3')}`}</div>
                        <div className="mb-50 h-52 w-900 text-24 font-400 lh-36 c-#fff">{`${t('portal.pledges4')}`}</div>
                        <div className="mb-50 h-52 w-900 text-24 font-400 lh-36 c-#fff">{`${t('portal.pledges5')}`}</div>
                        <div className="mb-50 h-52 w-900 text-24 font-400 lh-36 c-#fff">{`${t('portal.pledges6')}`}</div>
                        <div className="mb-50 h-52 w-900 text-24 font-400 lh-36 c-#fff">{`${t('portal.pledges7')}`}</div>
                        <div className="mb-50 h-52 w-900 text-24 font-400 lh-36 c-#fff">{`${t('portal.pledges8')}`}</div>
                        <div className="mb-50 h-52 w-900 text-24 font-400 lh-36 c-#fff">{`${t('portal.pledges9')}`}</div>
                        <div className="mb-50 h-52 w-900 text-24 font-400 lh-36 c-#fff">{`${t('portal.pledges10')}`}</div>

                    </div>
                </div>
            </div>
            <div className="h-63 w-66">

            </div>
        </div>
  )
}
export default Portal
