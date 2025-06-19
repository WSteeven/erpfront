import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Hijo extends EntidadAuditable {
  tipo: string | null
  genero: string | null
  nombres_apellidos: string | null
  ocupacion: string | null
  edad: number | null

  constructor() {
    super()
    this.tipo = null
    this.genero = null
    this.nombres_apellidos = null
    this.ocupacion = null
    this.edad = null
  }
}
