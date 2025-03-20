export type Code = 0

/**
 * 接口返回数据格式
 * */
export interface Result<T = any> {
    code: Code;
    success: boolean
    data?: T;
    message?: string;
    ok?: boolean;
    result?: string;
}