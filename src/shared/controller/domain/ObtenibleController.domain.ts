import {HttpResponseGet} from "@shared/http/domain/HttpResponse"
import {ResponseItem} from "./ResponseItem"

export interface ObtenibleController<T> {
  obtener<C = T>(params?: any): Promise<ResponseItem<C, HttpResponseGet<C>>>
}
