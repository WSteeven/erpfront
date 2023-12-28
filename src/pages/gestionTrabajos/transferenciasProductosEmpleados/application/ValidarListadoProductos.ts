import { Validador } from 'shared/validadores/domain/Validador'
import { TransferenciaProductoEmpleado } from '../domain/TransferenciaProductoEmpleado'

export class ValidarListadoProductos implements Validador {
  private transferencia: TransferenciaProductoEmpleado

  constructor(devolucion: TransferenciaProductoEmpleado) {
    this.transferencia = devolucion
  }

  async validar(): Promise<boolean> {
    if (this.transferencia.listado_productos.length === 0) { throw new Error('Debe agregar al menos un producto al listado') }
    if (this.transferencia.listado_productos.some((v) => v.cantidad <= 0 || v.cantidad == null || v.cantidad == '')) { throw new Error('Todos los elementos del listado deben tener una cantidad mayor a cero') }
    return true
  }
}
