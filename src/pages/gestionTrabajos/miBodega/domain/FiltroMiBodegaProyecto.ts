import { useAuthenticationStore } from 'stores/authentication'

export class FiltroMiBodegaProyecto {
  etapa: number | null
  proyecto: number | null
  empleado_id: number | null
  cliente_id: number | null | undefined

  constructor() {
    this.etapa = null
    this.proyecto = null
    this.empleado_id = useAuthenticationStore().user.id
    this.cliente_id = null
  }
}
