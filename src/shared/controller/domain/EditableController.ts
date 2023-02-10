import { HttpResponsePut } from 'shared/http/domain/HttpResponse'
import { ResponseItem } from './ResponseItem'

export interface EditableController<T> {
  editar(item: T, params?: any): Promise<ResponseItem<T, HttpResponsePut<T>>>
}
