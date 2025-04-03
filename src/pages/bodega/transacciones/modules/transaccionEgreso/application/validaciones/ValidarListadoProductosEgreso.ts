import { Validador } from 'shared/validadores/domain/Validador';
import { Transaccion } from 'pages/bodega/transacciones/domain/Transaccion';
import { Ref, ref } from 'vue';

export class ValidarListadoProductosEgreso implements Validador {
  private transaccion: Transaccion
  private listadoPedido: Ref<any[]> = ref([])

  constructor(transaccion: Transaccion, listado: Ref<any[]>) {
    this.transaccion = transaccion
    this.listadoPedido = listado
  }

  /**
   * Validar que el listado no esté vacío
   */
  async validar(): Promise<boolean> {
    // console.log('transaccion en la validacion es: ',this.transaccion)
    // console.log('listado de pedido en la validacion es: ',this.listadoPedido)

    if (this.transaccion.listadoProductosTransaccion.length === 0) throw new Error('Debe agregar al menos un producto al listado')
    const tiene_ceros = this.transaccion.listadoProductosTransaccion.some((v) => v.cantidad <= 0)
    if (tiene_ceros) throw new Error('La cantidad de los productos del listado debe ser mayor a 0')
    // console.log('Es un array: ',this.listadoPedido.value)

    //En esta parte se valida duplicados y cantidades mayores
    this.listadoPedido.value.forEach((v) => {
      let total = 0
      this.transaccion.listadoProductosTransaccion.filter((w) => { if (w.detalle == v.id) total += w.cantidad })
      if (total > v.cantidad) throw new Error('No puedes despachar más items de la cantidad solicitada')
    });

    return true
  }
}
