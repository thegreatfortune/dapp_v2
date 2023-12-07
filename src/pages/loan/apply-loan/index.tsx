import Select from 'antd/es/select'
import Form from 'antd/es/form'
import Dragger from 'antd/es/upload/Dragger'
import TextArea from 'antd/es/input/TextArea'
import Button from 'antd/es/button'
import Image from 'antd/es/image'
import './style.css'
import { useTranslation } from 'react-i18next'
import InputNumber from 'antd/es/input-number'
import { useEffect, useState } from 'react'
import Modal from 'antd/es/modal'
import Checkbox from 'antd/es/checkbox'
import { Divider, Switch, Tooltip, Upload, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { RcFile } from 'antd/es/upload'
import airplane from '@/assets/images/apply-loan/airplane.png'
import jmtzDown from '@/assets/images/apply-loan/jmtz_down.png'
import { LoanRequisitionEditModel } from '@/models/LoanRequisitionEditModel'
import { Models } from '@/.generated/api/models'
import bitcoinIcon from '@/assets/images/apply-loan/token-logos/spot-goods/bitcoin.png'
import followIcon from '@/assets/images/apply-loan/token-logos/spot-goods/follow.png'
import ethereumIcon from '@/assets/images/apply-loan/token-logos/spot-goods/ethereum.png'
import arbitrumIcon from '@/assets/images/apply-loan/token-logos/spot-goods/arbitrum.webp'
import chainlinkIcon from '@/assets/images/apply-loan/token-logos/spot-goods/chainlink.webp'
import uniswapIcon from '@/assets/images/apply-loan/token-logos/spot-goods/uniswap.webp'
import lidofiIcon from '@/assets/images/apply-loan/token-logos/spot-goods/lidofi.webp'
import makerIcon from '@/assets/images/apply-loan/token-logos/spot-goods/maker.webp'
import aaveIcon from '@/assets/images/apply-loan/token-logos/spot-goods/aave-new.webp'
import solanaIcon from '@/assets/images/apply-loan/token-logos/contract/solana.png'
import dogecoinIcon from '@/assets/images/apply-loan/token-logos/contract/dogecoin.png'
import rippleIcon from '@/assets/images/apply-loan/token-logos/contract/ripple.png'
import litecoinIcon from '@/assets/images/apply-loan/token-logos/contract/litecoin.png'
import xIcon from '@/assets/images/apply-loan/x.png'
import infoIconIcon from '@/assets/images/apply-loan/InfoIcon.png'
import useBrowserContract from '@/hooks/useBrowserContract'
import defaultImage from '@/assets/images/default.png'
import { FileService } from '@/.generated/api/File'
import { handleImageCanvas } from '@/utils/handleImageCanvas'
import { maskWeb3Address } from '@/utils/maskWeb3Address'

const ApplyLoan = () => {
  /* #region  */
  const [form] = Form.useForm()

  const { t } = useTranslation()

  const navigate = useNavigate()

  const { browserContractService } = useBrowserContract()

  const [loanRequisitionEditModel, setLoanRequisitionEditModel]
    = useState<LoanRequisitionEditModel>(new LoanRequisitionEditModel())

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [checkers, setCheckers] = useState([false, false, false])

  const [publishBtnLoading, setPublishBtnLoading] = useState<boolean>(false)

  const [capitalPoolLoading, setCapitalPoolLoading] = useState<boolean>(false)

  const [repaymentPoolLoading, setRepaymentPoolLoading]
    = useState<boolean>(false)

  const [createLoading, setCreateLoading] = useState<boolean>(false)

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
        name: 'FollowToken',
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
  const [capitalPoolChecked, repaymentPoolChecked, documentChecked] = checkers

  const [projectImageFileRule, setProjectImageFileRule] = useState([
    {
      required: true,
      message: 'Please upload your loan image!',
    },
  ])

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

  useEffect(() => {
    publishBtnLoading && createLoan()
  }, [publishBtnLoading, loanRequisitionEditModel])

  useEffect(() => {
    createLoan()
  }, [loanRequisitionEditModel.imageUrl])

  useEffect(() => {
    async function fetchData() {
      try {
        if (useDiagram) {
          const { itemTitle, applyLoan, tradingFormType, interest, dividend } = loanRequisitionEditModel
          const newFile = await handleImageCanvas('src/assets/images/default.png', [itemTitle,
            browserContractService?.getSigner.address ? maskWeb3Address(browserContractService?.getSigner.address) : '',
            String(applyLoan ?? 0),
            tradingFormType === 'SpotGoods' ? 'Low' : 'Hight',
            `${interest ?? 0}%`, `${dividend ?? 0}%`])

          if (!newFile)
            throw new Error('Image upload failed')

          // const previewImageUrl = URL.createObjectURL(newFile)

          // setLoanRequisitionEditModel(preState => ({ ...preState, projectImagePreViewUrl: previewImageUrl, projectImageFile: newFile }))

          setLoanRequisitionEditModel(preState => ({ ...preState, projectImageFile: newFile }))

          const url = await FileService.ApiFileUpload_POST({ file: newFile })

          setLoanRequisitionEditModel(preState => ({ ...preState, imageUrl: url }))
        }
        else {
          if (loanRequisitionEditModel.projectImagePreViewUrl) {
            const url = await FileService.ApiFileUpload_POST({ file: loanRequisitionEditModel.projectImageFile })

            setLoanRequisitionEditModel(preState => ({ ...preState, imageUrl: url }))
          }
        }
      }
      catch (error) {
        console.log('%c [ error ]-127', 'font-size:13px; background:#38eeb8; color:#7cfffc;', error)
        throw new Error('Image upload failed')
      }
    }

    capitalPoolChecked && repaymentPoolChecked && fetchData()
  }, [capitalPoolChecked, repaymentPoolChecked])

  // async function reSet() {
  //   try {
  //     // const cp = await browserContractService?.getCapitalPoolAddress(testTradeId)

  //     const followCapitalPoolContract
  //       = await browserContractService?.getCapitalPoolContract()
  //     console.log('%c [ followCapitalPoolContract ]-122', 'font-size:13px; background:#6485d8; color:#a8c9ff;', followCapitalPoolContract)

  //     await followCapitalPoolContract?.initCreateOrder()
  //   }
  //   catch (error) {
  //     console.log(
  //       '%c [ error ]-75',
  //       'font-size:13px; background:#69bdf3; color:#adffff;',
  //       error,
  //     )
  //   }
  // }

  const handleOk = async (value: LoanRequisitionEditModel) => {
    console.log('%c [ value ]-146', 'font-size:13px; background:#5df584; color:#a1ffc8;', value)
    setPublishBtnLoading(true)

    // if (!useDiagram)
    //   message.warning('Project image not upload, or use default diagram?')

    await checkDoublePoolIsCreated()
    // await createLoan()
  }

  async function createLoan() {
    console.log('%c [ loanRequisitionEditModel ]-214', 'font-size:13px; background:#0c926b; color:#50d6af;', loanRequisitionEditModel)

    console.log('%c [ new state:  ]-179', 'font-size:13px; background:#75dde6; color:#b9ffff;', capitalPoolChecked, repaymentPoolChecked)

    if (!capitalPoolChecked || !repaymentPoolChecked) {
      console.log('%c [error: capitalPoolChecked  repaymentPoolChecked]-170', 'font-size:13px; background:#56fd4f; color:#9aff93;', capitalPoolChecked, repaymentPoolChecked)
      return
    }

    console.log('%c [ 执行 ]-181', 'font-size:13px; background:#896f7b; color:#cdb3bf;')

    setCreateLoading(true)

    try {
      setIsModalOpen(true)

      // TODO: decimals token标志位
      const res = await browserContractService?.capitalPool_createOrder(loanRequisitionEditModel)

      console.log('%c [ res ]-158', 'font-size:13px; background:#b6f031; color:#faff75;', res)

      setCheckers((prevState) => {
        const newArray = [...prevState]
        newArray[2] = true
        return newArray
      })

      navigate('/my-loan')
    }
    catch (error) {
      message.error('操作失败')
      console.log(
        '%c [ error ]-99',
        'font-size:13px; background:#daf6df; color:#ffffff;',
        error,
      )
    }
    finally {
      setCreateLoading(false)
      setPublishBtnLoading(false)
    }
  }

  async function checkRepaymentPoolChecked() {
    // 检查是否创建还款池
    if (!repaymentPoolChecked) {
      setRepaymentPoolLoading(true)

      const followRefundFactoryContract
        = await browserContractService?.getRefundFactoryContract()

      const capitalPoolAddress = await browserContractService?.getCapitalPoolAddress()

      const isCreated
        = (await followRefundFactoryContract?.getIfCreateRefundPool(
          capitalPoolAddress ?? '',
        )) === BigInt(1)

      setCheckers((prevState) => {
        const newArray = [...prevState]
        newArray[1] = isCreated
        return newArray
      })

      if (!isCreated) {
        setIsModalOpen(true)
        const res = await followRefundFactoryContract?.createRefundPool()
        const result = await res?.wait()

        setCheckers((prevState) => {
          const newArray = [...prevState]
          newArray[1] = result?.status === 1
          return newArray
        })
      }
      setRepaymentPoolLoading(false)
    }
  }

  async function checkCapitalPoolChecked() {
    // 检查是否创建资金池
    if (!capitalPoolChecked) {
      const followFactoryContract
        = await browserContractService?.getFollowFactoryContract()

      setCapitalPoolLoading(true)
      const isCreated
        = (await followFactoryContract?.getIfCreate(browserContractService?.getSigner?.address ?? ''))
        === BigInt(1)

      setCheckers((prevState) => {
        const newArray = [...prevState]
        newArray[0] = isCreated
        return newArray
      })

      if (isCreated === false) {
        setIsModalOpen(true)

        const res = await followFactoryContract?.magicNewCapitalPool(
          browserContractService?.getSigner?.address ?? '',
        )

        const result = await res?.wait()

        setCheckers((prevState) => {
          const newArray = [...prevState]
          newArray[0] = result?.status === 1
          return newArray
        })
      }

      setCapitalPoolLoading(false)
    }
  }

  async function checkDoublePoolIsCreated() {
    try {
      await checkCapitalPoolChecked()

      await checkRepaymentPoolChecked()
      // if (repaymentPoolChecked && !documentChecked) {
      //   setDocumentLoading(true)

      //   await handleOk()

      //   setDocumentLoading(false)
      // }

      setPublishBtnLoading(false)
    }
    catch (error) {
      console.log(
        '%c [ error ]-61',
        'font-size:13px; background:#c95614; color:#ff9a58;',
        error,
      )
    }
    finally {
      setPublishBtnLoading(false)
      setRepaymentPoolLoading(false)
      setCapitalPoolLoading(false)
    }
  }

  function checkFileUploaded(): boolean {
    if (!loanRequisitionEditModel.imageUrl) {
      if (!useDiagram && !loanRequisitionEditModel.projectImagePreViewUrl) {
        message.warning('Project image not upload, or use default diagram?')
        return false
      }
    }

    return true
  }

  const onFinish = async (value: LoanRequisitionEditModel) => {
    console.log('%c [ value ]-319', 'font-size:13px; background:#115dc6; color:#55a1ff;', value)
    const state = checkFileUploaded()
    if (state === false)
      return

    setPublishBtnLoading(true)

    try {
      // await checkDoublePoolIsCreated()

      // await createLoan()
      setLoanRequisitionEditModel(preState =>
        ({ ...preState, ...value }),
      )

      await handleOk(value)

      setPublishBtnLoading(false)
      setIsModalOpen(true)
    }
    catch (error) {
      console.log(
        '%c [ error ]-61',
        'font-size:13px; background:#c95614; color:#ff9a58;',
        error,
      )
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
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
      {/* <Button onClick={reSet}>重置（test）</Button> */}
      <Modal
        footer={(_, { CancelBtn }) => (
          <>
            {/* <Button>Custom Button</Button> */}
            <CancelBtn />
            <Button
              onClick={() => handleOk(loanRequisitionEditModel)}
              loading={createLoading}
              disabled={repaymentPoolLoading || capitalPoolLoading}
            >
              Confirm
            </Button>
          </>
        )}
        confirmLoading={createLoading}
        okText="Create"
        width={1164}
        maskClosable={false}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <div className="mt165 box-border h-300 w-full text-center text-16">
          <p>Please confirm that it cannot be modified after submission.</p>
          <p>Creating the document requires gas fees to create:</p>

          <div>
            {capitalPoolLoading
              ? (
                <Button type="primary" loading={capitalPoolLoading} />
                )
              : null}
            <Checkbox disabled checked={capitalPoolChecked} >
              Capital pool contract
            </Checkbox>
          </div>

          <div>
            {capitalPoolChecked && repaymentPoolLoading
              ? (
                <Button
                  type="primary"
                  loading={capitalPoolChecked && repaymentPoolLoading}
                />
                )
              : null}
            <Checkbox
              disabled
              checked={repaymentPoolChecked}
            >
              Create a repayment pool
            </Checkbox>
          </div>

          <div>
            {createLoading
              ? (
                <Button type="primary" loading={createLoading} />
                )
              : null}
            <Checkbox disabled checked={documentChecked} >
              Create document
            </Checkbox>
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
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <div className="w-full flex justify-between">
          <Form.Item
            name="projectImageFile"
            className="m0 box-border h453 w-453 border-1 border-#303241 rounded-20 border-solid bg-#171822"
            valuePropName="file"
            getValueFromEvent={e => e.fileList}
            rules={projectImageFileRule}
          >
            <div className="relative m0 box-border h453 w-453 border-1 border-#303241 rounded-20 border-solid bg-#171822">
              <span className="absolute right-40 top-16 z-10 text-14">Use default diagram <Switch checkedChildren="ON" unCheckedChildren="OFF" onChange={onSwitchChange} /></span>
              <Dragger
                name="projectImageFile"
                // action={uploadFile}
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

        <div className="h-51" />

        {/* Apply for a loan */}
        <div className="box-border h-434 w-full flex flex-wrap gap-x-52 rounded-20 from-#0E0F14 to-#16273B bg-gradient-to-br px30 pb-6 pt-44 text-16">
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
                // min={2}
                max={10000}
                className="box-border h50 w412 items-center s-container px-30 pr-106 text-14"
                suffix={<div className="px-20 text-14">share</div>}
              />
            </Form.Item>
          }

        </div>

        <div className="h80" />

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

            <div className="h50"></div>

            <div
              style={{
                display: loanRequisitionEditModel.designatedTransaction
                  ? 'block'
                  : 'none',
              }}
            >
              <div className="flex">
                <div className="h236 flex flex-col flex-wrap gap-y-50">
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

          <Divider type='vertical' className='mx-0 mt-47 h-276 w1 border-none bg-#696969' />

          <div
            style={{
              display: loanRequisitionEditModel.designatedTransaction
                ? 'block'
                : 'none',
            }}
          >
            <div className="mt-34 flex flex-wrap gap-x-52 gap-y-20">
              {loanRequisitionEditModel.transactionPairs?.map((e, i) => (
                <div
                  key={i}
                  className="box-border h50 w180 flex justify-around gap-x-27 s-container p15 text-14"
                >
                  <div className='flex'>
                    <Image
                      preview={false}
                      width={18}
                      height={18}
                      src={tradingPair.flat().find(p => p.name === e)?.logo}
                    ></Image>
                    <span className='ml-4 p-2'>{e} </span>
                  </div>

                  <Image
                    onClick={() => onCoinClick(i)}
                    className='cursor-pointer'
                    preview={false}
                    width={18}
                    height={18}
                    src={xIcon}
                  ></Image>

                </div>
              ))}
            </div>
          </div>
        </div>

        <Divider className='m0 bg-#6A6A6A' />

        <div className="h82" />

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
