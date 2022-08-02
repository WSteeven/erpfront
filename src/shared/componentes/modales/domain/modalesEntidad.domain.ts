import {ComponenteModal} from "./ComponenteModal.domain"

export type ModalesEntidad<T> = {
  [key in keyof T]: ComponenteModal
}
