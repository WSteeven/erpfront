import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Ref } from 'vue'

export class Grupo extends EntidadAuditable {
  nombre: string | null
  coordinador: number | null
  activo: boolean
  region: string | null
  cant_empleados: number | null
  empleados: Ref<any[]>[]|null

  constructor() {
    super()
    this.nombre = null
    this.coordinador = null
    this.activo = true
    this.region = null
    this.cant_empleados = null
    this.empleados = []
  }
}
