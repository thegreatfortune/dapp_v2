import Select from 'antd/es/select'
import Form from 'antd/es/form'
import Dragger from 'antd/es/upload/Dragger'
import TextArea from 'antd/es/input/TextArea'
import Button from 'antd/es/button'
import Image from 'antd/es/image'
import './style.css'
import { useTranslation } from 'react-i18next'
import InputNumber from 'antd/es/input-number'
import { LoadingOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import Modal from 'antd/es/modal'
import Checkbox from 'antd/es/checkbox'
import { Divider, Spin, Switch, Tooltip, Upload, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { RcFile } from 'antd/es/upload'
import airplane from '@/assets/images/apply-loan/airplane.png'
import jmtzDown from '@/assets/images/apply-loan/jmtz_down.png'
import { LoanRequisitionEditModel } from '@/models/LoanRequisitionEditModel'
import { Models } from '@/.generated/api/models'
import bitcoinIcon from '@/assets/images/apply-loan/token-icons/BTC.png'
import followIcon from '@/assets/images/apply-loan/token-icons/usdc.png'
import ethereumIcon from '@/assets/images/apply-loan/token-icons/ETH.png'
import arbitrumIcon from '@/assets/images/apply-loan/token-icons/ARB.png'
import chainlinkIcon from '@/assets/images/apply-loan/token-icons/LINK.png'
import uniswapIcon from '@/assets/images/apply-loan/token-icons/UNI.png'
import lidofiIcon from '@/assets/images/apply-loan/token-icons/LDO.png'
import makerIcon from '@/assets/images/apply-loan/token-icons/MKR.png'
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

  const { activeUser } = useUserStore()

  const { browserContractService } = useBrowserContract()

  const [loanRequisitionEditModel, setLoanRequisitionEditModel]
    = useState<LoanRequisitionEditModel>(new LoanRequisitionEditModel())

  const [isHovered, setIsHovered] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [documentChecked, setDocumentChecked] = useState(false)

  const [publishBtnLoading, setPublishBtnLoading] = useState<boolean>(false)

  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  const [createdPoolChecked, setCreatedPoolChecked] = useState<boolean>(false)

  const [createdPoolLoading, setCreatedPoolLoading] = useState<boolean>(false)

  const [useDiagram, setUseDiagram] = useState(false)
  /* #endregion */

  const [tradingPair] = useState([
    [
      {
        logo: bitcoinIcon,
        name: 'BTC',
      },
      {
        logo: followIcon,
        name: 'FTT',
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
      {
        logo: makerIcon,
        name: 'MKR',
      },
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
    if (!activeUser.accessToken) {
      message.warning('You must be logged in ')
      navigate('/personal-center')
    }
  }, [activeUser])

  /**
   *  检查订单是否可创建
   */
  useEffect(() => {
    async function fetchData() {
      if (!browserContractService)
        return

      const orderCanCreatedAgain = await browserContractService?.checkOrderCanCreateAgain()

      if (!orderCanCreatedAgain) {
        message.warning('Order can not be created')
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

  // useEffect(() => {
  //   createLoan()
  // }, [loanRequisitionEditModel])

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
      console.log('%c [ error ]-127', 'font-size:13px; background:#38eeb8; color:#7cfffc;', error)
      throw new Error('Image upload failed')
    }
  }

  const handleConfirm = async () => {
    await createLoan(loanRequisitionEditModel)
  }

  async function createLoan(value: Models.LoanContractVO) {
    console.log('%c [createLoan value ]-239', 'font-size:13px; background:#48c27c; color:#8cffc0;', value)

    setPublishBtnLoading(true)

    const poolIsCreated = await checkDoublePoolIsCreated()

    if (poolIsCreated === false)
      return

    const models = { ...value, ...loanRequisitionEditModel }

    await form.validateFields()

    setCreatedPoolLoading(true)
    let url
    if (!models.imageUrl)
      url = await uploadFile()
    setCreatedPoolLoading(false)

    setConfirmLoading(true)

    try {
      setIsModalOpen(true)

      const res = await browserContractService?.capitalPool_createOrder({ ...models, imageUrl: url ?? loanRequisitionEditModel.imageUrl })

      console.log('%c [ res ]-158', 'font-size:13px; background:#b6f031; color:#faff75;', res)

      setDocumentChecked(true)

      navigate('/my-loan')
    }
    catch (error) {
      message.error('operation failure!')
      console.log(
        '%c [ error ]-99',
        'font-size:13px; background:#daf6df; color:#ffffff;',
        error,
      )
      throw new Error('upload image failed')
    }
    finally {
      setConfirmLoading(false)
      setPublishBtnLoading(false)
    }
  }

  async function checkDoublePoolIsCreated(): Promise<boolean> {
    if (createdPoolChecked === true)
      return true

    if (!browserContractService)
      return false

    try {
      const res = await browserContractService?.checkPoolCreateState()

      const [capitalPoolState, refundPoolState] = res ?? [false, false]

      setCreatedPoolChecked(capitalPoolState && refundPoolState)
      if (!(capitalPoolState && refundPoolState)) {
        setIsModalOpen(true)
        setCreatedPoolLoading(true)

        const res = await browserContractService?.followRouter_createPool()

        res?.status === 1 && setCreatedPoolChecked(true)

        return res?.status === 1
      }

      return true
    }
    catch (error) {
      message.error('operation failure')
      console.log(
        '%c [ error ]-61',
        'font-size:13px; background:#c95614; color:#ff9a58;',
        error,
      )
      return false
    }
    finally {
      setCreatedPoolLoading(false)
    }
  }

  const onFinish = async (value: LoanRequisitionEditModel) => {
    console.log('%c [ value ]-331', 'font-size:13px; background:#574880; color:#9b8cc4;', value)

    try {
      setLoanRequisitionEditModel(preState =>
        ({ ...preState, ...value }),
      )

      await createLoan(value)
      // await handleConfirm()
    }
    catch (error) {
      console.error('%c [ error ]-341', 'font-size:13px; background:#96e638; color:#daff7c;', error)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setPublishBtnLoading(false)
  }

  function onValuesChange(val: Record<string, any>) {
    console.log('%c [ val ]-335', 'font-size:13px; background:#2aad7e; color:#6ef1c2;', val)

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
      <Modal
        centered
        styles={{ mask: { backgroundColor: 'rgba(0, 0, 0, 0.8)' } }}
        footer={
          false
        }
        confirmLoading={confirmLoading}
        closable={false}
        okText="Create"
        width={620}
        maskClosable={false}
        open={isModalOpen}
      >
        <div className="box-border flex flex-col items-center text-center text-16">

          <div className="flex flex-col items-start">
            <div>
              {createdPoolLoading
                ? <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
                : <Checkbox disabled checked={createdPoolChecked}>
                </Checkbox>}
              <span className='p-x-8 c-#3CA9F8'>Pool contract</span>
            </div>

            <div>
              {confirmLoading
                ? <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
                : <Checkbox disabled checked={documentChecked}>
                </Checkbox>}
              <span className='p-x-8 c-#3CA9F8'> Create document</span>

            </div>
          </div>

        </div>

        <div className="h16" />

        <div className="flex justify-center gap-x-8">
          <Button
            className='h32 w84 rounded-2 primary-btn'
            onClick={() => handleConfirm()}
            loading={confirmLoading}
            disabled={createdPoolLoading}
          >
            Confirm
          </Button>
          <Button className='h32 w77 rounded-2 bg-#F2F3F5 text-14 c-#1F1F1F' onClick={handleCancel}>
            Cancel
          </Button>
        </div>

      </Modal>

      <Form
        form={form}
        initialValues={loanRequisitionEditModel}
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        name="apply-loan-form"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <div className="w-full flex justify-between">
          <Form.Item
            name="imageUrl"
            className="m0 box-border h453 w-453 border-1 border-#303241 rounded-20 border-solid bg-#171822"
            valuePropName="file"
            getValueFromEvent={e => e.fileList}
            rules={projectImageFileRule}
          >
            <div className="relative m0 box-border h453 w-453 border-1 border-#303241 rounded-20 border-solid bg-#171822">
              <span className="absolute right-40 top-16 z-10 text-14">Use default diagram <Switch checkedChildren="ON" unCheckedChildren="OFF" onChange={onSwitchChange} /></span>
              <Dragger
                name="imageUrl"
                action={uploadFile}
                beforeUpload={beforeUpload}
                style={{ height: 453 }}
                disabled={useDiagram}
                showUploadList={false}
                accept='.png,.jpg,.jpeg'
              >

                {
                  !useDiagram
                  && <div>
                    {
                      loanRequisitionEditModel.projectImagePreViewUrl
                        ? <Image height={348} width={400} src={loanRequisitionEditModel.projectImagePreViewUrl} preview={false} />
                        : <div>
                          <Image src={airplane} preview={false} />
                          <p className="ant-upload-drag-icon"></p>
                          <p className="ant-upload-text !text-28 !font-bold">
                            {t('applyLoan.formItem.upload.title')}
                          </p>
                          <p className="ant-upload-hint !text-18">
                            800 x 800px {t('applyLoan.formItem.upload.description')}
                          </p>
                        </div>
                    }
                  </div>
                }

                {
                  useDiagram
                  && <Image preview={false} src={defaultImage} />
                }

              </Dragger>
            </div>
          </Form.Item>

          <div className="w-917">
            <Form.Item
              name="itemTitle"
              className="m0 w-full"
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
            >
              <TextArea
                className="s-container text-14"
                placeholder={t('applyLoan.formItem.item.placeholder')}
                style={{ height: 102, resize: 'none' }}
              />
            </Form.Item>

            <div className="h16"></div>

            <Form.Item
              name="description"
              className="m0 w-full"
              label={
                <span className="p0 text-16">
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
            >
              <TextArea
                className="s-container text-14"
                placeholder={t(
                  'applyLoan.formItem.item.description.placeholder',
                )}
                style={{ height: 269, resize: 'none' }}
              />
            </Form.Item>
          </div>
        </div>

        <div className="h-50" />

        {/* Apply for a loan */}
        <div className="box-border h-394 w-full flex flex-wrap gap-x-52 rounded-20 from-#0E0F14 to-#16273B bg-gradient-to-br px30 pb-16 pt-44 text-16">
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
          >
            <InputNumber
              min={100}
              max={1000000}
              className="box-border h50 w412 items-center s-container px-30 pr-106 text-14"
              suffix={<div className="px-20 text-14">USDC</div>}
            />
          </Form.Item>

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
          >
            <Select
              popupClassName="bg-#111a2c border-2 border-#303241 border-solid px30"
              className="box-border h50 s-container text-24 !w412"
              suffixIcon={
                <img src={jmtzDown} alt="jmtzDown" className="px30" />
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
              popupClassName="bg-#111a2c border-2 border-#303241 border-solid px30"
              className="box-border h50 s-container text-14 !w412"
              suffixIcon={
                <img src={jmtzDown} alt="jmtzDown" className="px30" />
              }
              options={[
                { value: 1, label: 1 },
                { value: 2, label: 2 },
                { value: 5, label: 5 },
                { value: 10, label: 10 },
              ]}
            />
          </Form.Item>

          {/* Second */}

          <Form.Item
            name="dividend"
            label={
              <span className="text-16">
                {t('applyLoan.formItem.dividend.label')}
                <Tooltip color='#303241' overlayInnerStyle={{ padding: 25 }} title="he dividend ratio is profit dividends. The remaining funds after deducting principal + interest + handling fees from the repayment pool funds are profits. Part of the profits will be deducted according to the allocation ratio and given to the lender.">
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
              className="box-border h50 w412 items-center s-container px-30 pr-106 text-14"
              suffix={<div className="px-20 text-14">%</div>}
            />
          </Form.Item>

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

                <Tooltip color='#303241' overlayInnerStyle={{ padding: 25 }} title="hInterest is deducted first, and the lender only needs to provide funds after interest is deducted.">
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
              className="box-border h50 w412 items-center s-container px-30 pr-106 text-14"
              suffix={<div className="px-20 text-14">%</div>}
            />
          </Form.Item>

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
              popupClassName="bg-#111a2c border-2 border-#303241 border-solid px30"
              className="box-border h50 s-container text-14 !w412"
              suffixIcon={
                <img src={jmtzDown} alt="jmtzDown" className="px30" />
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

          {/* Three */}

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
              className="box-border h50 w412 items-center s-container px-30 pr-106 text-14"
              suffix={<div className="px-20 text-14">share</div>}
            />
          </Form.Item>

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
                className="box-border h50 w412 items-center s-container px-30 pr-106 text-14"
                suffix={<div className="px-20 text-14">share</div>}
              />
            </Form.Item>
          }

        </div>

        <div className="h50" />

        <div className='flex gap-x-42'>
          <div>
            <div className="flex gap-x-53">
              <Form.Item
                name="designatedTransaction"
                rules={[
                  {
                    required: true,
                    message: 'Please input content!',
                  },
                ]}
                className="m0"
                label={
                  <span className="text-16">
                    {t('applyLoan.formItem.designatedTransaction.label')}
                  </span>
                }
              >
                <Select
                  popupClassName="bg-#111a2c border-2 border-#303241 border-solid px30"
                  className="box-border h50 s-container text-14 !w306"
                  suffixIcon={
                    <img src={jmtzDown} alt="jmtzDown" className="px30" />
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

              <Form.Item
                name="transactionPairs"
                className="m0 mt34"
                style={{
                  display: loanRequisitionEditModel.designatedTransaction
                    ? 'block'
                    : 'none',
                }}
              >
                <Select
                  mode="multiple"
                  popupClassName="bg-#111a2c border-2 border-#303241 border-solid px30"
                  className="box-border h50 s-container text-14 !w306"
                  suffixIcon={
                    <img src={jmtzDown} alt="jmtzDown" className="px30" />
                  }
                  value={loanRequisitionEditModel.transactionPairs}
                  maxTagCount={1}
                  options={(loanRequisitionEditModel.tradingFormType
                    === Models.TradingFormType.SpotGoods
                    ? [...tradingPairBase, ...tradingPairSpotGoods]
                    : [...tradingPairBase, ...tradingPairContract]
                  ).map(e => ({ value: e.name, label: e.name }))}
                // onChange={onTradingPairChange}
                />
              </Form.Item>
            </div>

            <div className="h30"></div>

            <div
              style={{
                display: loanRequisitionEditModel.designatedTransaction
                  ? 'block'
                  : 'none',
              }}
            >
              <div className="flex">
                <div className="h186 flex flex-col flex-wrap gap-y-30">
                  <Form.Item
                    name="tradingFormType"
                    className="m0 w306"
                  >
                    <Select
                      popupClassName="bg-#111a2c border-2 border-#303241 border-solid px30"
                      className="box-border h50 s-container text-14 !w306"
                      suffixIcon={
                        <img src={jmtzDown} alt="jmtzDown" className="px30" />
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
                          label: 'Spot goods',
                        },
                        {
                          value: Models.TradingFormType.Contract,
                          label: 'Contract',
                        },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    name="tradingPlatformType"
                    className="m0 w306"
                  >
                    {/* START 冗余 为了页面更新 */}
                    {/* <span className='hidden opacity-0'>{loanRequisitionEditModel.tradingPlatformType}</span> */}
                    {/* END */}
                    <Select
                      popupClassName="bg-#111a2c border-2 border-#303241 border-solid px30"
                      className="box-border h50 s-container !w306 !text-14"
                      suffixIcon={
                        <img src={jmtzDown} alt="jmtzDown" className="px30" />
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
              </div>
            </div>
          </div>

          <Divider type='vertical' className='mx-0 mt-36 h-210 w1 border-none bg-#696969' />

          <div
            style={{
              display: loanRequisitionEditModel.designatedTransaction
                ? 'block'
                : 'none',
            }}
          >
            <div className="mt-30 flex flex-wrap gap-x-52 gap-y-20">
              {loanRequisitionEditModel.transactionPairs?.map((e, i) => (
                <div
                  key={i}
                  className="box-border h50 w180 flex items-center justify-center gap-x-27 s-container text-14"
                >
                  <div>
                    <Image
                      preview={false}
                      width={24}
                      height={24}
                      src={tradingPair.flat().find(p => p.name === e)?.logo}
                    ></Image>
                    <span className='ml-4 p-2 text-16'>{e} </span>
                  </div>

                  <Image
                    preview={false}
                    onClick={() => onCoinClick(i)}
                    className='cursor-pointer'
                    width={18}
                    height={18}
                    src={isHovered ? xFloatIcon : xGenalIcon}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  />

                </div>
              ))}
            </div>
          </div>
        </div>

        <Divider className='m0 bg-#6A6A6A' />

        <div className="h44" />

        <Form.Item className="text-center">
          <Button
            type="primary"
            htmlType="submit"
            loading={publishBtnLoading}
            className="h78 w300 text-16 primary-btn"
          >
            {t('applyLoan.btn.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ApplyLoan
