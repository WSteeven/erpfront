import { Transaccion } from "pages/bodega/transacciones/domain/Transaccion";
import { Validador } from "shared/validadores/domain/Validador";
import { Ref, ref } from "vue";

export class ValidarListadoProductosIngreso implements Validador {
    private transaccion: Transaccion
    private listadoDevolucion: Ref<any[]> = ref([])

    constructor(transaccion: Transaccion, listado: Ref<any[]>) {
        this.transaccion = transaccion
        this.listadoDevolucion = listado
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
        if (!this.transaccion.ingreso_masivo) {
            const condiciones = this.transaccion.listadoProductosTransaccion.every(v => v.hasOwnProperty('condiciones'))
            if (!condiciones) throw new Error('Debes seleccionar un estado para cada ítem')
        }

        return true
    }
}