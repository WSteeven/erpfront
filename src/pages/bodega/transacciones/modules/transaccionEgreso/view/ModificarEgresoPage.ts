import EssentialTable from "components/tables/view/EssentialTable.vue";
import { Transaccion } from "pages/bodega/transacciones/domain/Transaccion";
import { useTransaccionStore } from "stores/transaccion";
import { defineComponent, reactive } from "vue";
import { configuracionColumnasProductosSeleccionadosEgreso } from "../domain/configuracionColumnasProductosSeleccionadosEgreso";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { CustomActionPrompt } from "components/tables/domain/CustomActionPrompt";
import { useNotificaciones } from "shared/notificaciones";
import { estadosTransacciones } from "config/utils";

export default defineComponent({
    components: { EssentialTable },
    setup(props, { emit }) {
        const { prompt } = useNotificaciones()
        const transaccionStore = useTransaccionStore()
        const transaccion = reactive(new Transaccion())

        if (transaccionStore.transaccion) {
            transaccion.hydrate(transaccionStore.transaccion)
            //Verificamos si el item aún no ha sido modificado parcialmente, en caso de que si, ya no se le puede sumar, solo restar
            // transaccion.listadoProductosTransaccion.filter((item) => item.despa)
        }

        const btnEditarCantidadPendiente: CustomActionTable = {
            titulo: 'Editar',
            icono: 'bi-pencil-square',
            color: 'secondary',
            accion: ({ entidad, posicion }) => {
                console.log('btnEditarCantidadPendiente')
                console.log(entidad, posicion)
                console.log('aquí se podrá modificar hacia arriba o hacia abajo la cantidad');
                const config: CustomActionPrompt = {
                    titulo: 'Modicación de cantidad despachada',
                    mensaje: 'Ingresa la nueva cantidad despachada',
                    defecto: transaccion.listadoProductosTransaccion[posicion].cantidad,
                    tipo: 'number',
                    accion: (data) => {
                        transaccion.listadoProductosTransaccion[posicion].cantidad = data
                        // se guarda luego de setear la cantidad
                        transaccionStore.editarItemEgreso({
                            tipo: transaccionStore.tab,
                            cantidad: data,
                            transaccion_id: transaccion.id,
                            item: entidad
                        })
                        //Aqui se debe actualizar el registro modificado
                        emit('cerrar-modal', false)
                    }
                }
                prompt(config)
            },
            visible: ({ entidad }) => transaccionStore.tab === estadosTransacciones.pendiente
        }

        const btnEditarCantidadParcial: CustomActionTable = {
            titulo: 'Editar',
            icono: 'bi-pencil-square',
            color: 'secondary',
            accion: ({ entidad, posicion }) => {
                console.log('btnEditarCantidadParcial')
                console.log(entidad, posicion)
                console.log('aquí no se podrá despachar más de la cuenta');
                const config: CustomActionPrompt = {
                    titulo: 'Modicación de cantidad despachada',
                    mensaje: 'Ingresa la nueva cantidad despachada',
                    defecto: transaccion.listadoProductosTransaccion[posicion].cantidad,
                    tipo: 'number',
                    accion: (data) => {
                        transaccion.listadoProductosTransaccion[posicion].cantidad = data
                        // se guarda luego de setear la cantidad
                        transaccionStore.editarItemEgreso({
                            tipo: transaccionStore.tab,
                            cantidad: data,
                            transaccion_id: transaccion.id,
                            item: entidad
                        })
                        //Aqui se debe actualizar el registro modificado
                        emit('cerrar-modal', false)
                    }
                }
                prompt(config)
            },
            visible: ({ entidad }) => transaccionStore.tab === estadosTransacciones.parcial && entidad.pendiente > 0
        }

        return {
            transaccion,
            configuracionColumnasProductosSeleccionadosEgreso,

            //botones
            btnEditarCantidadPendiente,
            btnEditarCantidadParcial,
        }
    }
})