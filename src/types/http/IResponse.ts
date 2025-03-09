export interface IResponse<T> {
  messages: string[]
  payload: T
}

export type IEmptyResponse = IResponse<never>
