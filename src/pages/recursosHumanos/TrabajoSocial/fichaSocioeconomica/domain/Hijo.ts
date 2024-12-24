import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Hijo extends EntidadAuditable {
  nombres_apellidos: string | null
  ocupacion: string | null
  edad: number | null

  constructor() {
    super()
    this.nombres_apellidos = null
    this.ocupacion = null
    this.edad = null
  }
}
