import { Endpoint } from '@/app/shared/http/domain/Endpoint'
import {
  HttpResponseDelete,
  HttpResponseGet,
  HttpResponsePost,
  HttpResponsePut,
} from '@/app/shared/http/domain/HttpResponse'

export interface HttpRepository {
  post<T, S = HttpResponsePost<T>>(url: string, data?: any): Promise<S>

  get<T, S = HttpResponseGet<T>>(url: string): Promise<S>

  put<T, S = HttpResponsePut<T>>(url: string, data: any): Promise<S>

  delete<T, S = HttpResponseDelete<T>>(url: string): Promise<S>

  patch<T, S = HttpResponsePut<T>>(
    url: string,
    data: any,
    options?: any
  ): Promise<S>

  getEndpoint(
    endpoint: Endpoint | { endpoint: Endpoint; id: number | null },
    args?: any
  ): string
}
