import type { TabsProps } from 'antd'
import { Avatar, Button, Divider, Image, Modal, Select, Tabs, message } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'ethers'
import { useChainId, useNetwork } from 'wagmi'
import PointsDetail from './components/PointsDetail'
import NftDetail from './components/NftDetail'
import FaucetModal from './components/Modals/Faucet'
import defaultAvatar from '@/assets/images/personal-center/panda.png'
import copyImg from '@/assets/images/loan-details/copy.svg'
import { TwitterService, UserInfoService } from '@/.generated/api'
import useUserStore from '@/store/userStore'
import { Models } from '@/.generated/api/models'
import toCurrencyString from '@/utils/convertToCurrencyString'
import useCoreContract from '@/hooks/useCoreContract'
import { ChainAddressEnums } from '@/enums/chain'
import usePreApplyCheck from '@/helpers/usePreApplyCheck'
import useTokenBalance from '@/hooks/useTokenBalance'
import { handlePreCheckState } from '@/helpers/helpers'

const PersonalCenter = () => {
  const { t } = useTranslation()

  const navigate = useNavigate()

  const { coreContracts } = useCoreContract()
  const { fofBalance } = useTokenBalance()

  // const [applyLoanLoading, setApplyLoanLoading] = useState(false)

  const [bindXLoading, setBindXLoading] = useState(false)

  const [activeKey, setActiveKey] = useState('1')

  const { currentUser, userLogin } = useUserStore()

  const location = useLocation()

  const [bindModalOpen, setBindModalOpen] = useState(false)

  const chainId = useChainId()

  const { chain } = useNetwork()

  const searchParams = new URLSearchParams(window.location.search)
  const isBind = searchParams.get('bind') || undefined

  useEffect(() => {
    async function getUserInfo() {
      if (isBind) {
        setBindModalOpen(true)
        const userInfo = await UserInfoService.getUserInfo(chainId)
        userLogin({ ...currentUser, ...userInfo })
      }
    }
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

  async function onBind() {
    setBindXLoading(true)

    const authLink = await TwitterService.ApiTwitterBindTwitterRequiredLogin_GET(chainId)

    setBindXLoading(false)

    window.open(authLink.authLink_uri)
  }

  const renderTabBar: TabsProps['renderTabBar'] = (props): React.ReactElement => {
    return (<div className='mb-10'>
      <div className='h80 flex items-center gap-x-30 rounded-8 bg-#12131d px-30 text-center' >
        <div className={`text-18 font-semibold w-200 h50 max-md:w-1/2 rounded-8 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '1' && 'primary-btn'}`}
          onClick={() => setActiveKey('1')} >NFT</div>
        <div className={`text-18 font-semibold w-200 h50 max-md:w-1/2 rounded-8 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '2' && 'primary-btn'}`}
          onClick={() => setActiveKey('2')} >Points detail</div>
      </div>
    </div>)
  }

  const [userScore, setUserScore] = useState(new Models.UserScore())
  const [fofAmount, setFofAmount] = useState(0)

  const [faucetModalOpen, setFaucetModalOpen] = useState(false)

  const { inBlacklist, canCreateLoan, checked } = usePreApplyCheck()
  const [applyed, setApplyed] = useState(false)
  /**
   * check if the signer is not in blacklist, and can create a loan
   */
  const preCheckState = async () => {
    if (handlePreCheckState(inBlacklist, canCreateLoan))
      navigate('/apply-loan')
  }

  const faucetSelect = async (value: string) => {
    if (value === 'USDC')
      setFaucetModalOpen(true)
    else
      window.open(ChainAddressEnums[chain?.id as number].nativeFaucetUrl, '_blank')
  }

  useEffect(() => {
    setFofAmount(Number(formatUnits(fofBalance, 18)))
  }, [fofBalance])

  useEffect(() => {
    if (coreContracts) {
      async function setData() {
        const result = await UserInfoService.getUserScore(chainId)
        setUserScore(result)
      }
      setData()
      // setFofBalance()
    }
  }, [coreContracts])

  useEffect(() => {
    if (checked && applyed) {
      preCheckState()
      setApplyed(false)
    }
  }, [checked, applyed])

  return (
    isBind === 'true'
      ? <div>
        <Modal open={bindModalOpen}
          okText={'OK'}
          onOk={() => {
            setBindModalOpen(false)
            navigate('/personal-center')
          }}
          title='Congratulations!'
          cancelButtonProps={{ hidden: true }}
        >
          <div>
            <h3>Your X acount has been bound successfully!</h3>
          </div>
        </Modal>
      </div >
      : (<div className="flex justify-center">
        <div className='w-full'>
          <FaucetModal open={faucetModalOpen}
            setOpen={setFaucetModalOpen}
          ></FaucetModal>
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
                          : <Button loading={bindXLoading} onClick={onBind} className='h30 w98 rounded-15 primary-btn' type='primary'>Link to X</Button>
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
                </div>
              </div>
              <div className='mt-65 items-center max-md:mt-30'>
                <div className='flex flex items-center justify-between gap-x-10 max-md:mx-13'>
                  <Button
                    loading={applyed}
                    onClick={() => {
                      setApplyed(true)
                    }}
                    className='h30 rounded-30 primary-btn' type='primary'>Apply a loan</Button>
                  <Select
                    className='h30 w-150'
                    size='large'
                    defaultValue={`${t('faucet.title')}`}
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
                <div className='m-10 flex grow flex-col items-center justify-center gap-y-10 rounded-10 bg-#333341 py-10'>
                  <span>$FOF</span>
                  <span>{toCurrencyString(fofAmount)}</span>
                </div>
                <div className='m-10 flex grow flex-col items-center justify-center gap-y-10 rounded-10 bg-#333341 py-10'>
                  <span>Points</span>
                  <span>{((userScore.integral?.points ?? 0) / 100).toFixed(2)}</span>
                </div>
                <div className='m-10 flex flex-col items-center justify-around gap-y-10 rounded-10 bg-#333341 py-10'>
                  <span className='text-16'>Credit score</span>
                  <span className='flex justify-center text-16'>{(userScore.credit?.totalPoints ?? 0) / 100}</span>
                </div>
                <div className='m-10 flex flex-col items-center justify-around gap-y-10 rounded-10 bg-#333341 py-10'>
                  <span className='text-16'>Initial Points</span>
                  <span className='flex justify-center text-16'>{(userScore.credit?.initialPoints ?? 0) / 100}</span>
                </div>
                <div className='m-10 flex flex-col items-center justify-around gap-y-10 rounded-10 bg-#333341 py-10'>
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
      </div >)

  )
}

export default PersonalCenter
