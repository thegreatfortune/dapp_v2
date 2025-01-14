/* eslint-disable @typescript-eslint/indent */
import type { ModalProps } from 'antd'
import { Avatar, Button, Image, List, Modal } from 'antd'
import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { ZeroAddress, ethers, formatUnits, parseUnits } from 'ethers'
import { ArrowDownOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons'
import { useChainId } from 'wagmi'
import CurrencyInput from 'react-currency-input-field'
import { TokenEnums } from '@/enums/chain'
import useCoreContract from '@/hooks/useCoreContract'
import type { Models } from '@/.generated/api/models'
import usePoolAddress from '@/helpers/usePoolAddress'

// import type { TokenInfo } from './Pool'
import { executeTask, handleTransactionResponse } from '@/helpers/helpers'
import { MessageError } from '@/enums/error'

// import exChange from '@/assets/images/loan-details/exchange.png'
// import FolCoin from '@/assets/images/loan-details/FolCoin.png'

interface IProps extends ModalProps {
    tokenStates: Models.ITokenState[]
    tradeId: bigint
    isLoanOwner: boolean
    resetSwapTokenInfo: () => Promise<void>
}

interface IToken {
    index: number
    name: string
    symbol: string
    decimals: number
    address: string
    amount: string
    logo: string
}

const Swap: React.FC<IProps> = (props) => {
    const chainId = useChainId()
    const { coreContracts } = useCoreContract()
    const { capitalPoolAddress } = usePoolAddress()

    const tokenStates = props.tokenStates

    const [swaping, setSwaping] = useState(false)

    const [swapDisabled, setSwapDisabled] = useState(!props.isLoanOwner)
    const [swapLoading, setSwapLoading] = useState(false)
    const [swapButtonText, setSwapButtonText] = useState('Swap')

    const [checkingInputBalance, setCheckingInputBalance] = useState(true)
    const [checkingOutputBalance, setCheckingOutputBalance] = useState(true)

    const [inputBalanceCalculating, setInputBalanceCalculating] = useState(false)
    const [outputBalanceCalculating, setOutputBalanceCalculating] = useState(false)

    const [inputBalance, setInputBalance] = useState(BigInt(0))
    const [outputBalance, setOutputBalance] = useState(BigInt(0))

    const [inputAmount, setInputAmount] = useState('0')
    const [outputAmount, setOutputAmount] = useState('0')

    const [openTokenList, setOpenTokenList] = useState(false)

    const [changingDirection, setChangingDirection] = useState(false)

    const [inputToken, setInputToken] = useState<IToken>({
        index: TokenEnums[chainId].USDC.index,
        name: TokenEnums[chainId].USDC.name,
        symbol: TokenEnums[chainId].USDC.symbol,
        decimals: TokenEnums[chainId].USDC.decimals,
        address: TokenEnums[chainId].USDC.address,
        amount: '',
        logo: TokenEnums[chainId].USDC.logo,
    })

    const [outputToken, setOutputToken] = useState<IToken>({
        index: tokenStates[1] ? tokenStates[1].index : -1,
        name: tokenStates[1] ? tokenStates[1].name : '',
        symbol: tokenStates[1] ? tokenStates[1].symbol : '',
        decimals: tokenStates[1] ? tokenStates[1].decimals : -1,
        address: tokenStates[1] ? tokenStates[1].address : ZeroAddress,
        amount: '',
        logo: tokenStates[1] ? tokenStates[1].logo : '',
    })

    /**
     *
     * @param amount
     * @param isInputToken
     */
    const calculateTokenAmount = async (amount: string, isInputToken: boolean) => {
        if (!props.isLoanOwner) {
            console.log('This is Guest Mode, or the loan is due!')
            return
        }
        else {
            console.log('This is Main Mode!')
        }

        if (amount === '') {
            if (isInputToken)
                setOutputAmount('')
            else
                setInputAmount('')
            setSwapDisabled(true)
            return
        }

        setSwapButtonText('Fetching the price...')
        setSwaping(true)
        setSwapDisabled(false)

        const liquidityContract = await coreContracts!.getTestLiquidityContract()

        const price = await liquidityContract.getTokenPrice(
            inputToken.name === TokenEnums[chainId].USDC.name ? inputToken.address : outputToken.address,
            inputToken.name === TokenEnums[chainId].USDC.name ? outputToken.address : inputToken.address,
            3000,
            ethers.parseEther(String(1)),
        )
        // const ratio = BigNumber(ethers.formatUnits(price ?? 0)).toFixed(18)
        const ratio = formatUnits(price ?? '0')

        if (isInputToken) {
            if (BigInt(parseUnits(amount, inputToken.decimals)) > BigInt(inputBalance)) {
                setSwapDisabled(true)
                setSwaping(false)
                setOutputBalanceCalculating(false)
                setSwapButtonText(`Insufficient ${inputToken.symbol}`)
            }
            else {
                setOutputBalanceCalculating(true)
                setInputToken((prev) => {
                    return { ...prev, amount }
                })
                const outputAmount = inputToken.name === TokenEnums[chainId].USDC.name
                    ? BigNumber(amount).multipliedBy(ratio).toString()
                    : BigNumber(amount).dividedBy(ratio).toString()

                console.log(outputAmount, Number(outputAmount).toFixed(9))
                setOutputToken((prev) => {
                    return {
                        ...prev,
                        amount: Number(outputAmount).toFixed(9),
                    }
                })
                setOutputAmount(Number(outputAmount).toFixed(9))
                setSwapDisabled(false)
                setTimeout(() => {
                    setSwaping(false)
                    setOutputBalanceCalculating(false)
                    setSwapButtonText('Swap')
                }, 2000)
            }
        }
        else {
            setInputBalanceCalculating(true)

            setOutputToken((prev) => {
                return { ...prev, amount }
            })

            const inputAmount = inputToken.name === TokenEnums[chainId].USDC.name
                ? BigNumber(amount).dividedBy(ratio).toString()
                : BigNumber(amount).multipliedBy(ratio).toString()

            setInputToken((prev) => {
                return {
                    ...prev,
                    amount: Number(inputAmount).toFixed(9),
                }
            })
            setInputAmount(Number(inputAmount).toFixed(9))
            if (BigInt(parseUnits(Number(inputAmount).toFixed(18), inputToken.decimals)) > BigInt(inputBalance)) {
                setSwapDisabled(true)
                setSwaping(false)
                setInputBalanceCalculating(false)
                setSwapButtonText('Swap')
            }
            else {
                setSwapDisabled(false)
                setTimeout(() => {
                    setSwaping(false)
                    setInputBalanceCalculating(false)
                    setSwapButtonText('Swap')
                }, 2000)
            }
        }
    }

    async function doSwap() {
        const task = async () => {
            if (coreContracts) {
                setSwaping(true)
                try {
                    const handles = await coreContracts.manageContract.getAllAllowHandle()
                    const handleAddress = coreContracts.chainAddresses.handle
                    const hIndex = handles.findIndex(handle => handle === handleAddress)

                    if (inputToken.name === TokenEnums[chainId].USDC.name) {
                        console.log('USDC to ...', props.tradeId, outputToken.index, hIndex, 0, parseUnits(inputToken.amount, inputToken.decimals), 3000)
                        const res = await coreContracts.routerContract.doV3Swap(props.tradeId, outputToken.index, hIndex, 0, parseUnits(inputToken.amount, inputToken.decimals), 3000)
                        await handleTransactionResponse(res)
                        setSwaping(false)
                    }
                    else {
                        // const res = await coreContracts.routerContract.doV3Swap(props.tradeId, inputToken.index, hIndex, 1, inputToken.amount, 3000)
                        console.log('... to USDC', props.tradeId, inputToken.index, hIndex, 1, inputToken.amount, 3000)
                    }
                    setSwaping(false)
                }
                catch (error) {
                    setSwaping(false)
                }
            }
            else {
                return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            }
        }
        executeTask(task)
    }

    const fetchTokenBalance = async (token: string) => {
        if (coreContracts && capitalPoolAddress !== ZeroAddress) {
            console.log('?????')
            if (token === TokenEnums[chainId].USDC.address) {
                const balance = await coreContracts.usdcContract.balanceOf(capitalPoolAddress)
                if (inputToken.address === token)
                    setInputBalance(balance)
                else
                    setOutputBalance(balance)
            }
            else {
                const tokenContract = await coreContracts.getERC20Contract(token)
                const balance = await tokenContract.balanceOf(capitalPoolAddress)
                if (inputToken.address === token)
                    setInputBalance(balance)
                else
                    setOutputBalance(balance)
            }
        }
    }

    const changeDirection = async () => {
        const task = async () => {
            // setSwaping(true)
            const tempInput = { ...inputToken }
            const tempOutput = { ...outputToken }
            setInputToken(tempOutput)
            setOutputToken(tempInput)

            const tempInputBalance = inputBalance
            const tempOutputBalance = outputBalance
            setInputBalance(tempOutputBalance)
            setOutputBalance(tempInputBalance)

            const tempInputAmount = inputAmount
            const tempOutputAmount = outputAmount
            setInputAmount(tempOutputAmount)
            setOutputAmount(tempInputAmount)

            setChangingDirection(true)
        }
        executeTask(task)
    }

    useEffect(() => {
        if (coreContracts) {
            calculateTokenAmount(inputAmount, true)
            setChangingDirection(false)
        }
    }, [changingDirection])

    useEffect(() => {
        const task = async () => {
            if (coreContracts && capitalPoolAddress !== ZeroAddress && checkingInputBalance && props.isLoanOwner) {
                await fetchTokenBalance(inputToken.address)
                setTimeout(() => {
                    setCheckingInputBalance(false)
                }, 3000)
            }
        }
        executeTask(task)
    }, [coreContracts, capitalPoolAddress, inputToken, checkingInputBalance])

    useEffect(() => {
        if (coreContracts && capitalPoolAddress !== ZeroAddress && checkingOutputBalance && outputToken.index !== -1 && props.isLoanOwner) {
            fetchTokenBalance(outputToken.address)
            setTimeout(() => {
                // setSwaping(false)
                setCheckingOutputBalance(false)
            }, 3000)
        }
    }, [coreContracts, capitalPoolAddress, outputToken, checkingOutputBalance])

    useEffect(() => {
        if (tokenStates[1] && outputToken.index === -1) {
            console.log(tokenStates[1])
            setOutputToken(() => {
                return {
                    index: tokenStates[1].index,
                    name: tokenStates[1].name,
                    symbol: tokenStates[1].symbol,
                    decimals: tokenStates[1].decimals,
                    address: tokenStates[1].address,
                    amount: '0',
                    logo: tokenStates[1].logo,
                }
            })
        }
    }, [tokenStates])

    // useEffect(() => {
    //     console.log('inputToken changed:', inputToken)
    // }, [inputToken])

    // useEffect(() => {
    //     console.log('outputToken changed:', outputToken)
    // }, [outputToken])

    useEffect(() => {
        if (props.isLoanOwner) {
            setSwapLoading(checkingInputBalance
                || checkingOutputBalance
                || inputBalanceCalculating
                || outputBalanceCalculating
                || swaping)
        }
    },
        [
            checkingInputBalance,
            checkingOutputBalance,
            inputBalanceCalculating,
            outputBalanceCalculating,
            swaping,
        ])

    return (
        <div className=''>
            <Modal open={openTokenList}
                onCancel={() => setOpenTokenList(false)}
                centered={true}
                title='Select your Token'
                width={450}
                footer={null}
            >
                <div className='mt-30'>
                    <List
                        itemLayout="horizontal"
                        dataSource={tokenStates}
                        renderItem={(item: Models.ITokenState) => {
                            if (item.index === 0) { // skip usdc, usdc index === 0
                                return (<></>)
                            }
                            else {
                                return (<List.Item className='cursor-pointer hover:bg-neutral-800'
                                    onClick={() => {
                                        if (inputToken.index === 0) {
                                            setOutputToken({
                                                index: item.index,
                                                name: item.name,
                                                symbol: item.symbol,
                                                decimals: item.decimals,
                                                address: item.address,
                                                amount: '0',
                                                logo: item.logo,
                                            })

                                            calculateTokenAmount(inputAmount, true)
                                        }
                                        else {
                                            setInputToken({
                                                index: item.index,
                                                name: item.name,
                                                symbol: item.symbol,
                                                decimals: item.decimals,
                                                address: item.address,
                                                amount: '0',
                                                logo: item.logo,
                                            })

                                            calculateTokenAmount(outputAmount, false)
                                        }

                                        setOpenTokenList(false)
                                    }}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.logo} size={'large'} />}
                                        title={item.symbol}
                                        description={item.name}
                                    />
                                </List.Item>)
                            }
                        }}
                    />
                </div>
            </Modal>

            <div className='text-40 font-bold'>Trade</div>
            <div className='h150 w-full flex flex-col justify-center'>
                <div className='w-full flex items-center justify-between b-rd-6'>
                    <div className='relative z-1 mr-10 flex grow items-center justify-between'>
                        <CurrencyInput
                            className={`${inputBalanceCalculating ? 'text-white/20' : 'text-white'} font-semiBold h-30 max-xl:w-150 xl:w-250 border-none bg-black text-28 focus:border-0 focus:border-none focus:bg-black focus:outline-none`}
                            disabled={!props.isLoanOwner}
                            name="inputTokenAmount"
                            placeholder="0"
                            value={inputBalanceCalculating ? '' : inputAmount}
                            decimalsLimit={9}
                            allowNegativeValue={false}
                            onValueChange={(_value, _name, values) => {
                                console.log(values?.value, inputAmount)
                                if (values && values.value !== inputAmount) {
                                    calculateTokenAmount(values.value, true)
                                    setInputAmount(values.value === '' ? '' : values.value)
                                }
                                // console.log('INPUT: inputAmountRef: %s, outputAmountRef: %s, value: %s', inputAmountRef.current, outputAmountRef.current, values?.value)
                            }}
                        />

                        <div className='absolute right-10 z-3 bg-black' hidden={!props.isLoanOwner}>
                            <div className='flex cursor-pointer select-none items-center border-1 rounded-4 border-solid px-8 py-2 text-center text-12'
                                style={{ borderColor: '#3898FF', color: '#3898FF' }}
                                onClick={() => {
                                    setInputAmount(formatUnits(inputBalance, inputToken.decimals))
                                    setInputToken((prev) => {
                                        return { ...prev, amount: formatUnits(inputBalance, inputToken.decimals) }
                                    })
                                    calculateTokenAmount(formatUnits(inputBalance, inputToken.decimals), true)
                                }}>
                                Max
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <Button disabled={!props.isLoanOwner} shape="round" size='large' className='w-150'
                            onClick={() => {
                                if (inputToken.index !== 0)
                                    setOpenTokenList(true)
                            }}
                        >
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <Image preview={false} src={inputToken.logo} width={24}></Image>
                                    <span className='ml-6 flex items-center text-center'> {inputToken.symbol}</span>
                                </div>
                                <DownOutlined hidden={inputToken.index === 0} />
                            </div>
                        </Button>
                    </div>
                </div>
                <div className='mt-5 w-full flex items-center justify-end b-rd-6'>
                    <span className={`${!props.isLoanOwner ? 'text-white/20' : 'text-white'}`}>Balances:</span>
                    <div className={`ml-20 mr-10 ${!props.isLoanOwner || checkingInputBalance ? 'text-white/20' : 'text-white'}`}>
                        {
                            !props.isLoanOwner
                                ? '0.0'
                                : checkingInputBalance
                                    ? <LoadingOutlined width={10} className='text-white' />
                                    : formatUnits(inputBalance, inputToken.decimals)
                        }
                    </div>
                </div>
            </div>
            <div className='w-full flex justify-center'>
                <button disabled={!props.isLoanOwner} className='transform b-transparent b-rd-10 b-solid bg-transparent text-34 text-#fff transition-transform active:scale-98 hover:scale-102'
                    onClick={changeDirection} >
                    <ArrowDownOutlined size={20} className={`${!props.isLoanOwner ? 'text-white/20' : 'text-white'}`} />
                    {/* <VerticalAlignMiddleOutlined size={20} className={`${!props.isLoanOwner ? 'text-white/20' : 'text-white'}`} /> */}
                </button>
            </div>
            <div className='h150 w-full flex flex-col justify-center'>
                <div className='w-full flex items-center justify-between b-rd-6'>
                    <div className='flex items-center justify-between'>
                        <CurrencyInput
                            className={`${outputBalanceCalculating ? 'text-white/20' : 'text-white'} font-semiBold h-30 max-xl:w-150 xl:w-300 border-none bg-black text-28 focus:border-0 focus:border-none focus:bg-black focus:outline-none`}
                            disabled={!props.isLoanOwner}
                            value={outputBalanceCalculating ? '' : outputAmount}
                            name="outputTokenAmount"
                            placeholder="0"
                            decimalsLimit={9}
                            onValueChange={(_value, _name, values) => {
                                console.log(values?.value, outputAmount)
                                if (values && values.value !== outputAmount) {
                                    calculateTokenAmount(values.value, false)
                                    setOutputAmount(values.value === '' ? '' : values.value)
                                }
                                // console.log('OUTPUT: inputAmountRef: %s, outputAmountRef: %s, value: %s', inputAmountRef.current, outputAmountRef.current, values?.value)
                            }}
                        />
                    </div>
                    <div className='flex justify-center'>
                        <Button shape="round" size='large' className='w-150' disabled={!props.isLoanOwner}
                            onClick={() => {
                                if (outputToken.index !== 0)
                                    setOpenTokenList(true)
                            }
                            }
                        >
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <Image preview={false} src={outputToken.logo} width={24}></Image>
                                    <span className='ml-6 flex items-center text-center'> {outputToken.symbol}</span>
                                </div>
                                <DownOutlined hidden={outputToken.index === 0} />
                            </div>
                        </Button>
                    </div>
                </div>
                <div className='mt-5 w-full flex items-center justify-end b-rd-6'>
                    <span className={`${!props.isLoanOwner ? 'text-white/20' : 'text-white'}`}>Balances:</span>
                    <div className={`ml-20 mr-10 ${!props.isLoanOwner || checkingOutputBalance ? 'text-white/20' : 'text-white'}`}>{
                        !props.isLoanOwner
                            ? '0.0'
                            : checkingOutputBalance
                                ? <LoadingOutlined width={10} className='text-white' />
                                : formatUnits(outputBalance, outputToken.decimals)
                    }</div>
                </div>
            </div>
            <div className='mb-20 mt-60'>
                <Button
                    type='primary'
                    onClick={doSwap}
                    disabled={swapDisabled}
                    className='font-semiBold mt-5 h45 w-full rounded-10 text-22'
                    loading={swapLoading}
                >
                    {swapButtonText}
                </Button>
            </div>
        </div >
    )
}

export default Swap
