import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Planificador extends EntidadAuditable{
  empleado: number|null
  nombre: string|null
  completado: string|null
  actividades: []

  constructor() {
    super()
    this.empleado = null
    this.nombre = null
    this.completado = 0
    this.actividades=[]
  }
}
