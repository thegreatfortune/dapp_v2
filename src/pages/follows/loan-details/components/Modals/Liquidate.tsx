/* eslint-disable @typescript-eslint/indent */
import type { ModalProps } from 'antd'
import { Button, Modal } from 'antd'
import { formatUnits } from 'ethers'
import { useEffect, useState } from 'react'
import { useChainId } from 'wagmi'
import useCoreContract from '@/hooks/useCoreContract'
import { executeTask, handleTransactionResponse } from '@/helpers/helpers'
import { NotificationInfo } from '@/enums/info'
import { MessageError } from '@/enums/error'
import { TokenEnums } from '@/enums/chain'
import { createContract } from '@/contract/coreContracts'
import type {
    FollowCapitalPool as capitalPool,
} from '@/abis/types'
import capitalPoolABI from '@/abis/FollowCapitalPool.json'

interface IProps extends ModalProps {
    setOpen: (isOpen: boolean) => void
    tradeId: number
    installments: number
}

const LiquidateModal: React.FC<IProps> = (props) => {
    const chainId = useChainId()
    const { coreContracts } = useCoreContract()

    const [liquidateAmount, setLiquidateAmount] = useState(BigInt(0))

    const [liquidateing, setLiquidateing] = useState(false)
    const [liquidateButtonText, setLiquidateButtonText] = useState('Liquidate')
    const [liquidateButtonDisabled, setLiquidateButtonDisabled] = useState(false)

    const [liquidated, setLiquidated] = useState(false)

    const resetModal = () => {
        setLiquidateing(false)
        setLiquidateButtonText('Liquidate')
        setLiquidateButtonDisabled(false)

        props.setOpen(false)
    }
    const liquidate = async () => {
        const task = async () => {
            if (liquidateButtonText === 'Finish') {
                resetModal()
                return
            }
            if (coreContracts) {
                setLiquidateing(true)
                setLiquidateButtonDisabled(true)

                const capitalPoolAddress = await coreContracts.manageContract.getTradeIdToCapitalPool(props.tradeId)
                const capitalPoolContract = createContract<capitalPool>(capitalPoolAddress, capitalPoolABI, coreContracts.signer)

                let res
                try {
                    if (props.installments > 1)
                        res = await capitalPoolContract.multiLiquidate(props.tradeId, 3000)
                    else
                        res = await capitalPoolContract.singleLiquidate(props.tradeId, 3000)

                    await handleTransactionResponse(res,
                        NotificationInfo.LiquidateSuccessfully,
                        NotificationInfo.LiquidateSuccessfullyDesc,
                    )
                }
                catch (error) {
                    setLiquidateing(false)
                    setLiquidateButtonDisabled(false)
                    return Promise.reject(error)
                }
                setLiquidateing(false)
                setLiquidateButtonDisabled(false)
                setLiquidateButtonText('Finish')

                setLiquidated(true)
            }
            else {
                return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            }
        }
        executeTask(task)
    }

    useEffect(() => {
        const task = async () => {
            if (coreContracts) {
                const liquidateAmount = await coreContracts.processCenterContract.getOrderReapyMoney(props.tradeId)
                if (liquidateAmount === BigInt(0))
                    setLiquidateButtonDisabled(true)
                setLiquidateAmount(liquidateAmount)
            }
        }
        executeTask(task)
    }, [coreContracts, props.open])

    return <Modal open={props.open}
        onCancel={() => resetModal()}
        title={'Liquidate'}
        centered={true}
        footer={
            <div className='flex justify-end' >
                <Button className={`h-40 text-16 w-1/2 ${!liquidateButtonDisabled ? 'primary-btn' : ''}`} type='primary'
                    loading={liquidateing}
                    disabled={liquidateButtonDisabled}
                    onClick={liquidate}
                >{liquidateButtonText}</Button>
            </div >
        }
    >
        <div className='mt-30 h-60 text-16'>
            {
                liquidated
                    ? (<div>
                        This loan has been liquidated successfully!
                    </div>)
                    : liquidateAmount === BigInt(0)
                        ? (<div>
                            This loan do not need to be liquidated.
                        </div>)
                        : (<div>
                            The liquidate amount of this loan is
                            <span className='text-18'> {formatUnits(liquidateAmount, TokenEnums[chainId].USDC.decimals)} </span>
                            USDC
                        </div>
                        )
            }
        </div>
    </Modal >
}

export default LiquidateModal
