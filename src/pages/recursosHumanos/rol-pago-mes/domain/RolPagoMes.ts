import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class RolPagoMes extends EntidadAuditable {
  id: number | null
  mes: string | null
  nombre: string | null
  tiene_empleados: boolean
  finalizado: boolean
  cantidad_roles_empleado : number|null
  es_quincena : boolean
  constructor() {
    super()
    this.id = null
    this.mes = null
    this.nombre = null
    this.tiene_empleados = true
    this.finalizado = false
    this.es_quincena = false
    this.cantidad_roles_empleado = null
  }
}
