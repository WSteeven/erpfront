import { useAuthenticationStore } from 'stores/authentication'

export class FiltroMiBodega {
  tarea_id: number | null
  // tipoStock: number | null
  empleado_id: number | null
  cliente_id: number | null | undefined

  constructor() {
    this.tarea_id = null
    // this.tipoStock = null
    this.empleado_id = useAuthenticationStore().user.id
    this.cliente_id = null
  }
}
