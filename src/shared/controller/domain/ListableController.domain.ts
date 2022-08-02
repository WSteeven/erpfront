import {
  HttpResponseGet,
  HttpResponseList,
} from "@shared/http/domain/HttpResponse"
import {ResponseItem} from "./ResponseItem"

export interface ListableController<T> {
  listar<C = T>(
    params?: any
  ): Promise<ResponseItem<C[], HttpResponseGet<HttpResponseList<C>>>>
}
