import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Ref } from 'vue'

export class Grupo extends EntidadAuditable {
  nombre: string | null
  nombre_alternativo: string|null
  coordinador: number | null
  coordinador_id: number | null
  activo: boolean
  region: string | null
  cant_empleados: number | null
  empleados: Ref<any[]>[]|null
  vehiculo: number|null
  placa: string|null

  constructor() {
    super()
    this.nombre = null
    this.nombre_alternativo = null
    this.coordinador = null
    this.coordinador_id = null
    this.activo = true
    this.region = null
    this.cant_empleados = null
    this.empleados = []
    this.vehiculo = null
    this.placa = null
  }
}
