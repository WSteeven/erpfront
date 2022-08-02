import {ListableController} from "@shared/controller/domain/listableController.domain"

export type listadoAuxiliar<T> = {
  [K in keyof T]:
    | ListableController<any>
    | {controller: ListableController<any>; params: Record<string, any>}
    | any[]
}
