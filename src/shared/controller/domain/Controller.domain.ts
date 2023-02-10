import { ParamsType } from 'config/types'
import {
  HttpResponseDelete,
  HttpResponseGet,
  HttpResponsePost,
  HttpResponsePut,
} from 'shared/http/domain/HttpResponse'
import { ListableController } from './ListableController.domain'
import { ResponseItem } from './ResponseItem'

export interface Controller<T> extends ListableController<T> {
  consultar(
    id: number | null,
    params?: any
  ): Promise<ResponseItem<T, HttpResponseGet<T>>>

  guardar(item: T, params?: ParamsType): Promise<ResponseItem<T, HttpResponsePost<T>>>

  editar(item: T, params?: any): Promise<ResponseItem<T, HttpResponsePut<T>>>

  eliminar(
    id: number | null,
    params?: any
  ): Promise<ResponseItem<T, HttpResponseDelete<T>>>
}
