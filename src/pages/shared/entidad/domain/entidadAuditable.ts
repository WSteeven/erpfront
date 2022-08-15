import { Auditable } from '@/app/shared/auditoria/domain/Auditable.application'
import { Hidratable } from './Hidratable'

export class EntidadAuditable extends Hidratable implements Auditable {
  id: number | null
  // negocio: number | null
  // usuario_inserta: number | null
  // usuario_modifica: number | null
  // fecha_inserta: string | null
  // fecha_modifica: string | null

  constructor() {
    super()
    this.id = null
    // this.negocio = null
    // this.usuario_inserta = null
    // this.usuario_modifica = null
    // this.fecha_inserta = null
    // this.fecha_modifica = null
  }
}
