import { Responses } from './Responses'

export interface ResponseItem<T, R extends Responses> {
  response: R
  result: T
}
