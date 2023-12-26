import { useAuthenticationStore } from 'stores/authentication'

export class FiltroMiBodegaEmpleado {
  empleado_id: number | null
  cliente_id: number | null | undefined

  constructor() {
    this.empleado_id = useAuthenticationStore().user.id
    this.cliente_id = undefined
  }
}
