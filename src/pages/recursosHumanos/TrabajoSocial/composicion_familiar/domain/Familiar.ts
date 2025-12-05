import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Familiar extends EntidadAuditable{
  nombres_apellidos: string|null
  parentesco: string|null
  edad: number|null
  estado_civil: string|null
  instruccion: string|null
  ocupacion: string|null // o profesion
  discapacidad: string|number|null
  ingreso_mensual: number|null


  constructor() {
    super()
    this.nombres_apellidos = null
    this.parentesco = null
    this.edad = null
    this.estado_civil = null
    this.instruccion = null
    this.ocupacion = null
    this.discapacidad = null
    this.ingreso_mensual = null
  }
}
