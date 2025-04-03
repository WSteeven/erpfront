import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class LaboratorioClinico extends EntidadAuditable {
  nombre: string | null
  direccion: string | null
  celular: string | null
  correo: string | null
  coordenadas: string | null
  activo: boolean
  canton: number | null

  constructor() {
    super()
    this.nombre = null
    this.direccion = null
    this.celular = null
    this.correo = null
    this.coordenadas = null
    this.activo = true
    this.canton = null
  }
}
