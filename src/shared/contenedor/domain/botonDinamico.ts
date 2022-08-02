import {Ref} from "vue"
import {ComportamientoModales} from "../../componentes/modales/application/ComportamientoModales.application"
// import {ComportamientoModales} from "@shared/generales/modalesEntidad/application/comportamientoModales.application"
// import {ComportamientoTabla} from "@shared/tabla/domain/tabla.domain"

export interface BotonDinamico {
  isVisible: Ref<boolean>
  comportamiento: // | ComportamientoTabla<any, any>
  ComportamientoModales<any> | any
  title: string

  accionBoton(): void
}
