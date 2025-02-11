import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class FamiliaAcogiente extends  EntidadAuditable{
  provincia: number|null
  canton: number|null
  parroquia: number|null
  tipo_parroquia: string|null
  direccion: number|null
  referencia: number|null
  coordenadas: number|null
  nombres_apellidos: number|null
  telefono: number|null

  constructor() {
    super()
    this.provincia = null
    this.canton = null
    this.parroquia = null
    this.tipo_parroquia = null
    this.direccion = null
    this.referencia = null
    this.coordenadas = null
    this.nombres_apellidos = null
    this.telefono = null
  }

}
