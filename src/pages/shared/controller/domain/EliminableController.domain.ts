import { HttpResponseDelete } from '@/app/shared/http/domain/HttpResponse'
import { ResponseItem } from './ResponseItem'

export interface EliminableController<T> {
  eliminar(id: number): Promise<ResponseItem<T, HttpResponseDelete<T>>>
}
