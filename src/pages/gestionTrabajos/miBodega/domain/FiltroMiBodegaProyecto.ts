import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useAuthenticationStore } from 'stores/authentication'

export class FiltroMiBodegaProyecto extends EntidadAuditable {
  etapa_id: number | null
  proyecto_id: number | null
  empleado_id: number | null
  cliente_id: number | null | undefined

  constructor() {
    super()
    this.etapa_id = null
    this.proyecto_id = null
    this.empleado_id = useAuthenticationStore().user.id
    this.cliente_id = null
    this.isComponentFilesModified = null
  }
}
