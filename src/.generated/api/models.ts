export namespace Models {
  export class AuthResult {
    success?: boolean = false;
    accessToken?: string = undefined;
  }

  export class CreditScoreGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    id?: number = 0;
    /** 地址id */
    addressId?: number = 0;
    orderItemList?: Array<OrderItem> = [];
  }

  export class CreditScoreVo {
    /** 分数 */
    score?: number = 0;
    /** 还款状态 */
    repaymentState?: 'UNPAID' | 'REPAID' | 'OVERDUE' = undefined;
  }

  export class ExceptionGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    id?: number = 0;
    /** 地址id */
    addressId?: number = 0;
    orderItemList?: Array<OrderItem> = [];
  }

  export class LoginDto {}

  export class MetaMaskLoginParam {
    /** 钱包 */
    address: string = '';
    /** 签名 */
    sign: string = '';
  }

  export class MetaMaskVerifyParam {
    /** 钱包 */
    address?: string = undefined;
  }

  export class Object {}

  export class OrderItem {
    /** 列 需要进行排序的字段 */
    column?: string = undefined;
    /** 是否是asc排序 是否正序排列，默认 true */
    asc?: boolean = false;
  }

  export class PageGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    id?: number = 0;
    /** 地址id */
    addressId?: number = 0;
    orderItemList?: Array<OrderItem> = [];
  }

  export class PageResultCreditScoreVo {
    /** 查询数据列表 */
    records?: CreditScoreVo[] = undefined;
    /** 总数 */
    total?: number = 0;
    /** 每页显示条数，默认 10 */
    size?: number = 0;
    /** 当前页 */
    current?: number = 0;
    /** 排序字段信息 */
    orders?: OrderItem[] = undefined;
    /** 自动优化 COUNT SQL */
    optimizeCountSql?: boolean = false;
    /** 是否进行 count 查询 */
    searchCount?: boolean = false;
    /** {@link #optimizeJoinOfCountSql()} */
    optimizeJoinOfCountSql?: boolean = false;
    /** 单页分页条数限制 */
    maxLimit?: number = 0;
    /** countId */
    countId?: string = undefined;
  }

  export enum RepaymentState {
    '未还款' = 0,
    '已还款' = 1,
    '逾期' = 2,
  }

  export class ResultCreditScoreVo {
    code?: number = 0;
    message?: string = undefined;
    /** com.sszh.modules.credit.vo.CreditScoreVo */
    data?: CreditScoreVo = undefined;
  }
}
