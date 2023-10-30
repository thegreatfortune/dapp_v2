export namespace Models {
  export class CreditScoreVo {
    /** 分数 */
    score?: number = 0;
    /** 还款状态 */
    repaymentState?: 'UNPAID' | 'REPAID' | 'OVERDUE' = 'UNPAID';
  }

  export class getCreditAddressQueryAddressCreditScoreParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    id?: number = 0;
    /** 地址id */
    addressId?: number = 0;
    orderItemList?: Array<OrderItem> = [];
  }

  export class getCreditAddressQueryAddressExceptionParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    id?: number = 0;
    /** 地址id */
    addressId?: number = 0;
    orderItemList?: Array<OrderItem> = [];
  }

  export class Object {}

  export class OrderItem {
    /** 列 */
    column: string = '';
    /** 是否是asc排序 */
    asc: boolean = false;
  }

  export enum RepaymentState {
    '未还款' = 0,
    '已还款' = 1,
    '逾期' = 2,
  }

  export class ResultCreditScoreVo {
    code?: number = 0;
    message?: string = undefined;
    data?: CreditScoreVo = undefined;
  }
}
