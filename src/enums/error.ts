/* eslint-disable @typescript-eslint/indent */
export enum NotificationError {
    TransactionFailed = 'Transaction failed.',
    TransactionFailedDesc = 'Your transaction cannot be confirmed.',
    TransactionError = 'Transaction error.',

    CannotApplyLoan = 'Can not apply a loan.',
    CannotApplyLoanDesc = 'You have a un-liquidate loan, or you\'re in Blacklist.',

    InsufficientBalance = 'Insufficient balance.',
    InsufficientBalanceDesc = 'You have Insufficient Balance.',
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
    TokenIdIsNotFound = 'Error Code: 2003', // TokenId is not Found
    PoolsExist = 'Error Code: 2004', // The Pools exist.
    PoolsDoNotExist = 'Error Code: 2005', // The Pools exist.
    InBlacklist = 'Error Code: 2006',
    CanNotCreateDuplicateLoan = 'Error Code: 2007',
    CalculationResultIsIncorrect = 'Error Code: 2008',

    InvalidFormData = 'Invalid form data, Please check your input!',
    NotLoggedIn = 'Please log in first.',
}
