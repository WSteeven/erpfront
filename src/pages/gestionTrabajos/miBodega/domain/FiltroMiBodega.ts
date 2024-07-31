import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useAuthenticationStore } from 'stores/authentication'

export class FiltroMiBodega extends EntidadAuditable {
  tarea_id: number | null
  // tipoStock: number | null
  empleado_id: number | null
  cliente_id: number | null | undefined

  constructor() {
    super()
    this.tarea_id = null
    // this.tipoStock = null
    this.empleado_id = useAuthenticationStore().user.id
    this.cliente_id = null
    this.isComponentFilesModified = null
  }
}
