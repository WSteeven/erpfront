import { Hidratable } from './Hidratable'

export class EntidadAuditable extends Hidratable { //implements Auditable {
  id: number | null
  created_at: string | null
  updated_at: string | null
  isComponentFilesModified: boolean | null // Al momento de consultar un registro que tiene archivos y este se modifica (archivos) esta variable cambia a true
  // negocio: number | null
  // usuario_inserta: number | null
  // usuario_modifica: number | null
  // fecha_inserta: string | null
  // fecha_modifica: string | null

  constructor() {
    super()
    this.id = null
    this.created_at = null
    this.updated_at = null
    this.isComponentFilesModified = false
    // this.negocio = null
    // this.usuario_inserta = null
    // this.usuario_modifica = null
    // this.fecha_inserta = null
    // this.fecha_modifica = null
  }
}
