import Select from 'antd/es/select'
import Form from 'antd/es/form'
import Dragger from 'antd/es/upload/Dragger'
import TextArea from 'antd/es/input/TextArea'
import Button from 'antd/es/button'
import Image from 'antd/es/image'
import './style.css'
import { useTranslation } from 'react-i18next'
import InputNumber from 'antd/es/input-number'
import { BorderOutlined, CheckOutlined, CloseSquareOutlined, LoadingOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import Modal from 'antd/es/modal'
import { Divider, Switch, Tooltip, Upload, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { RcFile } from 'antd/es/upload'
import airplane from '@/assets/images/apply-loan/airplane.png'
import jmtzDown from '@/assets/images/apply-loan/jmtz_down.png'
import { LoanRequisitionEditModel } from '@/models/LoanRequisitionEditModel'
import { Models } from '@/.generated/api/models'
import bitcoinIcon from '@/assets/images/apply-loan/token-icons/BTC.png'

// import followIcon from '@/assets/images/apply-loan/token-icons/usdc.png'
import ethereumIcon from '@/assets/images/apply-loan/token-icons/ETH.png'
import arbitrumIcon from '@/assets/images/apply-loan/token-icons/ARB.png'
import chainlinkIcon from '@/assets/images/apply-loan/token-icons/LINK.png'
import uniswapIcon from '@/assets/images/apply-loan/token-icons/UNI.png'
import lidofiIcon from '@/assets/images/apply-loan/token-icons/LDO.png'
import aaveIcon from '@/assets/images/apply-loan/token-icons/AAVE.png'
import solanaIcon from '@/assets/images/apply-loan/token-icons/SOL.png'
import dogecoinIcon from '@/assets/images/apply-loan/token-icons/DOGE.png'
import rippleIcon from '@/assets/images/apply-loan/token-icons/XRP.png'
import litecoinIcon from '@/assets/images/apply-loan/token-icons/LTC.png'
import xGenalIcon from '@/assets/images/apply-loan/xGenal.png'
import xFloatIcon from '@/assets/images/apply-loan/xFloat.png'
import infoIconIcon from '@/assets/images/apply-loan/InfoIcon.png'
import useBrowserContract from '@/hooks/useBrowserContract'
import defaultImage from '@/assets/images/default.png'
import { FileService } from '@/.generated/api/File'
import { handleImageCanvas } from '@/utils/handleImageCanvas'
import { maskWeb3Address } from '@/utils/maskWeb3Address'
import useUserStore from '@/store/userStore'

const ApplyLoan = () => {
  /* #region  */
  const [form] = Form.useForm()

  const { t } = useTranslation()

  const navigate = useNavigate()

  const { currentUser } = useUserStore()

  const { browserContractService } = useBrowserContract()

  const [okText, setOkText] = useState('Confirm')
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [executing, setExecuting] = useState(false)

  const [poolCreated, setPoolCreated] = useState(0)
  const [orderCreated, setOrderCreated] = useState(0)

  const [publishBtnLoading, setPublishBtnLoading] = useState(false)

  const [selectError, setSelectError] = useState(false)

  const [loanRequisitionEditModel, setLoanRequisitionEditModel]
    = useState<LoanRequisitionEditModel>(new LoanRequisitionEditModel())

  const [isHovered, setIsHovered] = useState(false)

  const [useDiagram, setUseDiagram] = useState(false)
  /* #endregion */

  const [tradingPair] = useState([
    [
      {
        logo: bitcoinIcon,
        name: 'BTC',
      },
      {
        logo: solanaIcon,
        name: 'SOL',
      },
      {
        logo: ethereumIcon,
        name: 'ETH',
      },
      {
        logo: arbitrumIcon,
        name: 'ARB',
      },
      {
        logo: chainlinkIcon,
        name: 'LINK',
      },
      {
        logo: uniswapIcon,
        name: 'UNI',
      },
    ],
    [
      {
        logo: lidofiIcon,
        name: 'LDO',
      },
      // {
      //   logo: makerIcon,
      //   name: 'MKR',
      // },
      {
        logo: aaveIcon,
        name: 'AAVE',
      },
    ],
    [
      {
        logo: solanaIcon,
        name: 'SOL',
      },
      {
        logo: dogecoinIcon,
        name: 'DOGE',
      },
      {
        logo: rippleIcon,
        name: 'XRB',
      },
      {
        logo: litecoinIcon,
        name: 'LTC',
      },
    ],
  ])

  const [tradingPairBase, tradingPairSpotGoods, tradingPairContract]
    = tradingPair

  const [projectImageFileRule, setProjectImageFileRule] = useState([
    {
      required: true,
      message: 'Please upload your loan image!',
    },
  ])

  useEffect(() => {
    if (!currentUser.accessToken) {
      message.warning('You must be logged in ')
      navigate('/personal-center')
    }
  }, [currentUser])

  /**
   *  加载页面之后检查 检查订单是否可创建
   */
  useEffect(() => {
    async function fetchData() {
      if (!browserContractService)
        return

      const orderCanCreatedAgain = await browserContractService?.checkOrderCanCreateAgain()

      if (!orderCanCreatedAgain) {
        message.warning('Order can not be created: There is an un-liquidate order!')
        navigate(-1)
      }
    }

    fetchData()
  }, [browserContractService])

  useEffect(() => {
    async function fetchData() {
      await form.validateFields(['projectImageFile'])
    }

    loanRequisitionEditModel.itemTitle && form && fetchData()
  }, [projectImageFileRule, form])

  useEffect(() => {
    async function fetchData() {
      if (useDiagram) {
        setProjectImageFileRule([
          {
            required: false,
            message: 'Please upload your loan image!',
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

  async function uploadFile(file?: RcFile): Promise<string> {
    try {
      if (useDiagram && !file) {
        const { itemTitle, applyLoan, tradingFormType, interest, dividend } = loanRequisitionEditModel
        const newFile = await handleImageCanvas(defaultImage, [itemTitle,
          browserContractService?.getSigner.address ? maskWeb3Address(browserContractService?.getSigner.address) : '',
          String(applyLoan ?? 0),
          tradingFormType === 'SpotGoods' ? 'Low' : 'Hight',
          `${interest ?? 0}%`, `${dividend ?? 0}%`])

        if (!newFile)
          throw new Error('Image upload failed')

        const url = await FileService.ApiFileUpload_POST({ file: newFile })

        setLoanRequisitionEditModel(preState => ({ ...preState, imageUrl: url }))
        return url
      }
      else {
        const url = await FileService.ApiFileUpload_POST({ file })

        setLoanRequisitionEditModel(preState => ({ ...preState, projectImageFile: file, imageUrl: url }))
        return url
      }
    }
    catch (error) {
      throw new Error('Image upload failed')
    }
  }

  const handleApply = async () => {
    await executeTask(loanRequisitionEditModel)
  }

  async function executeTask(value: Models.LoanContractVO) {
    if (!browserContractService)
      return

    // check duplicated order
    const processCenterContract = await browserContractService?.getProcessCenterContract()
    const orderUnexist = await browserContractService?.checkOrderCanCreateAgain()
    const isBlocked = await processCenterContract?._getIfBlackList(browserContractService?.getSigner.address)

    if (isBlocked || !orderUnexist) {
      message.error('Order can not be created: There is an un-liquidate order!')
      return
    }

    if (!browserContractService)
      return false

    setExecuting(true)
    if (poolCreated !== 4) {
      setPoolCreated(1)

      try {
        const res = await browserContractService?.checkPoolCreateState()
        const [capitalPoolState, refundPoolState] = res ?? [false, false]
        if (capitalPoolState && refundPoolState) {
          // setPoolIsCreated(true)
          setPoolCreated(4)
        }
        else {
          const res = await browserContractService?.followRouter_createPool()
          if (res?.status === 1) {
            // setPoolIsCreated(true)
            setPoolCreated(2)
          }
          else {
            throw new Error('Pool creation failed')
          }
        }
      }
      catch (error) {
        setPoolCreated(3)
        setOkText('Retry')
        setExecuting(false)
        message.error('Transaction Failed')
        return false
      }
    }

    try {
      setOrderCreated(1)
      const models = { ...value, ...loanRequisitionEditModel }
      await form.validateFields()

      let url
      if (useDiagram === true)
        url = await uploadFile()

      const orderRes = await browserContractService?.capitalPool_createOrder({ ...models, imageUrl: url ?? loanRequisitionEditModel.imageUrl })
      setOrderCreated(2)
      if (orderRes === false)
        throw new Error('Order creation failed')

      message.success('Your order has beend created successfully')
      // setOkText('Finished')
      setTimeout(() => {
        setOkText('Confirm')
        setExecuting(false)
        setApplyModalOpen(false)
        navigate('/my-loan')
      }, 3000)
      return true
    }
    catch (error) {
      setOrderCreated(3)
      setOkText('Retry')
      setExecuting(false)
      message.error('Transaction Failed')
      return false
    }
    // finally {
    // setOkText('Confirm')
    // setExecuting(false)
    // }
  }

  const onFinish = async (value: LoanRequisitionEditModel) => {
    const res = await browserContractService?.checkPoolCreateState()
    const [capitalPoolState, refundPoolState] = res ?? [false, false]
    if (capitalPoolState && refundPoolState) {
      // setPoolIsCreated(true)
      setPoolCreated(4)
    }

    try {
      setLoanRequisitionEditModel(preState =>
        ({ ...preState, ...value }),
      )

      setApplyModalOpen(true)
    }
    catch (error) {
      console.error('%c [ error ]-341', 'font-size:13px; background:#96e638; color:#daff7c;', error)
    }
  }

  function onValuesChange(val: Record<string, any>) {
    if ('designatedTransaction' in val)
      designatedTransactionChange(val.designatedTransaction)

    if ('tradingFormType' in val) {
      form.setFieldsValue({
        ...val,
        tradingPlatformType: val.tradingFormType === 'SpotGoods' ? 'Uniswap' : 'GMX',
        transactionPairs: ['BTC'],
      })

      setLoanRequisitionEditModel((prevState) => {
        return ({
          ...prevState,
          ...val,
          tradingPlatformType: val.tradingFormType === 'SpotGoods' ? 'Uniswap' : 'GMX',
          transactionPairs: ['BTC'],
        })
      })
    }
    else {
      setLoanRequisitionEditModel((prevState) => {
        return ({
          ...prevState,
          ...val,
        })
      })
    }
  }

  //  重置数据
  function designatedTransactionChange(v: boolean) {
    form.setFieldsValue({
      designatedTransaction: v,
      tradingFormType: 'SpotGoods',
      tradingPlatformType: 'Uniswap',
      transactionPairs: ['BTC'],
    })

    setLoanRequisitionEditModel((prevState) => {
      return ({
        ...prevState,
        designatedTransaction: v,
        tradingFormType: 'SpotGoods',
        tradingPlatformType: 'Uniswap',
        transactionPairs: ['BTC'],
      })
    })
  }

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

      setLoanRequisitionEditModel(preState => ({ ...preState, projectImagePreViewUrl: previewImageUrl, projectImageFile: file }))
    }

    setProjectImageFileRule([
      {
        required: false,
        message: 'Please upload your loan image!',
      },
    ])
  }

  async function onSwitchChange(e: boolean) {
    setUseDiagram(e)
  }

  function onCoinClick(index: number) {
    const arr = loanRequisitionEditModel.transactionPairs?.splice(index, 1)

    setLoanRequisitionEditModel(preState => ({ ...preState, tradingPair: arr }))
  }
  return (
    <div>
      <Modal open={applyModalOpen}
        width={600}
        okText={okText}
        onOk={handleApply}
        onCancel={() => {
          setExecuting(false)
          setPoolCreated(0)
          setOrderCreated(0)
          setApplyModalOpen(false)
          setPublishBtnLoading(false)
        }}
        okButtonProps={{ disabled: executing, className: 'primary-btn w-100' }}
        cancelButtonProps={{ className: 'w-100' }}
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
        initialValues={loanRequisitionEditModel}
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        name="apply-loan-form"
        onFinish={() => {
          if (loanRequisitionEditModel!.transactionPairs!.length < 1) {
            setSelectError(true)
            message.error('You must choose at least one token!')
            return
          }
          else {
            if (selectError)
              setSelectError(false)
          }
          setPublishBtnLoading(true)
          onFinish(loanRequisitionEditModel)
        }}
        onValuesChange={onValuesChange}
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
              {/* <div className="item-center relative m0 box-border h453 w-453 border-1 border-#303241 rounded-20 border-solid bg-#171822"> */}
              <div className="item-center my-20 mx-10 flex justify-end text-14">
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
                        loanRequisitionEditModel.projectImagePreViewUrl
                          ? <Image src={loanRequisitionEditModel.projectImagePreViewUrl} preview={false} />
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
                name="itemTitle"
                // className="title"
                label={
                  <span className="p0 text-16">
                    {t('applyLoan.formItem.item.label')}
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: 'Please input your title!',
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
              name="applyLoan"
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
              name="cycle"
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
                  <img src={jmtzDown} alt="jmtzDown" className="px-20" />
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
              name="period"
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
                disabled={loanRequisitionEditModel.cycle <= 3}
                suffixIcon={
                  <img src={jmtzDown} alt="jmtzDown" className="px-20" />
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
                  <img src={jmtzDown} alt="jmtzDown" className="px-20" />
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
              name="numberOfCopies"
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
            loanRequisitionEditModel.numberOfCopies > 1
            && <Form.Item
              name="minimumRequiredCopies"
              label={
                <span className="text-16">
                  {t('applyLoan.formItem.minimumRequiredCopies.label')}
                </span>
              }
            >
              <InputNumber
                min={1}
                max={loanRequisitionEditModel.numberOfCopies}
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
              <Form.Item
                // className="m0 mt30"
                name="designatedTransaction"
                rules={[
                  {
                    required: true,
                    message: 'Please input content!',
                  },
                ]}
              // label={
              //   <span className="text-16">
              //     {t('applyLoan.formItem.designatedTransaction.label')}
              //   </span>
              // }
              >
                <Select
                  popupClassName="bg-#111a2c border-2 border-#303241 border-solid"
                  className="apply-option-item-select"
                  suffixIcon={
                    <img src={jmtzDown} alt="jmtzDown" className="px-20" />
                  }
                  // onChange={v =>
                  //   designatedTransactionChange(v)
                  // }
                  options={[
                    { value: true, label: 'YES' },
                    { value: false, label: 'NO' },
                  ]}
                />
              </Form.Item>
            </div>
            <div className='apply-option-item'>
              <Form.Item
                name="tradingFormType"
              // className="m0 w306"
              >
                <Select
                  popupClassName="bg-#111a2c border-2 border-#303241 border-solid"
                  className="apply-option-item-select"
                  suffixIcon={
                    <img src={jmtzDown} alt="jmtzDown" className="px-20" />
                  }

                  // onChange={(v) => {
                  //   setLoanRequisitionEditModel(prevState => ({
                  //     ...prevState,
                  //     tradingFormType: v,
                  //     // tradingPlatformType: v === 'SpotGoods'
                  //     //   ? 'Uniswap'
                  //     //   : 'GMX',
                  //   }))
                  // }
                  // }
                  options={[
                    {
                      value: Models.TradingFormType.SpotGoods,
                      label: 'Spot',
                    },
                    {
                      value: Models.TradingFormType.Contract,
                      label: 'Future',
                    },
                  ]}
                />
              </Form.Item>
            </div>
            <div className='apply-option-item'>
              <Form.Item
                name="tradingPlatformType"
              // className="m0 w306"
              >
                {/* START 冗余 为了页面更新 */}
                {/* <span className='hidden opacity-0'>{loanRequisitionEditModel.tradingPlatformType}</span> */}
                {/* END */}
                <Select
                  popupClassName="bg-#111a2c border-2 border-#303241 border-solid"
                  className="apply-option-item-select"
                  suffixIcon={
                    <img src={jmtzDown} alt="jmtzDown" className="px-20" />
                  }
                  disabled
                  value={
                    loanRequisitionEditModel.tradingPlatformType
                    // === Models.TradingFormType.SpotGoods
                    // ? 'Uniswap'
                    // : 'GMX'
                  }
                  options={[
                    { value: 'Uniswap', label: 'Uniswap' },
                    { value: 'GMX', label: 'GMX' },
                  ]}
                />
              </Form.Item>
            </div>
            <div className='apply-option-item'>
              <Form.Item
                name="transactionPairs"
                // className="m0 mt61"
                style={{
                  display: loanRequisitionEditModel.designatedTransaction
                    ? 'block'
                    : 'none',
                }}
              >
                <Select
                  mode="multiple"
                  popupClassName="bg-#111a2c border-2 border-#303241 border-solid"
                  className="apply-option-item-select"
                  status={selectError ? 'error' : undefined}
                  suffixIcon={
                    <img src={jmtzDown} alt="jmtzDown" className="px-20" />
                  }
                  value={loanRequisitionEditModel.transactionPairs}
                  maxTagCount={1}
                  options={(loanRequisitionEditModel.tradingFormType
                    === Models.TradingFormType.SpotGoods
                    ? [...tradingPairBase, ...tradingPairSpotGoods]
                    : [...tradingPairBase, ...tradingPairContract]
                  ).map(e => ({ value: e.name, label: e.name }))}
                  onSelect={() => {
                    // if (loanRequisitionEditModel!.transactionPairs!.length >= 1)
                    setSelectError(false)
                  }}
                />
              </Form.Item>
            </div>
            <div>
            </div>

          </div >
          <Divider className='w-full'></Divider>
          <div
            style={{
              display: loanRequisitionEditModel.designatedTransaction
                ? 'inline'
                : 'none',
            }}
          >
            <div className="my-50 flex flex-wrap gap-x-52 gap-y-20">
              {loanRequisitionEditModel.transactionPairs?.map((e, i) => (
                <div
                  key={i}
                  className="s-container box-border h50 w-100 flex items-center text-14"
                >
                  {/* <div className='flex items-center'> */}
                  <Image
                    preview={false}
                    width={30}
                    height={30}
                    src={tradingPair.flat().find(p => p.name === e)?.logo}
                  ></Image>
                  <div className='m-4 p-2 text-16'>{e} </div>
                  <Image
                    preview={false}
                    onClick={() => onCoinClick(i)}
                    className='mb-5 cursor-pointer'
                    width={18}
                    height={18}
                    src={isHovered ? xFloatIcon : xGenalIcon}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  />
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
            loading={publishBtnLoading}
            className="h65 w200 b-rd-10 text-18 primary-btn"
          >
            {t('applyLoan.btn.submit')}
          </Button>
        </Form.Item>
      </Form >
      <div className="h44" />
    </div >
  )
}

export default ApplyLoan
