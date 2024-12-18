import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Ingreso extends EntidadAuditable{
  nombres_apellidos: string | null
  ocupacion: string | null
  ingreso_mensual: number | null

  constructor() {
    super()
    this.nombres_apellidos = null
    this.ocupacion = null
    this.ingreso_mensual = 0
  }
}
