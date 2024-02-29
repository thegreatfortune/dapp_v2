/* eslint-disable @typescript-eslint/indent */
export enum NotificationError {
    TransactionFailed = 'Transaction failed.',
    TransactionError = 'Transaction error.',
}

export enum MessageError {
    GenenalError = 'Error Code: 1000',
    SiganMessageError = 'Error Code: 1001',
    NullReceipt = 'Error Code: 1002', // Null receipt
    TransactionFailed = 'Error Code: 1003', // Transaction failed
    ProviderOrSignerIsNotInitialized = 'Error Code: 1004', // Provider or Signer is not initialized.
    LoginFailed = 'Error Code: 1005',

    AllowanceIsNotEnough = 'Error Code: 2001', // The allowance is not enough, please approve it
    CapitalPoolOrRefundPoolAddressIsUnavailable = 'Error Code: 2002', // Capital Pool or Refund Pool address is unavailable, please create it.
    PoolsExist = 'Error Code: 2003', // The Pools exist.
    TokenIdIsNotFound = 'Error Code: 2004', // TokenId is not Found
}
