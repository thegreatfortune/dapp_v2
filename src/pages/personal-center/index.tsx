import type { TabsProps } from 'antd'
import { Avatar, Button, Divider, Image, Tabs, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'
import Address from '../loan/loan-details/components/Address'
import PointsDetail from './components/PointsDetail'
import useBrowserContract from '@/hooks/useBrowserContract'
import Navbar from '@/layouts/BasicLayout/Navbar'
import defaultAvatar from '@/assets/images/personal-center/panda.png'
import { TwitterService, UserInfoService } from '@/.generated/api'
import useUserStore from '@/store/userStore'
import { Models } from '@/.generated/api/models'

const PersonalCenter = () => {
  const { t } = useTranslation()

  const navigate = useNavigate()

  const { browserContractService } = useBrowserContract()

  const [applyLoanLoading, setApplyLoanLoading] = useState(false)

  const [bindXLoading, setBindXLoading] = useState(false)

  const [activeKey, setActiveKey] = useState('1')

  const { activeUser } = useUserStore()

  const [totalScoreVo, setTotalScoreVo] = useState(new Models.TotalScoreVo())

  // TODO 绑定推特后更新信息

  useEffect(() => {
    async function fetchData() {
      const res = await UserInfoService.ApiUserInfoTotalScoreInfo_GET()
      setTotalScoreVo(res)
    }

    fetchData()
  }, [])

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Points detail',
      children: <PointsDetail/>,
    },
    {
      key: '2',
      label: 'NFT',
      children: <div>NFT</div>,
    },
  ]

  useEffect(() => {
    if (!activeUser.accessToken) {
      navigate(-1)
      message.warning('not logged in')
    }
  }, [activeUser])

  const checkLoanOrderAndUserState = async () => {
    try {
      if (!browserContractService)
        return

      setApplyLoanLoading(true)
      const processCenterContract = await browserContractService?.getProcessCenterContract()

      const orderCanCreatedAgain = await browserContractService?.checkOrderCanCreateAgain()

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
      setApplyLoanLoading(false)
    }
  }

  async function onBindX() {
    setBindXLoading(true)
    const authLink = await TwitterService.ApiTwitterBindTwitterRequiredLogin_GET()

    setBindXLoading(false)

    window.open(authLink.authLink_uri)
  }

  const renderTabBar: TabsProps['renderTabBar'] = (props): React.ReactElement => {
    return (<div className='mb-10'>
      <div className='h79 w486 flex items-center justify-center gap-x-30 rounded-14 bg-#12131d text-center' >
        <div className={`h49 w210 rounded-10 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '1' && 'primary-btn'}`} onClick={() => setActiveKey('1')} >Points detail</div>
        <div className={` h49 w210 rounded-10 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '2' && 'primary-btn'}`} onClick={() => setActiveKey('1')} >NFT</div>
      </div>
    </div>)
  }

  return (
    <div >
      <div className="h368 bg-cover bg-no-repeat" style={{ backgroundImage: 'url(src/assets/images/personal-center/bg-header.jpg)' }}>
        <div className="m-x-a w1400"><Navbar title={t('nav.title')} showInput={false} /></div>
      </div>

      <div className="h338 bg-#171822">
        <div className="relative mx-a box-border h-131 w1400 p-x-30">
          <div className="absolute top--80 h160 w160 rounded-160 bg-#171822">
            <Avatar className='left-10 top-10' shape="circle" size={140} src={activeUser.pictureUrl ?? defaultAvatar} />
          </div>

          <div className='absolute left-210 top-15 w-1130 flex items-end justify-between'>

            <div>
              <div className='flex items-center'>
                <span className='text-24'>
                  {
                    activeUser.nickName ?? 'Not bound'
                  }
                </span>

                <div className="w10" />
                {
                  activeUser.address ? <Address address={activeUser.address} /> : null
                }

              </div>

              <div className="h12" />

              {
                activeUser.platformName
                  ? <Link className='text-18' to={`https://twitter.com/${activeUser.platformName}`}>@{ activeUser.platformName}</Link>
                  : <Button loading={bindXLoading} onClick={onBindX} className='h30 w98 rounded-15 primary-btn'>Link to X</Button>
              }
            </div>

            <div className='flex gap-x-50'>
              <Button loading={applyLoanLoading} onClick={checkLoanOrderAndUserState} className='h48 w172 rounded-30 primary-btn'>Apply for a loan</Button>

              <Button className='h48 w120 rounded-30 primary-btn'>Follow</Button>
            </div>

          </div>

        </div>

        <div className='mx-a box-border h207 w1400 px-30'>
          <div className='h30 flex lh-30'>
            Invitation link：
            <div className='text-12'>

              <CopyToClipboard text={`${window.location.origin}/market?inviteCode=${activeUser.inviteCode}`} onCopy={() => message.success('Copied')} >
                  <div className='cursor-pointer'>
                  <span className='c-#307DF5'> {`${window.location.origin}/market?inviteCode=${activeUser.inviteCode}`}</span>
                  <Image preview={false} width={10} height={10} className='ml-6' src='src/assets/images/loan-details/copy.svg' />
                  </div>
              </CopyToClipboard>

            </div>
          </div>

          <div className="h12" />

          <Divider className='m0 bg-#373737 p0' type='horizontal' />

          <div className="h30" />

          <div className='h-115 flex'>
            <div className='h-full w-136 flex flex-col items-center justify-center gap-y-13 rounded-15 from-blue-500 to-blue-300 bg-gradient-to-b'>
              <span>Points</span>
              <span>{ ((totalScoreVo.integral?.points ?? 0) / 100).toFixed(2) }</span>
            </div>

            <div className="w50" />

            <div className="h-full w-312 flex items-center rounded-15 bg-#333341 pl-21">
              <div className='w133 flex flex-col items-center'>
                <span className='text-20'>Credit score</span>
                <span className='text-24'>{(totalScoreVo.credit?.totalPoints ?? 0) / 100}</span>
              </div>

              <Divider className='h-85' type='vertical' />

              <div className='w-164 flex flex-col items-center gap-y-16 pr-35 text-14'>
                <ul className='m0 w-full flex list-none justify-between p0'>
                  <li>Initial Points</li>
                  <li>{(totalScoreVo.credit?.initialPoints ?? 0) / 100}</li>
                </ul>

                <ul className='m0 w-full flex list-none justify-between p0'>
                  <li>Additional Points</li>
                  <li>{(totalScoreVo.credit?.additionalPoints ?? 0) / 100}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="h50" />

      <div className='m-x-a w-1400'>
        <Tabs defaultActiveKey="1" items={items} activeKey={activeKey} onChange={key => setActiveKey(key)} renderTabBar={renderTabBar} />
      </div>

    </div>
  )
}

export default PersonalCenter
