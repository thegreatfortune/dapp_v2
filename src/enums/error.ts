/* eslint-disable @typescript-eslint/indent */
export enum NotificationError {

    TransactionFailed = 'Transaction failed.',
    TransactionError = 'Transaction error.',
}

export enum MessageError {
    GenenalError = 'Error-1000',
    ProviderOrSignerIsNotInitialized = 'Error-1001', // Provider or Signer is not initialized.

    TokenIdIsNotFound = 'Error-1002', // TokenId is not Found

    AllowanceIsNotEnough = 'Error-1003', // The allowance is not enough, please approve it
    CapitalPoolOrRefundPoolAddressIsUnavailable = 'Error-1004', // Capital Pool or Refund Pool address is unavailable, please create it.
    PoolsExist = 'Error-1005', // The Pools exist.
}
