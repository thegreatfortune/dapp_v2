/* eslint-disable @typescript-eslint/indent */
import type { ModalProps } from 'antd'
import { Avatar, Button, Image, List, Modal } from 'antd'
import { useEffect, useRef, useState } from 'react'
import BigNumber from 'bignumber.js'
import { ZeroAddress, ethers, formatUnits, parseUnits } from 'ethers'
import { ArrowDownOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons'
import { useChainId } from 'wagmi'
import CurrencyInput from 'react-currency-input-field'
import type { Subscription } from 'rxjs'
import { ReplaySubject, debounceTime, distinctUntilChanged } from 'rxjs'
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
    loanState: Models.LoanState
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

    const [swapDisabled, setSwapDisabled] = useState(!props.isLoanOwner || props.loanState !== 'Trading')
    const [swapLoading, setSwapLoading] = useState(false)
    const [swapButtonText, setSwapButtonText] = useState('Swap')

    const [checkingInputTokenBalance, setCheckingInputTokenBalance] = useState(true)
    const [checkingOutputTokenBalance, setCheckingOutputTokenBalance] = useState(true)

    const [inputTokenBalance, setInputTokenBalance] = useState(BigInt(0))
    const [outputTokenBalance, setOutputTokenBalance] = useState(BigInt(0))

    const [inputAmountCalculating, setInputAmountCalculating] = useState(false)
    const [outputAmountCalculating, setOutputAmountCalculating] = useState(false)

    const [inputAmount, setInputAmount] = useState<string>('0')
    const [outputAmount, setOutputAmount] = useState<string>('0')

    const [openTokenList, setOpenTokenList] = useState(false)

    const [changingToken, setChangingToken] = useState(false)

    const [direction, setDirection] = useState(true)

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

    const debounceInput$ = useRef(new ReplaySubject<[string, boolean, boolean, bigint]>(1)).current

    const debounceInputPipe$ = useRef(debounceInput$.pipe(
        distinctUntilChanged(),
        debounceTime(1000),
    )).current

    const [debounceInputSubscription, setDebounceInputSubscription] = useState<Subscription>()

    const calculateTokenAmount = async (amount: string, direction: boolean, position: boolean, outputTokenBalance: bigint) => {
        if (amount === '') {
            direction ? setOutputAmount('') : setInputAmount('')

            setInputToken((prev) => {
                return { ...prev, amount: '0' }
            })
            setOutputToken((prev) => {
                return { ...prev, amount: '0' }
            })

            setSwapDisabled(true)
            return
        }

        setSwapButtonText('Fetching the price...')
        setSwaping(true)
        setSwapDisabled(false)

        const liquidityContract = await coreContracts!.getTestLiquidityContract()
        const price = await liquidityContract.getTokenPrice(
            inputToken.symbol === TokenEnums[chainId].USDC.symbol ? inputToken.address : outputToken.address,
            inputToken.symbol === TokenEnums[chainId].USDC.symbol ? outputToken.address : inputToken.address,
            3000,
            ethers.parseEther(String(1)),
        )
        const ratio = formatUnits(price ?? '0')
        if (direction) {
            if (position) {
                if (BigInt(parseUnits(amount, inputToken.decimals)) > BigInt(inputTokenBalance)) {
                    setSwaping(false)
                    setSwapDisabled(true)
                    setSwapButtonText(`Insufficient ${inputToken.symbol}`)
                }
                else {
                    setInputToken((prev) => {
                        return { ...prev, amount }
                    })
                    const outputAmount = amount !== '0'
                        ? Number(
                            inputToken.symbol === TokenEnums[chainId].USDC.symbol
                                ? BigNumber(amount).multipliedBy(ratio).toString()
                                : BigNumber(amount).dividedBy(ratio).toString(),
                        ).toFixed(9)
                        : '0'
                    setOutputToken((prev) => {
                        return {
                            ...prev,
                            amount: outputAmount,
                        }
                    })
                    setOutputAmount(outputAmount)
                    setSwapDisabled(false)
                    setSwaping(false)
                    setSwapButtonText('Swap')
                }
            }
            else {
                setOutputToken((prev) => {
                    return { ...prev, amount }
                })

                const calculatedInputAmount = inputToken.symbol === TokenEnums[chainId].USDC.symbol
                    ? BigNumber(amount).dividedBy(ratio).toString()
                    : BigNumber(amount).multipliedBy(ratio).toString()

                const inputAmount = amount !== '0'
                    ? Number(calculatedInputAmount).toFixed(9)
                    : '0'

                setInputToken((prev) => {
                    return {
                        ...prev,
                        amount: inputAmount,
                    }
                })
                setInputAmount(inputAmount)

                if (BigInt(parseUnits(Number(calculatedInputAmount).toFixed(18), inputToken.decimals)) > BigInt(inputTokenBalance)) {
                    setSwapDisabled(true)
                    setSwaping(false)
                    setSwapButtonText(`Insufficient ${inputToken.symbol}`)
                }
                else {
                    setSwapDisabled(false)
                    setSwaping(false)
                    setSwapButtonText('Swap')
                }
            }
        }
        else {
            if (position) {
                if (BigInt(parseUnits(amount, outputToken.decimals)) > BigInt(outputTokenBalance)) {
                    setSwapDisabled(true)
                    setSwaping(false)
                    setSwapButtonText(`Insufficient ${outputToken.symbol}`)
                }
                else {
                    setOutputToken((prev) => {
                        return { ...prev, amount }
                    })

                    const calculatedInputAmount = inputToken.symbol === TokenEnums[chainId].USDC.symbol
                        ? BigNumber(amount).dividedBy(ratio).toString()
                        : BigNumber(amount).multipliedBy(ratio).toString()

                    const inputAmount = amount !== '0'
                        ? Number(calculatedInputAmount).toFixed(9)
                        : '0'

                    setInputToken((prev) => {
                        return {
                            ...prev,
                            amount: inputAmount,
                        }
                    })
                    setInputAmount(inputAmount)

                    setSwapDisabled(false)
                    setSwaping(false)
                    setSwapButtonText('Swap')
                }
            }
            else {
                setInputToken((prev) => {
                    return { ...prev, amount }
                })

                const calculateOutputAmount = inputToken.symbol === TokenEnums[chainId].USDC.symbol
                    ? BigNumber(amount).multipliedBy(ratio).toString()
                    : BigNumber(amount).dividedBy(ratio).toString()

                const outputAmount = amount !== '0'
                    ? Number(calculateOutputAmount).toFixed(9)
                    : '0'

                setOutputToken((prev) => {
                    return {
                        ...prev,
                        amount: outputAmount,
                    }
                })
                setOutputAmount(outputAmount)

                if (BigInt(parseUnits(Number(calculateOutputAmount).toFixed(18), outputToken.decimals)) > BigInt(outputTokenBalance)) {
                    setSwapDisabled(true)
                    setSwaping(false)
                    setSwapButtonText(`Insufficient ${outputToken.symbol}`)
                }
                else {
                    setSwapDisabled(false)
                    setSwaping(false)
                    setSwapButtonText('Swap')
                }
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
                    const res = await coreContracts.routerContract.doV3Swap(
                        props.tradeId,
                        outputToken.index,
                        hIndex,
                        direction ? 0 : 1,
                        direction
                            ? parseUnits(inputToken.amount, inputToken.decimals)
                            : parseUnits(outputToken.amount, outputToken.decimals),
                        3000)
                    await handleTransactionResponse(res)
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
            if (token === TokenEnums[chainId].USDC.address) {
                const balance = await coreContracts.usdcContract.balanceOf(capitalPoolAddress)
                if (inputToken.address === token)
                    setInputTokenBalance(balance)
                else
                    setOutputTokenBalance(balance)
            }
            else {
                const tokenContract = await coreContracts.getERC20Contract(token)
                const balance = await tokenContract.balanceOf(capitalPoolAddress)
                if (inputToken.address === token)
                    setInputTokenBalance(balance)
                else
                    setOutputTokenBalance(balance)
            }
        }
    }

    useEffect(() => {
        const task = async () => {
            if (coreContracts) {
                if (coreContracts && changingToken) {
                    if (debounceInputSubscription)
                        debounceInputSubscription.unsubscribe()

                    const s = debounceInputPipe$.subscribe({
                        next: ([amount, isInputToken, position, outputTokenBalance]) => {
                            calculateTokenAmount(amount, isInputToken, position, outputTokenBalance)
                        },
                    })
                    setDebounceInputSubscription(s)
                    setChangingToken(false)
                }
            }
        }
        executeTask(task)
    }, [coreContracts, changingToken])

    useEffect(() => {
        const task = async () => {
            if (coreContracts && capitalPoolAddress !== ZeroAddress && checkingInputTokenBalance && props.isLoanOwner) {
                await fetchTokenBalance(inputToken.address)
                setTimeout(() => {
                    setCheckingInputTokenBalance(false)
                }, 3000)
            }
        }
        executeTask(task)
    }, [coreContracts, capitalPoolAddress, inputToken, checkingInputTokenBalance])

    useEffect(() => {
        if (coreContracts && capitalPoolAddress !== ZeroAddress && checkingOutputTokenBalance && outputToken.index !== -1 && props.isLoanOwner) {
            fetchTokenBalance(outputToken.address)
            setTimeout(() => {
                // setSwaping(false)
                setCheckingOutputTokenBalance(false)
            }, 3000)
        }
    }, [coreContracts, capitalPoolAddress, outputToken, checkingOutputTokenBalance])

    useEffect(() => {
        if (tokenStates[1] && outputToken.index === -1) {
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

            setChangingToken(true)
        }
    }, [tokenStates])

    useEffect(() => {
        if (props.isLoanOwner) {
            setSwapLoading(checkingInputTokenBalance
                || checkingOutputTokenBalance
                || swaping)
        }
    },
        [
            checkingInputTokenBalance,
            checkingOutputTokenBalance,
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
                                        setOutputToken({
                                            index: item.index,
                                            name: item.name,
                                            symbol: item.symbol,
                                            decimals: item.decimals,
                                            address: item.address,
                                            amount: '0',
                                            logo: item.logo,
                                        })
                                        setChangingToken(true)
                                        setCheckingOutputTokenBalance(true)
                                        debounceInput$.next([inputAmount, direction, direction, outputTokenBalance])
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
                            className={`${inputAmountCalculating ? 'text-white' : 'text-white'} font-semiBold h-30 max-xl:w-150 xl:w-250 border-none bg-transparent text-28 focus:border-0 focus:border-none focus:bg-black focus:outline-none`}
                            disabled={!props.isLoanOwner || props.loanState !== 'Trading'}
                            name="inputTokenAmount"
                            placeholder="0"
                            value={
                                direction
                                    ? inputAmountCalculating
                                        ? inputToken.amount
                                        : inputAmount
                                    : outputAmountCalculating
                                        ? outputToken.amount
                                        : outputAmount
                            }
                            decimalsLimit={9}
                            allowNegativeValue={false}
                            onValueChange={(_value, _name, values) => {
                                if (values && values.value !== (direction ? inputAmount : outputAmount)) {
                                    direction
                                        ? setInputAmount(values.value)
                                        : setOutputAmount(values.value)
                                    debounceInput$.next([values.value, direction, true, outputTokenBalance])
                                }
                            }}
                            onFocus={() => {
                                if (direction) {
                                    setInputAmountCalculating(false)
                                    setOutputAmountCalculating(true)
                                }
                                else {
                                    setInputAmountCalculating(true)
                                    setOutputAmountCalculating(false)
                                }
                            }}
                        />
                    </div>
                    <div className='flex justify-center'>
                        <Button disabled={!props.isLoanOwner || props.loanState !== 'Trading'} shape="round" size='large' className='w-150'
                            onClick={() => {
                                if (!direction)
                                    setOpenTokenList(true)
                            }}
                        >
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <Image preview={false} src={direction ? inputToken.logo : outputToken.logo} width={24}></Image>
                                    <span className='ml-6 flex items-center text-center'> {direction ? inputToken.symbol : outputToken.symbol}</span>
                                </div>
                                <DownOutlined hidden={direction} />
                            </div>
                        </Button>
                    </div>
                </div>
                <div className='mt-10 w-full flex items-center justify-end b-rd-6'>
                    <span className={`${!props.isLoanOwner ? 'text-white/20' : 'text-white'}`}>Balances:</span>
                    <div className={`ml-20 mr-10 ${!props.isLoanOwner || checkingInputTokenBalance ? 'text-white/20' : 'text-white'}`}>
                        {
                            !props.isLoanOwner
                                ? '0.0'
                                : checkingInputTokenBalance
                                    ? <LoadingOutlined width={10} className='text-white' />
                                    : formatUnits(direction ? inputTokenBalance : outputTokenBalance, direction ? inputToken.decimals : outputToken.decimals)
                        }
                    </div>
                    <div className='bg-transparent' hidden={!props.isLoanOwner || props.loanState !== 'Trading'}>
                        <div className='flex cursor-pointer select-none items-center border-1 rounded-4 border-solid px-8 py-2 text-center text-12'
                            style={{ borderColor: '#3898FF', color: '#3898FF' }}
                            onClick={() => {
                                const amount = formatUnits(direction ? inputTokenBalance : outputTokenBalance, direction ? inputToken.decimals : outputToken.decimals)
                                if (direction) {
                                    setInputAmount(amount)
                                    setInputToken((prev) => {
                                        return { ...prev, amount }
                                    })
                                }
                                else {
                                    setOutputAmount(amount)
                                    setOutputToken((prev) => {
                                        return { ...prev, amount }
                                    })
                                }
                                calculateTokenAmount(amount, direction, true, outputTokenBalance)
                            }}>
                            Max
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full flex justify-center'>
                <button disabled={!props.isLoanOwner || props.loanState !== 'Trading'} className='transform b-transparent b-rd-10 b-solid bg-transparent text-34 text-#fff transition-transform active:scale-98 hover:scale-102'
                    onClick={() => {
                        setDirection(d => !d)
                        calculateTokenAmount(
                            inputAmount,
                            !direction,
                            !direction,
                            outputTokenBalance,
                        )
                    }} >
                    <ArrowDownOutlined size={20} className={`${!props.isLoanOwner ? 'text-white/20' : 'text-white'}`} />
                    {/* <VerticalAlignMiddleOutlined size={20} className={`${!props.isLoanOwner ? 'text-white/20' : 'text-white'}`} /> */}
                </button>
            </div>
            <div className='h150 w-full flex flex-col justify-center'>
                <div className='w-full flex items-center justify-between b-rd-6'>
                    <div className='flex items-center justify-between'>
                        <CurrencyInput
                            className={`${outputAmountCalculating ? 'text-white' : 'text-white'} font-semiBold h-30 max-xl:w-150 xl:w-300 border-none bg-transparent text-28 focus:border-0 focus:border-none focus:bg-black focus:outline-none`}
                            disabled={!props.isLoanOwner || props.loanState !== 'Trading'}
                            value={
                                direction
                                    ? outputAmountCalculating
                                        ? outputToken.amount
                                        : outputAmount
                                    : inputAmountCalculating
                                        ? inputToken.amount
                                        : inputAmount
                            }
                            name="outputTokenAmount"
                            placeholder="0"
                            decimalsLimit={9}
                            onValueChange={(_value, _name, values) => {
                                if (values && values.value !== (direction ? outputAmount : inputAmount)) {
                                    direction
                                        ? setOutputAmount(values.value)
                                        : setInputAmount(values.value)

                                    debounceInput$.next([values.value, direction, false, outputTokenBalance])
                                }
                            }}
                            onFocus={() => {
                                if (direction) {
                                    setInputAmountCalculating(true)
                                    setOutputAmountCalculating(false)
                                }
                                else {
                                    setInputAmountCalculating(false)
                                    setOutputAmountCalculating(true)
                                }
                            }}
                        />
                    </div>
                    <div className='flex justify-center'>
                        <Button shape="round" size='large' className='w-150' disabled={!props.isLoanOwner || props.loanState !== 'Trading'}
                            onClick={() => {
                                if (direction)
                                    setOpenTokenList(true)
                            }}
                        >
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <Image preview={false} src={direction ? outputToken.logo : inputToken.logo} width={24}></Image>
                                    <span className='ml-6 flex items-center text-center'> {direction ? outputToken.symbol : inputToken.symbol}</span>
                                </div>
                                <DownOutlined hidden={!direction} />
                            </div>
                        </Button>
                    </div>
                </div>
                <div className='mt-5 w-full flex items-center justify-end b-rd-6'>
                    <span className={`${!props.isLoanOwner ? 'text-white/20' : 'text-white'}`}>Balances:</span>
                    <div className={`ml-20 mr-10 ${!props.isLoanOwner || checkingOutputTokenBalance ? 'text-white/20' : 'text-white'}`}>{
                        !props.isLoanOwner
                            ? '0.0'
                            : checkingOutputTokenBalance
                                ? <LoadingOutlined width={10} className='text-white' />
                                : formatUnits(direction ? outputTokenBalance : inputTokenBalance, direction ? outputToken.decimals : inputToken.decimals)
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
