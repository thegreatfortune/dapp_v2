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
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import Checkbox from 'antd/es/checkbox'
import type { JsonRpcSigner } from 'ethers'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { LoanService } from '../../.generated/api/Loan'
import airplane from '@/assets/images/airplane.png'
import jmtzDown from '@/assets/images/jmtz_down.png'
import { BrowserContractService } from '@/contract/browserContractService'
import { LoanRequisitionEditModel } from '@/models/LoanRequisitionEditModel'
import type { FollowCapitalPool, FollowFactory } from '@/abis/types'
import { Models } from '@/.generated/api/models'
import logo from '@/assets/react.svg'
import BTC_logo from '@/assets/images/token-logos/spot-goods/bitcoin.webp'

const ApplyLoan = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [capitalPoolChecked, setCapitalPoolChecked] = useState(false)

  const [repaymentPoolChecked, setRepaymentPoolChecked] = useState(false)

  const [documentChecked, setDocumentChecked] = useState(false)

  const [publishBtnLoading, setPublishBtnLoading] = useState<boolean>(false)

  const [capitalPoolLoading, setCapitalPoolLoading] = useState<boolean>(false)

  const [repaymentPoolLoading, setRepaymentPoolLoading] = useState<boolean>(false)

  const [createLoading, setCreateLoading] = useState<boolean>(false)

  const [documentLoading, setDocumentLoading] = useState<boolean>(false)

  const [followFactoryContract, setFollowFactoryContract] = useState<FollowFactory>()

  const [followCapitalPoolContract, setFollowCapitalPoolContract] = useState<FollowCapitalPool>()

  const [signer, setSigner] = useState<JsonRpcSigner | undefined>()

  const [capitalPoolAddress, setCapitalPoolAddress] = useState<string>('')

  const [loanRequisitionEditModel, setLoanRequisitionEditModel] = useState<LoanRequisitionEditModel>(new LoanRequisitionEditModel())

  const [tradingPair, setTradingPair] = useState([[
    {
      logo: BTC_logo,
      name: 'BTC',
    },
    {
      logo: '',
      name: 'ETH',
    },
    {
      logo: '',
      name: 'ARB',
    },
    {
      logo: '',
      name: 'LINK',
    },
    {
      logo: '',
      name: 'UNI',
    },
  ],
  [
    {
      logo: '',
      name: 'LDO',
    },
    {
      logo: '',
      name: 'MKR',
    },
    {
      logo: '',
      name: 'AAVE',
    },
  ],
  [
    {
      logo: '',
      name: 'SOL',
    },
    {
      logo: '',
      name: 'DOGE',
    },
    {
      logo: '',
      name: 'XRB',
    },
    {
      logo: '',
      name: 'LTC',
    },
  ]])

  const [tradingPairBase, tradingPairSpotGoods, tradingPairContract] = tradingPair

  const [loanConfirm, setLoanConfirm] = useState(new Models.LoanConfirmParam())

  async function reSet() {
    // 重置
    try {
      await followCapitalPoolContract?.initCreateTrade()
    }
    catch (error) {
      console.log('%c [ error ]-75', 'font-size:13px; background:#69bdf3; color:#adffff;', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const followFactoryContract = await BrowserContractService.getFollowFactoryContract()

        const signer = await BrowserContractService.getSigner()

        const capitalPoolAddress = await followFactoryContract?.AddressGetCapitalPool(signer?.address ?? '')

        setCapitalPoolAddress(capitalPoolAddress)

        const followCapitalPoolContract = await BrowserContractService.getFollowCapitalPoolContract()

        setFollowCapitalPoolContract(followCapitalPoolContract)

        setSigner(signer)

        setFollowFactoryContract(followFactoryContract)
      }
      catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
  }, [])

  const handleOk = async () => {
    await checkDoublePoolIsCreated()

    setCreateLoading(true)

    try {
      setIsModalOpen(true)

      loanRequisitionEditModel.raisingTime = loanRequisitionEditModel.raisingTime * 24 * 60 * 60

      loanRequisitionEditModel.interest = loanRequisitionEditModel.interest * 100

      const res = await followCapitalPoolContract?.createOrder(
        [BigInt(loanRequisitionEditModel.cycle),
          BigInt(loanRequisitionEditModel.period)],
        [BigInt(loanRequisitionEditModel.interest),
          BigInt(loanRequisitionEditModel.dividend),
          BigInt(loanRequisitionEditModel.numberOfCopies),
          BigInt(loanRequisitionEditModel.minimumRequiredCopies)],
        BigInt(loanRequisitionEditModel.raisingTime),
        BigInt(loanRequisitionEditModel.applyLoan),
      )

      const result = await res?.wait()

      if (result?.status === 1) {
        const followManageContract = await BrowserContractService.getFollowManageContract()

        await followManageContract.getborrowerAllOrdersId(signer ?? '', capitalPoolAddress)

        // const loanConfirmT = new Models.LoanConfirmParam()

        // loanConfirmT.loanName = value.itemTitle!
        // loanConfirmT.loanIntro = value.description!
        // loanConfirmT.transactionPairs = value.transactionPairs
        // loanConfirmT.tradingFormType = value.tradingFormType
        // loanConfirmT.tradingPlatformType = value.tradingPlatformType

        console.log('%c [ loanRequisitionEditModel ]-201', 'font-size:13px; background:#0d9e51; color:#51e295;', loanRequisitionEditModel)

        // setLoanConfirm({
        //   ...loanConfirm,
        //   loanName: loanRequisitionEditModel.itemTitle ?? 'itemTitle',
        //   loanIntro: loanRequisitionEditModel.description ?? 'description',
        //   transactionPairs: loanRequisitionEditModel.transactionPairs,
        //   tradingFormType: loanRequisitionEditModel.tradingFormType ?? 'SpotGoods',
        //   tradingPlatformType: loanRequisitionEditModel.tradingPlatformType ?? 'Uniswap',
        // })
        // console.log('%c [ loanConfirm ]-188', 'font-size:13px; background:#09ad24; color:#4df168;', loanConfirm)

        // await LoanService.ApiLoanConfirm_POST(loanConfirm)

        setDocumentChecked(true)

        navigate('/my-loan')
      }
    }
    catch (error) {
      message.error(JSON.stringify(error))
      console.log('%c [ error ]-99', 'font-size:13px; background:#daf6df; color:#ffffff;', error)
    }
    finally {
      setCreateLoading(false)
    }
  }

  async function checkDoublePoolIsCreated() {
    try {
      // 检查是否创建资金池
      if (!capitalPoolChecked) {
        setCapitalPoolLoading(true)
        const isCreated = (await followFactoryContract?.getIfCreate(signer?.address ?? '')) === BigInt(1)

        console.log('%c [ capitalPoolChecked ]-211', 'font-size:13px; background:#137113; color:#57b557;', capitalPoolChecked)

        setCapitalPoolChecked(isCreated)
        console.log('%c [ capitalPoolChecked ]-211', 'font-size:13px; background:#137113; color:#57b557;', capitalPoolChecked)

        if (isCreated === false) {
          setIsModalOpen(true)

          const res = await followFactoryContract?.magicNewCapitalPool(signer?.address ?? '')

          const result = await res?.wait()

          setCapitalPoolChecked(result?.status === 1)
        }

        setCapitalPoolLoading(false)
      }

      console.log('%c [ capitalPoolChecked ]-211', 'font-size:13px; background:#137113; color:#57b557;', capitalPoolChecked)

      // 检查是否创建还款池
      if (!repaymentPoolChecked) {
        setRepaymentPoolLoading(true)

        const followRefundFactoryContract = await BrowserContractService.getFollowRefundFactoryContract()

        const isCreated = (await followRefundFactoryContract.getIfCreateRefundPool(capitalPoolAddress ?? '')) === BigInt(1)

        setRepaymentPoolChecked(isCreated)

        if (!isCreated) {
          setIsModalOpen(true)
          const res = await followRefundFactoryContract.createRefundPool()
          const result = await res?.wait()

          setRepaymentPoolChecked(result?.status === 1)
        }
        setRepaymentPoolLoading(false)
      }

      // if (repaymentPoolChecked && !documentChecked) {
      //   setDocumentLoading(true)

      //   // TODO 如果已有订单 并且未清算则不能继续创建订单 (还有黑名单检查)

      //   await handleOk()

      //   setDocumentLoading(false)
      // }

      setPublishBtnLoading(false)
    }
    catch (error) {
      message.error(JSON.stringify(error))
      console.log('%c [ error ]-61', 'font-size:13px; background:#c95614; color:#ff9a58;', error)
    }
    finally {
      setPublishBtnLoading(false)
      setRepaymentPoolLoading(false)
      setCapitalPoolLoading(false)
    }
  }

  const onFinish = async (value: LoanRequisitionEditModel) => {
    setPublishBtnLoading(true)
    setLoanRequisitionEditModel(value)

    setLoanConfirm({
      ...loanConfirm,
      loanName: value.itemTitle ?? '',
      loanIntro: value.description ?? '',
      transactionPairs: value.transactionPairs,
      tradingFormType: value.tradingFormType,
      tradingPlatformType: value.tradingPlatformType,
    })

    try {
      // await checkDoublePoolIsCreated()

      await handleOk()

      setPublishBtnLoading(false)
      setIsModalOpen(true)
    }
    catch (error) {
      console.log('%c [ error ]-61', 'font-size:13px; background:#c95614; color:#ff9a58;', error)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`)
  }

  const beforeUpload = () => {
    // if (file.size / 1024 / 1024 > 2) {
    //   message.error('File must be smaller than 2MB!')
    //   return false
    // }
    return true
  }

  function onTradingPairChange(v: string[]) {
    setLoanRequisitionEditModel(prevState => ({
      ...prevState,
      transactionPairs: v,
    }))
  }

  return (
    <div>
      <Button onClick={reSet}>重置（test）</Button>
      <Modal
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {/* <Button>Custom Button</Button> */}
            <CancelBtn />
            <Button onClick={handleOk} loading={createLoading} disabled={repaymentPoolLoading || capitalPoolLoading}>Confirm</Button>
          </>
        )}
        confirmLoading={createLoading} okText="Create" width={1164} maskClosable={false} open={isModalOpen} onCancel={handleCancel}>
        <div className='mt165 box-border h-300 w-full text-center text-16'>
          <p>
            Please confirm that it cannot be modified after submission.
          </p>
          <p>
            Creating the document requires gas fees to create:
          </p>

          <div>
            {capitalPoolLoading
              ? <Button
                type="primary"
                loading={capitalPoolLoading}
              />
              : null

            }
            <Checkbox disabled checked={capitalPoolChecked} onChange={onChange}>Capital pool contract</Checkbox>
          </div>

          <div>
            {
              capitalPoolChecked && repaymentPoolLoading
                ? <Button
                  type="primary"
                  loading={capitalPoolChecked && repaymentPoolLoading}
                />
                : null
            }
            <Checkbox disabled checked={repaymentPoolChecked} onChange={onChange}>Create a repayment pool</Checkbox>
          </div>

          <div>
            {
              createLoading
                ? <Button
                  type="primary"
                  loading={createLoading}
                />
                : null
            }
            <Checkbox disabled checked={documentChecked} onChange={onChange}>Create document</Checkbox>
          </div>
        </div>

      </Modal>
      <div className="h112"></div>
      <Form
        form={form}
        // initialValues={loanRequisitionEditModel}
        layout='vertical'
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        name="apply-loan-form"
        onFinish={onFinish}
      >
        <div className="w-full flex justify-between">

          <Form.Item
            name="file"
            className="m0 box-border h561 w-639 border-1 border-#303241 rounded-20 border-solid bg-#171822"
            valuePropName="fileList"
            getValueFromEvent={e => e.fileList}
          // rules={[
          //   {
          //     required: true,
          //     message: 'Please upload your file!',
          //   },
          // ]}
          >
            <div
              className="m0 box-border h561 w-639 border-1 border-#303241 rounded-20 border-solid bg-#171822"
            >
              <Dragger
                name="file"
                multiple={true}
                action="/upload.do"
                style={{ height: 561 }}
                beforeUpload={beforeUpload}
              >
                <Image src={airplane} preview={false} />

                <p className="ant-upload-drag-icon"></p>
                <p className="ant-upload-text !text-36 !font-bold">{t('applyLoan.formItem.upload.title')}</p>
                <p className="ant-upload-hint !text-24">
                  800 x 800px {t('applyLoan.formItem.upload.description')}
                </p>
              </Dragger>
            </div>
          </Form.Item>

          <div className="w-735">
            <Form.Item
              name="itemTitle"
              className='w-full'
              label={<span className="text-24">{t('applyLoan.formItem.item.label')}</span>}
              rules={[
                {
                  required: true,
                  message: 'Please input your title!',
                },
                {
                  max: 10,
                  message: 'Title must be at most 10 characters.',
                },
              ]}
            >
              <TextArea className='s-container text-16' placeholder={t('applyLoan.formItem.item.placeholder')} style={{ height: 102, resize: 'none' }} />
            </Form.Item>

            <Form.Item
              name="description"
              className='m0 w-full'
              label={<span className="text-24">{t('applyLoan.formItem.item.description.label')}</span>}
              rules={[
                {
                  required: true,
                  message: 'Please input your description!',
                },
                {
                  max: 100,
                  message: 'Title must be at most 10 characters.',
                },
              ]}
            >
              <TextArea className='s-container text-16' placeholder={t('applyLoan.formItem.item.description.placeholder')} style={{ height: 343, resize: 'none' }} />
            </Form.Item>
          </div>
        </div>

        <div className='h-51' />

        <div className='box-border h-502 w-full flex flex-wrap gap-x-52 from-#0E0F14 to-#16273B bg-gradient-to-br px30 py-44 text-24'>
          <Form.Item
            name="applyLoan"
            rules={[
              {
                required: true,
                message: 'Please input content!',
              },
            ]}
            label={<span className="w-full text-24">{t('applyLoan.formItem.applyForLoan.label')}</span>} >
            <InputNumber
              min={100}
              max={1000000}
              className='box-border h68 w412 items-center s-container px-30 pr-106 text-24'
              suffix={
                <div className='px-20 text-24'>USDC</div>
              }
            />
          </Form.Item>

          <Form.Item
            name='cycle'
            rules={[
              {
                required: true,
                message: 'Please input content!',
              },
            ]} label={<span className="text-24">{t('applyLoan.formItem.cycle.label')}</span>}>
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w412'
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              options={[{ value: 0, label: 10 }, { value: 1, label: 20 }, { value: 2, label: 30 }, { value: 3, label: 60 }, { value: 4, label: 90 }, { value: 5, label: 180 }]}
            />
          </Form.Item>

          <Form.Item
            name='period'
            rules={[
              {
                required: true,
                message: 'Please input content!',
              },
            ]} label={<span className="text-24">{t('applyLoan.formItem.period.label')}</span>}>
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w412'
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              options={[{ value: 1, label: 1 }, { value: 2, label: 2 }, { value: 5, label: 5 }, { value: 10, label: 10 }]}
            />
          </Form.Item>

          <Form.Item
            name='numberOfCopies'
            initialValue={1}
            label={<span className="text-24">{t('applyLoan.formItem.numberOfCopies.label')}</span>} >
            <InputNumber
              defaultValue={1}
              min={1}
              max={10000}
              className='box-border h68 w412 items-center s-container px-30 pr-106 text-24'
              suffix={
                <div className='px-20 text-24'>share</div>
              }
            />
          </Form.Item>

          <Form.Item
            name='minimumRequiredCopies'
            initialValue={1}
            label={<span className="text-24">{t('applyLoan.formItem.minimumRequiredCopies.label')}</span>} >
            <InputNumber
              defaultValue={1}
              // min={2}
              max={10000}
              className='box-border h68 w412 items-center s-container px-30 pr-106 text-24'
              suffix={
                <div className='px-20 text-24'>share</div>
              }
            />
          </Form.Item>

          <Form.Item
            name='interest'
            rules={[
              {
                required: true,
                message: 'Please input content!',
              },
            ]} label={<span className="text-24">{t('applyLoan.formItem.interest.label')}</span>} >
            <InputNumber
              min={5}
              max={80}
              precision={2}
              className='box-border h68 w412 items-center s-container px-30 pr-106 text-24'
              suffix={
                <div className='px-20 text-24'>%</div>
              }
            />
          </Form.Item>

          <Form.Item
            name='dividend'
            initialValue={0}
            label={<span className="text-24">{t('applyLoan.formItem.dividend.label')}</span>} >
            <InputNumber
              min={0}
              max={100}
              className='box-border h68 w412 items-center s-container px-30 pr-106 text-24'
              suffix={
                <div className='px-20 text-24'>%</div>
              }
            />
          </Form.Item>

          <Form.Item
            name='raisingTime'
            rules={[
              {
                required: true,
                message: 'Please input content!',
              },
            ]} label={<span className="text-24">{t('applyLoan.formItem.raisingTime.label')}</span>}>
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w412'
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              options={[{ value: 1, label: 1 }, { value: 3, label: 3 }, { value: 7, label: 7 }, { value: 14, label: 14 }, { value: 20, label: 20 }]}
            />
          </Form.Item>
        </div>

        <div className='h50' />

        <div className='flex items-end gap-x-59'>
          <Form.Item
            initialValue={true}
            rules={[
              {
                required: true,
                message: 'Please input content!',
              },
            ]} className='m0' label={<span className="text-24">{t('applyLoan.formItem.designatedTransaction.label')}</span>}>
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w306'
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              defaultValue={true}
              onChange={v => setLoanRequisitionEditModel(prevState => ({
                ...prevState,
                designatedTransaction: v,
              }))}
              options={[{ value: true, label: 'YES' }, { value: false, label: 'NO' }]}
            />
          </Form.Item>

          <div style={{ display: loanRequisitionEditModel.designatedTransaction ? 'block' : 'none' }}>
            <div className='flex items-end gap-x-59'>
              <Form.Item rules={[
                {
                  required: true,
                  message: 'Please input content!',
                },
              ]}
                initialValue={Models.TradingFormType.SpotGoods}
                className='m0'>
                <Select
                  popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
                  className='box-border h68 s-container text-24 !w306'
                  suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
                  defaultValue={Models.TradingFormType.SpotGoods}
                  onChange={v => setLoanRequisitionEditModel(prevState => ({
                    ...prevState,
                    tradingFormType: v,
                  }))}
                  options={[{ value: Models.TradingFormType.SpotGoods, label: 'Spot goods' }, { value: Models.TradingFormType.Contract, label: 'Contract' }]}
                />
              </Form.Item>

              <Form.Item rules={[
                {
                  required: true,
                  message: 'Please input content!',
                },
              ]}
                initialValue='Uniswap'
                className='m0' >
                <Select
                  popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
                  className='box-border h68 s-container text-24 !w306'
                  suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
                  defaultValue='Uniswap'
                  disabled
                  value={
                    loanRequisitionEditModel.tradingFormType === Models.TradingFormType.SpotGoods
                      ? 'Uniswap'
                      : 'GMX'
                  }
                  options={[{ value: 'Uniswap', label: 'Uniswap' }, { value: 'GMX', label: 'GMX' }]}
                />
              </Form.Item>

              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please input content!',
                  },
                ]}
                initialValue='BTC'
                className='m0' >
                <Select
                  mode="multiple"
                  popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
                  className='box-border h68 s-container text-24 !w306'
                  suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
                  // value='USDC-BTC'
                  maxTagCount={1}
                  options={(loanRequisitionEditModel.tradingFormType === Models.TradingFormType.SpotGoods ? [...tradingPairBase, ...tradingPairSpotGoods] : [...tradingPairBase, ...tradingPairContract]).map(e => ({ value: e.name, label: e.name }))}
                  onChange={
                    onTradingPairChange
                  }
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className='h50' />

        <div style={{ display: loanRequisitionEditModel.designatedTransaction ? 'block' : 'none' }}>
          <div className='flex flex-wrap gap-x-60 gap-y-30' >
            {loanRequisitionEditModel.transactionPairs?.map((e, i) => <div key={i} className='h68 w180 s-container text-center text-24 line-height-70'>
            <Image preview= {false} width={24} height={24} src={tradingPair.flat().find(p => p.name === e)?.logo}></Image>
            {e}</div>)}
          </div>
        </div>

        <div className='h156' />

        <Form.Item className='text-center'>
          <Button type="primary" htmlType="submit" loading={publishBtnLoading} className='h78 w300 text-24 primary-btn'>
            {t('applyLoan.btn.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ApplyLoan
