/* eslint-disable @typescript-eslint/indent */
export enum NotificationError {
    TransactionFailed = 'Transaction failed.',
    TransactionError = 'Transaction error.',
}

export enum MessageError {
    GenenalError = 'Error Code: 1000',
    NullReceipt = 'Error Code: 1001', // Null receipt
    TransactionFailed = 'Error Code: 1002', // Transaction failed
    ProviderOrSignerIsNotInitialized = 'Error Code: 1003', // Provider or Signer is not initialized.

    AllowanceIsNotEnough = 'Error Code: 1004', // The allowance is not enough, please approve it
    CapitalPoolOrRefundPoolAddressIsUnavailable = 'Error Code: 1005', // Capital Pool or Refund Pool address is unavailable, please create it.
    PoolsExist = 'Error Code: 1006', // The Pools exist.
    TokenIdIsNotFound = 'Error Code: 1007', // TokenId is not Found
}
