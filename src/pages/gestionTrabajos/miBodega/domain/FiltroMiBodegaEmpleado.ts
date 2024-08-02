import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useAuthenticationStore } from 'stores/authentication'

export class FiltroMiBodegaEmpleado extends EntidadAuditable {
  empleado_id: number | null
  cliente_id: number | null | undefined
  subtarea_id?: number | null

  constructor() {
    super()
    this.empleado_id = useAuthenticationStore().user.id
    this.cliente_id = undefined
    this.subtarea_id = null
    this.isComponentFilesModified = null
  }
}
