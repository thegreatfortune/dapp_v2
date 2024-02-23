import type { TabsProps } from 'antd'
import { Avatar, Button, Divider, Image, Modal, Select, Tabs, message } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'

// import Address from '../loan/loan-details/components/Address'
import { formatUnits } from 'ethers'
import PointsDetail from './components/PointsDetail'
import NftDetail from './components/NftDetai'
import useBrowserContract from '@/hooks/useBrowserContract'
import defaultAvatar from '@/assets/images/personal-center/panda.png'
import copyImg from '@/assets/images/loan-details/copy.svg'
import { TwitterService, UserInfoService } from '@/.generated/api'
import useUserStore from '@/store/userStore'
import { Models } from '@/.generated/api/models'
import toCurrencyString from '@/utils/convertToCurrencyString'

const PersonalCenter = () => {
  const { t } = useTranslation()

  const navigate = useNavigate()

  const { browserContractService } = useBrowserContract()

  const [applyLoanLoading, setApplyLoanLoading] = useState(false)

  const [bindXLoading, setBindXLoading] = useState(false)

  const [activeKey, setActiveKey] = useState('1')

  const { activeUser, setUserInfo } = useUserStore()

  const [totalScoreVo, setTotalScoreVo] = useState(new Models.TotalScoreVo())

  const location = useLocation()

  const [fofBalance, setFofBalance] = useState(0)

  const setBalance = async () => {
    const fofBalance = await browserContractService?.getFofBalance()
    const result = formatUnits(fofBalance ?? 0, 18)
    setFofBalance(Number(result))
  }

  useEffect(() => {
    setBalance()
  }, [browserContractService])

  useEffect(() => {
    async function getUserInfo() {
      const searchParams = new URLSearchParams(location.search)
      const isBind = searchParams.get('bind') || undefined
      if (isBind) {
        const user = await UserInfoService.ApiUserInfo_GET()
        setUserInfo({ ...activeUser, ...user, id: user.userId })
      }
    }
    // location.pathname === '/personal-center' && getUserInfo()
    getUserInfo()
  }, [location])

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
      label: 'NFT',
      children: <NftDetail />,
    },
    {
      key: '2',
      label: 'Points detail',
      children: <PointsDetail />,
    },
  ]

  // useEffect(() => {
  //   if (!activeUser.accessToken) {
  //     navigate(-1)
  //     message.warning('not logged in')
  //   }
  // }, [activeUser])

  const checkLoanOrderAndUserState = async () => {
    // navigate('/apply-loan')
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
      // navigate('/trade')
      else
        message.warning('Order can not be created: There is an un-liquidate order!')
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
      <div className='h80 flex items-center gap-x-30 rounded-14 bg-#12131d px-30 text-center' >
        <div className={`w-200 h50 max-md:w-1/2 rounded-10 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '1' && 'primary-btn'}`} onClick={() => setActiveKey('1')} >NFT</div>
        <div className={`w-200 h50 max-md:w-1/2 rounded-10 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '2' && 'primary-btn'}`} onClick={() => setActiveKey('2')} >Points detail</div>
      </div>
    </div>)
  }

  const [usdcModelOpen, setUsdcModelOpen] = useState(false)
  const [faucetText, setFaucetText] = useState('Claim')
  const [executing, setExecuting] = useState(false)
  const [hiddenCancel, setHiddenCancel] = useState(false)

  const addUsdcToWallet = async () => {
    const signer = browserContractService?.getSigner

    await signer?.provider.send('wallet_watchAsset', {
      type: 'ERC20',
      options: {
        address: '0x8f78aAF91dea7D38acF813c9C121F648d20c1c0F',
        symbol: 'USDC',
        decimals: 18,
        // "image": "https://foo.io/token-image.svg"
      },
    })
  }

  const faucetSelect = async (value: string) => {
    if (value === 'USDC') {
      setUsdcModelOpen(true)
      return true
    }
    else {
      window.open('https://mumbaifaucet.com/', '_blank')
    }
    return true
  }

  async function claimUsdc() {
    if (faucetText === 'Completed!') {
      setFaucetText('Claim')
      setHiddenCancel(false)
      setUsdcModelOpen(false)
      return true
    }

    setExecuting(true)

    const res = await browserContractService?.followFaucetClaim(import.meta.env.VITE_USDC_TOKEN)

    try {
      if (res?.status === 1) {
        ///
        setTimeout(() => {
          setFaucetText('Completed!')
          setHiddenCancel(true)
          setExecuting(false)
        }, 3000)
      }
    }
    catch {
      message.error('Transaction failed')
    }
  }

  return (
    <div className="flex justify-center">
      <div className='w-full'>
        <Modal open={usdcModelOpen}
          onCancel={() => setUsdcModelOpen(false)}
          okText={faucetText}
          onOk={claimUsdc}
          okButtonProps={{ disabled: executing, className: 'primary-btn' }}
          cancelButtonProps={{ hidden: hiddenCancel }}
          className='rounded-20'
        >
          <div>
            <h2>Faucet</h2>
            <div className='mb-30 flex items-center justify-between'>
              <div>You will receive 2,000 USDC on Polygon mumbai!</div>
              <button className='ml-20 h-30 rounded-20 primary-btn' onClick={addUsdcToWallet}>Add to wallet</button>
            </div>
          </div>
        </Modal>
        <div
          className="personal-banner"
          style={{ backgroundImage: 'url(/static/bg-header.jpg)' }}
        >
        </div>

        <div className="w-full">
          <div className='relative'>
            <div className="absolute left-10 top--80 rounded-100 bg-#171822">
              <Avatar className='' shape="circle" size={140} src={activeUser.pictureUrl ?? defaultAvatar} />
            </div>
          </div>
          <div className="user-basic-box items-center">
            <div className='user-basic-info'>
              <div className=''>
                <div className='ml-25 mt-20 text-20'>
                  {activeUser.nickName ?? 'Not Bound'}
                </div>
                <div className='flex items-center'>
                  <div className="ml-25 mt-20">
                    {
                      activeUser.platformName
                        ? <Link className='text-18' to={`https://twitter.com/${activeUser.platformName}`}>@{activeUser.platformName}</Link>
                        : <Button loading={bindXLoading} onClick={onBindX} className='h30 w98 rounded-15 primary-btn'>Link to X</Button>
                    }
                  </div>
                  <div className='ml-20 mt-20'>
                    <CopyToClipboard text={`${window.location.origin}/market?inviteCode=${activeUser.inviteCode}`} onCopy={() => message.success('Copied')} >
                      <div className='flex cursor-pointer'>
                        <a className='text-14 c-#307DF5' href={`${window.location.origin}/market?inviteCode=${activeUser.inviteCode}`}>Invitation Link</a>
                        <Image preview={false} width={16} height={16} className='ml-6' src={copyImg} />
                      </div>
                    </CopyToClipboard>
                  </div>
                </div>
                {/* <div className="mt-20">
                  {
                    activeUser.address ? <Address address={activeUser.address} /> : null
                  }
                </div> */}
              </div>
            </div>
            <div className='mt-65 items-center max-md:mt-30'>
              <div className='flex flex justify-between gap-x-10 max-md:mx-13'>
                <Button
                  loading={applyLoanLoading}
                  onClick={checkLoanOrderAndUserState}
                  className='h40 w130 rounded-30 primary-btn'>Apply for a loan</Button>
                <Select
                  className='h40 w120'
                  size='large'
                  defaultValue='Faucet'
                  options={[
                    { label: 'Claim Matic', value: 'Matic' },
                    { label: 'Claim USDC', value: 'USDC' },
                  ]}
                  onSelect={faucetSelect}
                ></Select>
              </div>
            </div>

          </div>

          <Divider></Divider>
          <div className='mt-30 box-border items-center'>
            <div className='point-box'>
              <div className='m-10 flex grow flex-col items-center justify-center gap-y-10 rounded-15 bg-#333341 py-10'>
                <span>$FOF</span>
                <span>{toCurrencyString(fofBalance)}</span>
              </div>
              <div className='m-10 flex grow flex-col items-center justify-center gap-y-10 rounded-15 bg-#333341 py-10'>
                <span>Points</span>
                <span>{((totalScoreVo.integral?.points ?? 0) / 100).toFixed(2)}</span>
              </div>
              <div className='m-10 flex flex-col items-center justify-around gap-y-10 rounded-15 bg-#333341 py-10'>
                <span className='text-16'>Credit score</span>
                <span className='flex justify-center text-16'>{(totalScoreVo.credit?.totalPoints ?? 0) / 100}</span>
              </div>
              <div className='m-10 flex flex-col items-center justify-around gap-y-10 rounded-15 bg-#333341 py-10'>
                <span className='text-16'>Initial Points</span>
                <span className='flex justify-center text-16'>{(totalScoreVo.credit?.initialPoints ?? 0) / 100}</span>
              </div>
              <div className='m-10 flex flex-col items-center justify-around gap-y-10 rounded-15 bg-#333341 py-10'>
                <span className='text-16'>Additional Points</span>
                <span className='flex justify-center text-16'>{(totalScoreVo.credit?.additionalPoints ?? 0) / 100}</span>
              </div>
            </div>
          </div>
        </div>
        <Divider></Divider>
        <div className="h30" />

        <div className='m-x-a'>
          <Tabs defaultActiveKey="1" items={items} activeKey={activeKey} onChange={key => setActiveKey(key)} renderTabBar={renderTabBar} />
        </div>
      </div>
    </div >
  )
}

export default PersonalCenter
