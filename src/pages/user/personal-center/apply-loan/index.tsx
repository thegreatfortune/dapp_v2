import { Divider, Switch, Tooltip, Upload, message } from 'antd'
import Select from 'antd/es/select'
import Form from 'antd/es/form'
import Dragger from 'antd/es/upload/Dragger'
import TextArea from 'antd/es/input/TextArea'
import Button from 'antd/es/button'
import Image from 'antd/es/image'
import InputNumber from 'antd/es/input-number'
import type { RcFile } from 'antd/es/upload'
import { BorderOutlined, CheckOutlined, CloseOutlined, CloseSquareOutlined, LoadingOutlined } from '@ant-design/icons'
import Modal from 'antd/es/modal'
import './style.css'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useChainId } from 'wagmi'
import { ZeroAddress } from 'ethers'
import { LoanForm } from '@/models/LoanForm'
import { Models } from '@/.generated/api/models'
import airplane from '@/assets/images/apply-loan/airplane.png'
import downIcon from '@/assets/images/apply-loan/down.png'
import infoIconIcon from '@/assets/images/apply-loan/InfoIcon.png'
import defaultImage from '@/assets/images/default.png'
import { FileService } from '@/.generated/api/File'
import { handleImageCanvas } from '@/utils/handleImageCanvas'
import { maskWeb3Address } from '@/utils/maskWeb3Address'
import useUserStore from '@/store/userStore'
import useCoreContract from '@/hooks/useCoreContract'
import usePreApplyCheck from '@/helpers/usePreApplyCheck'
import { MessageError } from '@/enums/error'
import { NotificationInfo } from '@/enums/info'
import { executeTask, handlePreCheckState, handleTransactionResponse } from '@/helpers/helpers'

import usePoolCreationState from '@/helpers/usePoolCreationState'
import loanService from '@/services/loanService'

const ApplyLoan = () => {
  // const [tradingPair] = useState([
  //   [
  //     {
  //       logo: bitcoinIcon,
  //       name: 'BTC',
  //     },
  //     {
  //       logo: solanaIcon,
  //       name: 'SOL',
  //     },
  //     {
  //       logo: ethereumIcon,
  //       name: 'ETH',
  //     },
  //     {
  //       logo: arbitrumIcon,
  //       name: 'ARB',
  //     },
  //     {
  //       logo: chainlinkIcon,
  //       name: 'LINK',
  //     },
  //     {
  //       logo: uniswapIcon,
  //       name: 'UNI',
  //     },
  //   ],
  //   [
  //     {
  //       logo: lidofiIcon,
  //       name: 'LDO',
  //     },
  //     {
  //       logo: aaveIcon,
  //       name: 'AAVE',
  //     },
  //   ],
  //   [
  //     {
  //       logo: solanaIcon,
  //       name: 'SOL',
  //     },
  //     {
  //       logo: dogecoinIcon,
  //       name: 'DOGE',
  //     },
  //     {
  //       logo: rippleIcon,
  //       name: 'XRB',
  //     },
  //     {
  //       logo: litecoinIcon,
  //       name: 'LTC',
  //     },
  //   ],
  // ])

  // const [tradingPairBase, tradingPairSpotGoods, tradingPairContract]
  //   = tradingPair

  // const handleApply = async () => {
  //   await executeTask_Old(loanRequisitionEditModel)
  // }

  // async function executeTask_Old(value: Models.LoanContractVO) {
  //   if (!browserContractService)
  //     return

  //   // check duplicated order
  //   const processCenterContract = await browserContractService?.getProcessCenterContract()
  //   const orderUnexist = await browserContractService?.checkOrderCanCreateAgain()
  //   const isBlocked = await processCenterContract?._getIfBlackList(browserContractService?.getSigner.address)

  //   if (isBlocked || !orderUnexist) {
  //     message.error('Order can not be created: There is an un-liquidate order!')
  //     return
  //   }

  //   if (!browserContractService)
  //     return false

  //   setExecuting(true)
  //   if (poolCreated !== 4) {
  //     setPoolCreated(1)

  //     try {
  //       const res = await browserContractService?.checkPoolCreateState()
  //       const [capitalPoolState, refundPoolState] = res ?? [false, false]
  //       if (capitalPoolState && refundPoolState) {
  //         // setPoolIsCreated(true)
  //         setPoolCreated(4)
  //       }
  //       else {
  //         const res = await browserContractService?.followRouter_createPool()
  //         if (res?.status === 1) {
  //           // setPoolIsCreated(true)
  //           setPoolCreated(2)
  //         }
  //         else {
  //           throw new Error('Pool creation failed')
  //         }
  //       }
  //     }
  //     catch (error) {
  //       setPoolCreated(3)
  //       setOkText('Retry')
  //       setExecuting(false)
  //       message.error('Transaction Failed')
  //       return false
  //     }
  //   }

  //   try {
  //     setOrderCreated(1)
  //     const models = { ...value, ...loanRequisitionEditModel }
  //     await form.validateFields()

  //     let url
  //     if (useDiagram === true)
  //       url = await uploadFile()

  //     const orderRes = await browserContractService?.capitalPool_createOrder({ ...models, imageUrl: url ?? loanRequisitionEditModel.imageUrl })
  //     setOrderCreated(2)
  //     if (orderRes === false)
  //       throw new Error('Order creation failed')

  //     message.success('Your order has beend created successfully')
  //     // setOkText('Finished')
  //     setTimeout(() => {
  //       setOkText('Confirm')
  //       setExecuting(false)
  //       setApplyModalOpen(false)
  //       navigate('/my-loan')
  //     }, 3000)
  //     return true
  //   }
  //   catch (error) {
  //     setOrderCreated(3)
  //     setOkText('Retry')
  //     setExecuting(false)
  //     message.error('Transaction Failed')
  //     return false
  //   }
  //   // finally {
  //   // setOkText('Confirm')
  //   // setExecuting(false)
  //   // }
  // }

  // function onValuesChange(value: Record<string, any>) {
  //   if ('specified' in value)
  //     designatedTransactionChange(value.specified)

  //   if ('tradingFormType' in val) {
  //     form.setFieldsValue({
  //       ...val,
  //       tradingPlatformType: val.tradingFormType === 'SpotGoods' ? 'Uniswap' : 'GMX',
  //       transactionPairs: ['BTC'],
  //     })

  //     setLoanRequisitionEditModel((prevState) => {
  //       return ({
  //         ...prevState,
  //         ...val,
  //         tradingPlatformType: val.tradingFormType === 'SpotGoods' ? 'Uniswap' : 'GMX',
  //         transactionPairs: ['BTC'],
  //       })
  //     })
  //   }
  //   else {
  //     setLoanRequisitionEditModel((prevState) => {
  //       return ({
  //         ...prevState,
  //         ...val,
  //       })
  //     })
  //   }
  // }

  //  重置数据

  // function designatedTransactionChange(v: boolean) {
  //   form.setFieldsValue({
  //     designatedTransaction: v,
  //     tradingFormType: 'SpotGoods',
  //     tradingPlatformType: 'Uniswap',
  //     transactionPairs: ['BTC'],
  //   })

  //   setLoanRequisitionEditModel((prevState) => {
  //     return ({
  //       ...prevState,
  //       designatedTransaction: v,
  //       tradingFormType: 'SpotGoods',
  //       tradingPlatformType: 'Uniswap',
  //       transactionPairs: ['BTC'],
  //     })
  //   })
  // }

  const chainId = useChainId()
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { currentUser } = useUserStore()
  const { coreContracts } = useCoreContract()
  const [specifiedTradingPairsOfSpot, setSpecifiedTradingPairsOfSpot] = useState<{ logo: string; name: string }[]>([])
  const [specifiedTradingPairsOfFuture, setSpecifiedTradingPairsOfFuture] = useState<{ logo: string; name: string }[]>([])
  const { captialPoolCreationState, refundPoolCreationState } = usePoolCreationState()
  const { inBlacklist, canCreateLoan, checked } = usePreApplyCheck()
  const [shouldLoadApplyForm, setShouldLoadApplyForm] = useState(false)

  const [loanForm, setLoanForm] = useState(new LoanForm())
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [applyOkButtonText, setApplyOkButtonText] = useState(`${t('applyLoan.modal.okButton.text')}`)
  const [applyOkButtonDisabled, setApplyOkButtonDisabled] = useState(false)
  const [applyCancelButtonHidden, setApplyCancelButtonHidden] = useState(false)
  const [applying, setApplying] = useState(false)
  const [poolCreated, setPoolCreated] = useState(0) // 0--init / 1--executing / 2--finished / 3--failed / 4--exist
  const [orderCreated, setOrderCreated] = useState(0) // 0--init / 1--executing / 2--finished / 3--failed

  // TODO sort out
  const [useDiagram, setUseDiagram] = useState(false)
  // TODO sort out
  const [projectImageFileRule, setProjectImageFileRule] = useState([
    {
      required: true,
      message: 'Please upload your loan image!',
    },
  ])

  // TODO sort out
  async function beforeUpload(file: RcFile) {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      message.error('Only image files can be uploaded (PNG, JPEG, JPG)')
      return Upload.LIST_IGNORE
    }

    // 限制文件大小
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      message.error('The file size cannot exceed 2MB')
      return Upload.LIST_IGNORE
    }

    if (useDiagram === false) {
      const previewImageUrl = URL.createObjectURL(file)

      setLoanForm(preState => ({ ...preState, projectImagePreViewUrl: previewImageUrl, projectImageFile: file }))
    }

    setProjectImageFileRule([
      {
        required: false,
        message: 'Please upload your loan image!',
      },
    ])
  }

  // TODO sort out
  async function onSwitchChange(e: boolean) {
    setUseDiagram(e)
  }

  // TODO sort out
  async function uploadFile(file?: RcFile): Promise<string> {
    try {
      if (useDiagram && !file) {
        const { name, loanAmount, specifiedTradingType, interest, dividend } = loanForm
        const newFile = await handleImageCanvas(defaultImage, [name,
          coreContracts!.signer.address ? maskWeb3Address(coreContracts!.signer.address) : '',
          String(loanAmount ?? 0),
          specifiedTradingType === 'Spot' ? 'Low' : 'Hight',
          `${interest ?? 0}%`, `${dividend ?? 0}%`])

        if (!newFile)
          throw new Error('Image upload failed')

        const url = await FileService.ApiFileUpload_POST(chainId, { file: newFile })

        setLoanForm(preState => ({ ...preState, imageUrl: url }))
        return url
      }
      else {
        const url = await FileService.ApiFileUpload_POST(chainId, { file })

        setLoanForm(preState => ({ ...preState, projectImageFile: file, imageUrl: url }))
        return url
      }
    }
    catch (error) {
      throw new Error('Image upload failed')
    }
  }

  const onFinish = async () => {
    try {
      await form.validateFields()
    }
    catch (error) {
      message.error(MessageError.InvalidFormData)
      return Promise.reject(MessageError.InvalidFormData)
    }
    setLoanForm((loanForm) => {
      return { ...loanForm, ...form.getFieldsValue() as LoanForm }
    })
    if (captialPoolCreationState && refundPoolCreationState)
      setPoolCreated(4)
    setApplyModalOpen(true)
  }

  const getLatestLoanIdByUser = async () => {
    const task = async () => {
      if (coreContracts) {
        if (coreContracts.capitalPoolAddress === ZeroAddress)
          await coreContracts.getUserCapitalPoolAddress()
        if (coreContracts.capitalPoolContract)
          return coreContracts.capitalPoolContract.getLastId()
        else
          return Promise.reject(MessageError.PoolsDoNotExist)
      }
      else {
        return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
      }
    }
    return executeTask(task)
  }

  const resetApplyModal = () => {
    setApplying(false)
    setApplyModalOpen(false)
    setApplyOkButtonText(`${t('applyLoan.modal.okButton.text')}`)
    setApplyOkButtonDisabled(false)
    setApplyCancelButtonHidden(false)
    setApplying(false)
    setPoolCreated(0)
    setOrderCreated(0)
  }

  async function apply() {
    if (applyOkButtonText === t('completed')) {
      resetApplyModal()
      navigate('/my-loan')
    }
    if (coreContracts) {
      setApplyOkButtonText(`${t('applyLoan.modal.okButton.text.applying')}`)
      setApplyOkButtonDisabled(true)
      setApplyCancelButtonHidden(true)
      setApplying(true)
      // Step 1. create pools
      setPoolCreated(1)
      try {
        if (poolCreated !== 4) {
          const capitalPoolState = await coreContracts.routerContract.getCreateCapitalState(coreContracts.signer.address)
          const refundPoolState = await coreContracts.routerContract.getCreateRefundState(coreContracts.signer.address)
          if (capitalPoolState && refundPoolState) {
            // created
            setPoolCreated(4)
          }
          else {
            const res = await coreContracts.routerContract.createPool(coreContracts.signer.address)
            await handleTransactionResponse(res,
              NotificationInfo.CreatePoolSuccessful,
              NotificationInfo.CreatePoolSuccessfulDesc,
            )
            setPoolCreated(2)
          }
        }
      }
      catch (error) {
        setApplyOkButtonText(`${t('applyLoan.modal.okButton.text')}`)
        setApplyOkButtonDisabled(false)
        setApplyCancelButtonHidden(false)
        setPoolCreated(3)
        return
      }

      // Step 2. create loan

      setOrderCreated(1)
      try {
        // const model = { ...value, ...loanRequisitionEditModel }
        await form.validateFields()

        let url
        if (useDiagram === true)
          url = await uploadFile()

        const decimals = await coreContracts.usdcContract.decimals()
        const res = await coreContracts.routerContract.borrowerCreateOrder(
          {
            _timePeriod: BigInt(loanForm.duration),
            _repayTimes: BigInt(loanForm.installments),
            _interestRate: BigInt(loanForm.interest * 100),
            _shareRate: BigInt((loanForm.dividend ?? 0) * 100),
            _goalShareCount: BigInt(loanForm.numberOfShares),
            _minShareCount: BigInt(loanForm.minimumRequiredRaisingShares ?? 0),
            _collectEndTime: BigInt(loanForm.raisingTime!) * BigInt(86400), // seconds
            _goalMoney: BigInt(loanForm.loanAmount) * (BigInt(10) ** decimals), // decimals token for usdc
            uri: url ?? loanForm.imageUrl,
            name: loanForm.name,
          },
        )
        await handleTransactionResponse(res,
          NotificationInfo.CreateLoanSuccessfully,
          NotificationInfo.CreateLoanSuccessfullyDesc,
        )

        const latestLoanId = await getLatestLoanIdByUser()
        const loanDetail: Models.ISubmitNewLoanParams = {
          tradeId: Number(latestLoanId),
          loanName: loanForm.name,
          loanIntro: loanForm.description,
          loanPicUrl: loanForm.imageUrl,
          tradingFormType: loanForm.specifiedTradingType,
          tradingPlatformType: loanForm.specifiedPlatformType,
          transactionPairs: loanForm.specifiedPairs,
        }

        await loanService.submitNewLoan(chainId, loanDetail)
        setOrderCreated(2)
        setApplyOkButtonText(`${t('completed')}`)
        setApplyOkButtonDisabled(false)

        setTimeout(() => {
          resetApplyModal()
          navigate('/my-loan')
        }, 3000)
      }
      catch (error) {
        setApplyOkButtonText(`${t('applyLoan.modal.okButton.text')}`)
        setApplyOkButtonDisabled(false)
        setApplyCancelButtonHidden(false)
        setOrderCreated(3)
      }
    }
  }

  useEffect(() => {
    if (!currentUser.accessToken) {
      message.warning(MessageError.NotLoggedIn)
      navigate('/personal-center')
    }
  }, [currentUser])

  useEffect(() => {
    if (coreContracts) {
      setSpecifiedTradingPairsOfSpot(coreContracts.specifiedTradingPairsOfSpot)
      setSpecifiedTradingPairsOfFuture(coreContracts.specifiedTradingPairsOfFuture)
    }
  }, [coreContracts])

  useEffect(() => {
    if (applying && checked)
      apply()
  }, [applying, checked])

  useEffect(() => {
    if (checked) {
      const state = handlePreCheckState(inBlacklist, canCreateLoan)
      if (state) {
        setShouldLoadApplyForm(true)
      }
      else {
        setTimeout(() => {
          navigate('/personal-center')
        }, 2000)
      }
    }
  }, [checked])

  // TODO sort out
  useEffect(() => {
    async function fetchData() {
      await form.validateFields(['projectImageFile'])
    }

    loanForm.name && form && fetchData()
  }, [projectImageFileRule, form])

  // TODO sort out
  useEffect(() => {
    async function fetchData() {
      if (useDiagram) {
        setProjectImageFileRule([
          {
            required: false,
            message: 'Please upload your loan image!?',
          },
        ])
      }
      else {
        try {
          setProjectImageFileRule([
            {
              required: true,
              message: 'Please upload your loan image!',
            },
          ])
        }
        catch (error) {
          console.error('Validation error for projectImageFile:', error)
        }
      }
    }
    form && fetchData()
  }, [useDiagram, form])

  return (
    shouldLoadApplyForm
      ? <div>
        <Modal open={applyModalOpen}
          width={600}
          okText={applyOkButtonText}
          onOk={apply}
          onCancel={resetApplyModal}
          okButtonProps={{ disabled: applyOkButtonDisabled, loading: applyOkButtonDisabled, className: 'primary-btn w-100' }}
          cancelButtonProps={{ hidden: applyCancelButtonHidden, className: 'w-100' }}
        >
          <div>
            <h2>Apply A Loan</h2>
            <div className='h-120 p-10 text-18'>
              {/* <h3>Create Pool Contract (Only Once)</h3> */}
              {
                poolCreated === 0
                  ? <div className='flex items-center justify-between'>
                    <div className='flex'>
                      <div className='mr-8'>1.</div>Create Pool Contract (Only Once)</div>
                    <div className='m-8'><BorderOutlined /></div>
                  </div>
                  : poolCreated === 1
                    ? <div className='flex items-center justify-between'>
                      <div className='flex'>
                        <div className='mr-8'>1.</div>Creating your pool contract...</div>
                      <div className='m-8'><LoadingOutlined /></div>
                    </div>
                    : poolCreated === 2
                      ? <div className='flex items-center justify-between'>
                        <div className='flex'>
                          <div className='mr-8'>1.</div>Your pool contract has been created!</div>
                        <div className='m-8'><CheckOutlined className='text-green-500' /></div>
                      </div>
                      : poolCreated === 3
                        ? <div className='flex items-center justify-between'>
                          <div className='flex'>
                            <div className='mr-8'>1.</div>The creation of pool contract failed!</div>
                          <div className='m-8'><CloseSquareOutlined className='text-red-500' /></div>
                        </div>
                        : <div className='flex items-center justify-between'>
                          <div className='flex'>
                            <div className='mr-8'>1.</div>
                            Your pool contract exists!
                          </div>
                          <div className='m-8'><CheckOutlined className='text-green-500' /></div>
                        </div>
              }
              {/* <h3>Create Loan Order</h3> */}
              {
                orderCreated === 0
                  ? <div className='flex items-center justify-between'>
                    <div className='flex'>
                      <div className='mr-8'>2.</div>Create Loan Order</div>
                    <div className='m-8'><BorderOutlined /></div>
                  </div>
                  : orderCreated === 1
                    ? <div className='flex items-center justify-between'>
                      <div className='flex'>
                        <div className='mr-8'>2.</div>Creating your loan order...</div>
                      <div className='m-8'><LoadingOutlined /></div>
                    </div>
                    : orderCreated === 2
                      ? <div className='flex items-center justify-between'>
                        <div className='flex'>
                          <div className='mr-8'>2.</div>Your order has been created!</div>
                        <div className='m-8'><CheckOutlined className='text-green-500' /></div>
                      </div>
                      : <div className='flex items-center justify-between'>
                        <div className='flex'>
                          <div className='mr-8'>2.</div>The creation of order failed</div>
                        <div className='m-8'><CloseSquareOutlined className='text-red-500' /></div>
                      </div>
              }
            </div>
          </div>
        </Modal>
        <Form
          form={form}
          initialValues={loanForm}
          layout="vertical"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          name="apply-loan-form"

        >
          <div className="title-box">
            {/* <div className="w-full flex justify-between "> */}
            <div className="image-box">
              <Form.Item
                name="imageUrl"
                // className="image-box"
                valuePropName="file"
                getValueFromEvent={e => e.fileList}
                rules={projectImageFileRule}
              >
                <div className="item-center mx-10 my-20 flex justify-end text-14">
                  <div className='mx-8'>
                    Use default image
                  </div>
                  <Switch checkedChildren="ON" unCheckedChildren="OFF" onChange={onSwitchChange} />
                </div>
                <div className='default-image'>
                  <Dragger
                    name="imageUrl"
                    action={uploadFile}
                    beforeUpload={beforeUpload}
                    // style={{ height: 453 }}
                    disabled={useDiagram}
                    showUploadList={false}
                    accept='.png,.jpg,.jpeg'
                    style={{
                      border: 0,
                      backgroundColor: 'rgb(23 24 34 / var(--un-bg-opacity))',
                    }}
                  >
                    {
                      !useDiagram
                      && <>
                        {
                          loanForm.projectImagePreViewUrl
                            ? <Image src={loanForm.projectImagePreViewUrl} preview={false} />
                            : <div>
                              <Image src={airplane} preview={false} />
                              <p className="ant-upload-drag-icon"></p>
                              <p className="ant-upload-text !text-24 !font-bold">
                                {t('applyLoan.formItem.upload.title')}
                              </p>
                              <p className="ant-upload-hint !text-18">
                                800 x 800px {t('applyLoan.formItem.upload.description')}
                              </p>
                            </div>
                        }
                      </>
                    }

                    {
                      useDiagram
                      && <Image preview={false} src={defaultImage} />
                    }
                  </Dragger>

                </div>
              </Form.Item>
            </div>

            <div className='content-box'>
              <div>

                <Form.Item
                  name="name"
                  // className="title"
                  label={
                    <span className="p0 text-16">
                      {t('applyLoan.formItem.item.label')}
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Please input your loan name!',
                    },
                    {
                      max: 36,
                      message: 'Title must be at most 36 characters.',
                    },
                  ]}
                  style={{ margin: 0 }}
                >
                  <TextArea
                    className="s-container text-14"
                    placeholder={t('applyLoan.formItem.item.placeholder')}
                    style={{ height: 102, resize: 'none' }}
                  />
                </Form.Item>
              </div>

              <div className="h16"></div>
              <Form.Item
                name="description"
                // className="content"
                label={
                  <span className="text-16">
                    {t('applyLoan.formItem.item.description.label')}
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: 'Please input your description!',
                  },
                  {
                    max: 500,
                    message: 'Description must be at most 500 characters.',
                  },
                ]}
                style={{ margin: 0 }}
              >
                <TextArea
                  className="text-14"
                  placeholder={t(
                    'applyLoan.formItem.item.description.placeholder',
                  )}
                  // style={{ height: 269, resize: 'none' }}
                  style={{ height: 280 }}
                />
              </Form.Item>
            </div>
          </div >

          <div className="h-50" />

          {/* Apply for a loan */}
          <div className="apply-option">
            {/* <div className="box-border h-394 w-full flex flex-wrap gap-x-52 rounded-20 from-#0E0F14 to-#16273B bg-gradient-to-br px30 pb-16 pt-44 text-16"> */}

            <div className='apply-option-item'>
              <Form.Item
                name="loanAmount"
                rules={[
                  {
                    required: true,
                    message: 'Please input content!',
                  },
                ]}
                label={
                  <span className="w-full text-16">
                    {t('applyLoan.formItem.applyForLoan.label')}
                  </span>
                }
              // className="mb-10"
              >
                <InputNumber
                  min={100}
                  max={1000000}
                  // className="s-container box-border h45 w-full items-center px-30 pr-106 text-14"
                  // className="s-container box-border h50 w412 items-center px-30 pr-106 text-14"
                  className="apply-option-item-input"
                  suffix={<div className="px-20 text-14">USDC</div>}
                />
              </Form.Item>
            </div>

            <div className="apply-option-item">
              <Form.Item
                name="duration"
                rules={[
                  {
                    required: true,
                    message: 'Please input content!',
                  },
                ]}
                label={
                  <span className="text-16">
                    {t('applyLoan.formItem.cycle.label')}
                  </span>
                }
              // className="apply-option-item-input"
              >
                <Select
                  popupClassName="bg-#111a2c border-2 border-#303241 border-solid"
                  className="apply-option-item-select"
                  suffixIcon={
                    <img src={downIcon} alt="downIcon" className="px-20" />
                  }
                  options={[
                    { value: 0, label: 10 },
                    { value: 1, label: 20 },
                    { value: 2, label: 30 },
                    { value: 3, label: 60 },
                    { value: 4, label: 90 },
                    { value: 5, label: 180 },
                  ]}
                />
              </Form.Item>
            </div>
            <div className="apply-option-item">
              <Form.Item
                name="installments"
                rules={[
                  {
                    required: true,
                    message: 'Please input content!',
                  },
                ]}
                label={
                  <span className="text-16">
                    {t('applyLoan.formItem.period.label')}
                  </span>
                }
              >
                <Select
                  popupClassName="bg-#111a2c border-2 border-#303241 border-solid"
                  className="apply-option-item-select"
                  disabled={loanForm.duration <= 3}
                  suffixIcon={
                    <img src={downIcon} alt="downIcon" className="px-20" />
                  }
                  options={[
                    { value: 1, label: 1 },
                    { value: 2, label: 2 },
                    { value: 5, label: 5 },
                    { value: 10, label: 10 },
                  ]}
                />
              </Form.Item>
            </div>
            {/* Second */}
            <div className="apply-option-item">
              <Form.Item
                name="dividend"
                label={
                  <span className="text-16">
                    {t('applyLoan.formItem.dividend.label')}
                    <Tooltip color='#303241' overlayInnerStyle={{ padding: 25 }} title="The dividend ratio is profit dividends. The remaining funds after deducting principal + interest + handling fees from the repayment pool funds are profits. Part of the profits will be deducted according to the allocation ratio and given to the lender.">
                      <Image className='ml-5 cursor-help' src={infoIconIcon} preview={false} />
                    </Tooltip>
                  </span>

                }
              >
                <InputNumber
                  min={0}
                  max={100}
                  precision={2}
                  step={0.01}
                  className="apply-option-item-input"
                  suffix={<div className="px-20 text-14">%</div>}
                />
              </Form.Item>
            </div>
            <div className="apply-option-item">
              <Form.Item
                name="interest"
                rules={[
                  {
                    required: true,
                    message: 'Please input content!',
                  },
                ]}
                label={
                  <span className="text-16">
                    {t('applyLoan.formItem.interest.label')}

                    <Tooltip color='#303241' overlayInnerStyle={{ padding: 25 }} title="Interest is deducted first, and the lender only needs to provide funds after interest is deducted.">
                      <Image className='ml-5 cursor-help' src={infoIconIcon} preview={false} />
                    </Tooltip>
                  </span>
                }
              >
                <InputNumber
                  min={5}
                  max={80}
                  precision={2}
                  step={0.01}
                  className="apply-option-item-input"
                  suffix={<div className="px-20 text-14">%</div>}
                />
              </Form.Item>
            </div>
            <div className="apply-option-item">
              <Form.Item
                name="raisingTime"
                rules={[
                  {
                    required: true,
                    message: 'Please input content!',
                  },
                ]}
                label={
                  <span className="text-16">
                    {t('applyLoan.formItem.raisingTime.label')}
                  </span>
                }
              >
                <Select
                  popupClassName="bg-#111a2c border-2 border-#303241 border-solid"
                  className="apply-option-item-select"
                  suffixIcon={
                    <img src={downIcon} alt="downIcon" className="px-20" />
                  }
                  options={[
                    { value: 1, label: 1 },
                    { value: 3, label: 3 },
                    { value: 7, label: 7 },
                    { value: 14, label: 14 },
                    { value: 20, label: 20 },
                  ]}
                />
              </Form.Item>
            </div>
            {/* Three */}
            <div className="apply-option-item">
              <Form.Item
                name="numberOfShares"
                label={
                  <span className="text-16">
                    {t('applyLoan.formItem.numberOfCopies.label')}
                  </span>
                }
              >
                <InputNumber
                  min={1}
                  max={10000}
                  className="apply-option-item-input"
                  suffix={<div className="px-20 text-14">shares</div>}
                />
              </Form.Item>
            </div>
            {
              loanForm.numberOfShares > 1
              && <Form.Item
                name="minimumRequiredRaisingShares"
                label={
                  <span className="text-16">
                    {t('applyLoan.formItem.minimumRequiredCopies.label')}
                  </span>
                }
              >
                <InputNumber
                  min={1}
                  max={loanForm.numberOfShares}
                  className="apply-option-item-input"
                  suffix={<div className="px-20 text-14">shares</div>}
                />
              </Form.Item>
            }
          </div>

          <div className="h50" />

          <div className="apply-trade-box">
            <div className="mb-20 text-20">
              {t('applyLoan.formItem.designatedTransaction.label')}
            </div>
            <div className="apply-trade-option">
              <div className='apply-option-item'>
                <Form.Item name="specified"
                  rules={[
                    {
                      required: true,
                      message: 'Please input content!',
                    },
                  ]}
                >
                  <Select
                    popupClassName="bg-#111a2c border-2 border-#303241 border-solid"
                    className="apply-option-item-select"
                    suffixIcon={
                      <img src={downIcon} alt="downIcon" className="px-20" />
                    }
                    defaultValue={true}
                    options={[
                      { value: true, label: 'YES' },
                      { value: false, label: 'NO' },
                    ]}
                    onChange={value => setLoanForm((loanForm) => { return { ...loanForm, specified: value } })}
                  />
                </Form.Item>
              </div>
              <div className='apply-option-item'>
                <Form.Item name="specifiedTradingType">
                  <Select
                    popupClassName="bg-#111a2c border-2 border-#303241 border-solid"
                    className="apply-option-item-select"
                    suffixIcon={
                      <img src={downIcon} alt="downIcon" className="px-20" />
                    }
                    defaultValue={Models.SpecifiedTradingTypeEnum.Spot}
                    options={[
                      {
                        value: Models.SpecifiedTradingTypeEnum.Spot,
                        label: Models.SpecifiedTradingTypeEnum.Spot,
                      },
                      {
                        value: Models.SpecifiedTradingTypeEnum.Future,
                        label: Models.SpecifiedTradingTypeEnum.Future,
                        disabled: true,
                      },
                    ]}
                    onChange={value => setLoanForm((loanForm) => { return { ...loanForm, specifiedTradingType: value } })}
                  />
                </Form.Item>
              </div>
              <div className='apply-option-item'>
                <Form.Item name="specifiedPlatformType">
                  <Select
                    popupClassName="bg-#111a2c border-2 border-#303241 border-solid"
                    className="apply-option-item-select"
                    suffixIcon={
                      <img src={downIcon} alt="downIcon" className="px-20" />
                    }
                    disabled
                    value={Models.SpecifiedTradingPlatformTypeEnum.Uniswap}
                    options={[
                      { value: 'Uniswap', label: 'Uniswap' },
                      { value: 'GMX', label: 'GMX' },
                    ]}
                    onChange={value => setLoanForm((loanForm) => { return { ...loanForm, specifiedPlatformType: value } })}
                  />
                </Form.Item>
              </div>
              <div className='apply-option-item' >
                <Form.Item name="specifiedPairs"
                  hidden={!loanForm.specified}
                  rules={[{
                    required: true,
                    message: 'Please select one asset at least.',
                  }]}>
                  <Select
                    mode="multiple"
                    popupClassName="bg-#111a2c border-2 border-#303241 border-solid"
                    className="apply-option-item-select"
                    status={loanForm.specifiedPairs.length === 0 ? 'error' : ''}
                    suffixIcon={<img src={downIcon} alt="downIcon" className="px-20" />}
                    value={loanForm.specifiedPairs}
                    maxTagCount={2}
                    options={specifiedTradingPairsOfSpot.map(e => ({ value: e.name, label: e.name }))}
                    onChange={value => setLoanForm((loanForm) => { return { ...loanForm, specifiedPairs: value } })
                    }
                  />
                </Form.Item>
              </div>
              <div>
              </div>

            </div >
            <Divider className='w-full'></Divider>
            <div hidden={!loanForm.specified}>
              <div className="my-50 flex flex-wrap gap-x-52 gap-y-20">
                {loanForm.specifiedPairs.map((e, i) => (
                  <div
                    key={i}
                    className="s-container box-border h50 w-100 flex items-center text-14"
                  >
                    {/* <div className='flex items-center'> */}
                    <Image
                      preview={false}
                      width={30}
                      height={30}
                      src={specifiedTradingPairsOfSpot.find(p => p.name === e)?.logo}
                    ></Image>
                    <div className='m-4 p-2 text-16'>{e} </div>
                    {/* <Image
                    preview={false}
                    onClick={() => onCoinClick(i)}
                    className='mb-5 cursor-pointer'
                    width={18}
                    height={18}
                    src={isHovered ? xFloatIcon : xGenalIcon}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  /> */}
                    <CloseOutlined
                      onClick={() => setLoanForm((prevLoanForm) => {
                        prevLoanForm.specifiedPairs.splice(i, 1)
                        return { ...prevLoanForm }
                      })
                      }
                      width={18} height={18} />
                    {/* </div> */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* <Divider className='m0 bg-#6A6A6A' /> */}

          < div className="h44" />

          <Form.Item className="text-center">
            <Button
              type="primary"
              htmlType="submit"
              loading={applying}
              className="h65 w200 b-rd-10 text-18 primary-btn"
              onClick={onFinish}
            >
              {t('applyLoan.submitBtn')}
            </Button>
          </Form.Item>
        </Form >
        <div className="h44" />
      </div >
      : <></>
  )
}

export default ApplyLoan
