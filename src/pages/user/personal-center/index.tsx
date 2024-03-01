import type { TabsProps } from 'antd'
import { Avatar, Button, Divider, Image, Modal, Select, Tabs, message, notification } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'

// import Address from '../loan/loan-details/components/Address'
import { ethers, formatUnits } from 'ethers'
import { useChainId, useDisconnect, useNetwork } from 'wagmi'
import PointsDetail from './components/PointsDetail'
import NftDetail from './components/NftDetai'
import useBrowserContract from '@/hooks/useBrowserContract'
import defaultAvatar from '@/assets/images/personal-center/panda.png'
import copyImg from '@/assets/images/loan-details/copy.svg'
import { TwitterService, UserInfoService } from '@/.generated/api'
import useUserStore from '@/store/userStore'
import { Models } from '@/.generated/api/models'
import toCurrencyString from '@/utils/convertToCurrencyString'
import useCoreContract from '@/hooks/useCoreContract'
import { MessageError, NotificationError } from '@/enums/error'
import { chainAddressEnums } from '@/enums/chain'
import { NotificationInfo } from '@/enums/info'
import { login } from '@/services/account'

const PersonalCenter = () => {
  const { t } = useTranslation()

  const navigate = useNavigate()

  const { browserContractService } = useBrowserContract()

  const { coreContracts, getFofBalance, canCreateNewLoan, inBlacklist, claimStatusFromFaucet, claimTokenFromFaucet } = useCoreContract()

  const [applyLoanLoading, setApplyLoanLoading] = useState(false)

  const [bindXLoading, setBindXLoading] = useState(false)

  const [activeKey, setActiveKey] = useState('1')

  const { currentUser, userLogout } = useUserStore()

  const location = useLocation()

  const { disconnect } = useDisconnect()

  const [bindModalOpen, setBindModalOpen] = useState(false)

  const chainId = useChainId()

  const { chain } = useNetwork()

  const searchParams = new URLSearchParams(window.location.search)
  console.log(searchParams)
  const isBind = searchParams.get('bind') || undefined
  console.log(isBind)
  // setBindModalOpen(isBind === 'true')

  useEffect(() => {
    async function getUserInfo() {
      if (isBind) {
        // clear()
        // disconnect()
        // countDown()
        // console.log(searchParams)
        // modal.success({
        //   title: 'This is a notification message',
        // })
        setBindModalOpen(true)
        // const user = await UserInfoService.ApiUserInfo_GET()
        // setUserInfo({ ...currentUser, ...user, id: user.userId })
      }
    }
    // location.pathname === '/personal-center' && getUserInfo()
    getUserInfo()
  }, [location])

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

  const checkLoanOrderAndUserState = async () => {
    // navigate('/apply-loan')
    // return

    try {
      if (!browserContractService)
        return

      setApplyLoanLoading(true)

      // console.log('ccno:')
      // const ccno = await canCreateNewOrder()
      // console.log('ccno:', ccno)

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

    const authLink = await TwitterService.ApiTwitterBindTwitterRequiredLogin_GET(chainId)

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

  const [userScore, setUserScore] = useState(new Models.UserScore())
  const [fofAmount, setFofAmount] = useState(0)

  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [claimOkButtonDisabled, setClaimOkButtonDisabled] = useState(false)
  const [claimOkButtonText, setClaimOkButtonText] = useState(t('claim'))
  const [claimCancelButtonHidden, setClaimCancelButtonHidden] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [claimText, setClaimText] = useState(`${t('faucet.claimText')}`)

  /**
   * check if the signer is not in blacklist, and can create a loan
   */
  const preCheckState = async () => {
    setApplyLoanLoading(true)
    const inBL = await inBlacklist()
    if (inBL) {
      message.error(MessageError.InBlacklist)
      return Promise.reject(MessageError.InBlacklist)
    }
    else {
      const canCreate = await canCreateNewLoan()
      if (canCreate) {
        navigate('/apply-loan')
      }
      else {
        notification.error({
          message: NotificationError.CannotApplyLoan,
          description: NotificationError.CannotApplyLoanDesc,
          placement: 'bottomRight',
        })
        setApplyLoanLoading(false)
        return Promise.reject(MessageError.CanNotCreateDuplicateLoan)
      }
    }
  }

  const addUsdcToWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send('wallet_watchAsset', {
      type: 'ERC20',
      options: {
        address: chainAddressEnums[chainId].usdc,
        symbol: 'USDC',
        decimals: 18,
        // "image": "https://foo.io/token-image.svg"
      },
    })
  }
  const faucetSelect = async (value: string) => {
    if (value === 'USDC') {
      const canClaim = await claimStatusFromFaucet(chainAddressEnums[chain?.id as number].usdc)
      if (!canClaim) {
        setClaimText('You have claimed the test $USDC token.')
        setClaimOkButtonDisabled(true)
      }
      setClaimModalOpen(true)
      return true
    }
    else {
      window.open(chainAddressEnums[chain?.id as number].nativeFaucetUrl, '_blank')
    }
    return true
  }
  const claim = async () => {
    if (claimOkButtonText === t('completed')) {
      setClaimOkButtonText(t('claim'))
      setClaiming(false)
      setClaimOkButtonDisabled(false)
      setClaimCancelButtonHidden(true)
      setClaimModalOpen(false)
      return true
    }

    setClaiming(true)
    setClaimOkButtonDisabled(true)
    setClaimCancelButtonHidden(true)

    try {
      await claimTokenFromFaucet(chainAddressEnums[chainId].usdc)
      setClaimOkButtonText(t('completed'))
      setClaiming(false)
      setClaimOkButtonDisabled(false)
      notification.info({
        message: NotificationInfo.ClaimInSuccessfully,
        description: NotificationInfo.ClaimInSuccessfullyDESC,
        placement: 'bottomRight',
      })
      setTimeout(() => {
        setClaimCancelButtonHidden(true)
        setClaimOkButtonText(t('claim'))
        setClaimModalOpen(false)
      }, 3000)
    }
    catch (error) {
      setClaiming(false)
      setClaimOkButtonDisabled(false)
      setClaimCancelButtonHidden(false)
    }
  }

  const setFofBalance = async () => {
    const fofBalance = await getFofBalance()
    const result = formatUnits(fofBalance, 18)
    setFofAmount(Number(result))
  }

  useEffect(() => {
    if (coreContracts) {
      async function setData() {
        const result = await UserInfoService.getUserScore(chainId)
        setUserScore(result)
      }
      setData()
      setFofBalance()
    }
  }, [coreContracts])

  return (
    isBind === 'true'
      ? <div>
        {/* <Modal open={bindModalOpen}
          okText={'OK'}
          onOk={() => {
            userLogout()
            disconnect()
            navigate('/')
          }}
          cancelButtonProps={{ disabled: true }}
        >
          <div>
            <h3>Your X acount has been bound successfully, please re-login!</h3>
          </div>
        </Modal> */}
        <Modal open={bindModalOpen}
          okText={'OK'}
          onOk={() => {
            setBindModalOpen(false)
            navigate('/personal-center')
          }}
          cancelButtonProps={{ hidden: true }}
        >
          <div>
            <h2>Congratulations!</h2>
            <h3>Your X acount has been bound successfully.</h3>
          </div>
        </Modal>
      </div >
      : <div className="flex justify-center">
        <div className='w-full'>
          <Modal open={claimModalOpen}
            onCancel={() => {
              setClaimText(t('faucet.claimText'))
              setClaiming(false)
              setClaimOkButtonDisabled(false)
              setClaimCancelButtonHidden(false)
              setClaimModalOpen(false)
            }}
            okText={claimOkButtonText}
            onOk={claim}
            okButtonProps={{ disabled: claimOkButtonDisabled, className: 'primary-btn', loading: claiming }}
            cancelButtonProps={{ hidden: claimCancelButtonHidden }}
            className='rounded-20'
          >
            <div>
              <h2>{t('faucet.title')}</h2>
              <div className='mb-30 flex items-center justify-between'>
                <div>{claimText}{chain?.name}</div>
                <button className='ml-20 h-30 rounded-20 primary-btn' onClick={addUsdcToWallet}>Add to wallet</button>
              </div>
            </div>
          </Modal>
          <Modal open={bindModalOpen}
            okText={'OK'}
            onOk={() => {
              login()
              setBindModalOpen(false)
            }}
            cancelButtonProps={{ hidden: true }}
          >
            <div>
              <h2>Congratulations!</h2>
              <h3>Your X acount has been bound successfully.</h3>
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
                <Avatar className='' shape="circle" size={140} src={currentUser.pictureUrl ?? defaultAvatar} />
              </div>
            </div>
            <div className="user-basic-box items-center">
              <div className='user-basic-info'>
                <div className=''>
                  <div className='ml-25 mt-20 text-20'>
                    {currentUser.nickName ?? 'Not Bound'}
                  </div>
                  <div className='flex items-center'>
                    <div className="ml-25 mt-20">
                      {
                        currentUser.platformName
                          ? <Link className='text-18' to={`https://twitter.com/${currentUser.platformName}`}>@{currentUser.platformName}</Link>
                          : <Button loading={bindXLoading} onClick={onBindX} className='h30 w98 rounded-15 primary-btn'>Link to X</Button>
                      }
                    </div>
                    <div className='ml-20 mt-20'>
                      <CopyToClipboard text={`${window.location.origin}/market?inviteCode=${currentUser.inviteCode}`} onCopy={() => message.success('Copied')} >
                        <div className='flex cursor-pointer'>
                          <a className='text-14 c-#307DF5' href={`${window.location.origin}/market?inviteCode=${currentUser.inviteCode}`}>Invitation Link</a>
                          <Image preview={false} width={16} height={16} className='ml-6' src={copyImg} />
                        </div>
                      </CopyToClipboard>
                    </div>
                  </div>
                  {/* <div className="mt-20">
                  {
                    currentUser.address ? <Address address={currentUser.address} /> : null
                  }
                </div> */}
                </div>
              </div>
              <div className='mt-65 items-center max-md:mt-30'>
                <div className='flex flex justify-between gap-x-10 max-md:mx-13'>
                  <Button
                    loading={applyLoanLoading}
                    onClick={preCheckState}
                    className='h40 rounded-30 primary-btn'>Apply a loan</Button>
                  <Select
                    className='h40 w120'
                    size='large'
                    defaultValue={t('faucet.title')}
                    options={[
                      { label: `Claim ${chain?.nativeCurrency.symbol}`, value: `${chain?.nativeCurrency.symbol}` },
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
                  <span>{toCurrencyString(fofAmount)}</span>
                </div>
                <div className='m-10 flex grow flex-col items-center justify-center gap-y-10 rounded-15 bg-#333341 py-10'>
                  <span>Points</span>
                  <span>{((userScore.integral?.points ?? 0) / 100).toFixed(2)}</span>
                </div>
                <div className='m-10 flex flex-col items-center justify-around gap-y-10 rounded-15 bg-#333341 py-10'>
                  <span className='text-16'>Credit score</span>
                  <span className='flex justify-center text-16'>{(userScore.credit?.totalPoints ?? 0) / 100}</span>
                </div>
                <div className='m-10 flex flex-col items-center justify-around gap-y-10 rounded-15 bg-#333341 py-10'>
                  <span className='text-16'>Initial Points</span>
                  <span className='flex justify-center text-16'>{(userScore.credit?.initialPoints ?? 0) / 100}</span>
                </div>
                <div className='m-10 flex flex-col items-center justify-around gap-y-10 rounded-15 bg-#333341 py-10'>
                  <span className='text-16'>Additional Points</span>
                  <span className='flex justify-center text-16'>{(userScore.credit?.additionalPoints ?? 0) / 100}</span>
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
