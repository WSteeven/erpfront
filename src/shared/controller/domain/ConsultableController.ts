import { HttpResponseGet } from 'shared/http/domain/HttpResponse'
import { ResponseItem } from './ResponseItem'
import { ParamsType } from 'config/types'

export interface ConsultableController<T> {
  obtener<C = T>(params?: ParamsType): Promise<ResponseItem<C, HttpResponseGet<C>>>
}
