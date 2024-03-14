// Dependencias
import { configuracionColumnasItemsPago } from '../domain/configuracionColumnasItemsPago'
import { configuracionColumnasPagoProveedores } from '../domain/configuracionColumnasPagoProveedores'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import EssentialPopupEditableTable from "components/tables/view/EssentialPopupEditableTable.vue"

//Logica y controladores
import { PagoProveedor } from '../domain/PagoProveedor'
import { PagoProveedorController } from '../infraestructure/PagoProveedorController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { acciones, accionesTabla } from 'config/utils'
import { endpoints } from 'config/api'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
    components: { TabLayout, GestorDocumentos, EssentialPopupEditableTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(PagoProveedor, new PagoProveedorController())
        const { entidad: pago, accion, disabled, listado } = mixin.useReferencias()
        const { setValidador, listar } = mixin.useComportamiento()
        const { confirmar } = useNotificaciones()
        const { onConsultado } = mixin.useHooks()

        const refArchivo = ref()
        // const configuracionColumnasItems = ref()

        //Reglas de validacion
        const reglas = {
            // mes: { required },
        }
        const v$ = useVuelidate(reglas, pago)
        setValidador(v$.value)

        /************************
         * Botones de tabla
         ***********************/
        // onConsultado(() => {
        //     if (accion.value == acciones.editar) {
        //         configuracionColumnasItems.value = [...configuracionColumnasItemsPago, {
        //             name: 'valor_pagar',
        //             field: 'valor_pagar',
        //             label: 'V. Pagar',
        //             align: 'left',
        //             sortable: true
        //         },]
        //     }
        // })
        /************************
         * Botones de tabla
         ***********************/
        const btnEliminarFila: CustomActionTable = {
            titulo: 'Eliminar',
            icono: 'bi-x',
            color: 'negative',
            accion: ({ entidad, posicion }) => {
                eliminar({ posicion })
                // confirmar('¿Está seguro de continuar?', () => prefactura.listadoProductos.splice(posicion, 1))
            },
            visible: () => accion.value == acciones.editar
        }

        /************************
         * FUNCIONES
         ***********************/
        function eliminar({ posicion }) {
            confirmar('¿Está seguro de continuar?', () => pago.listado.splice(posicion, 1))
        }
        async function subirArchivos() {
            await refArchivo.value.subir()
            console.log(refArchivo.value)
            // listado.value = refArchivo.value.listado
            listar()
        }
        function calcularValores(data: any) {
            console.log(data)
        }


        return {
            pago, mixin, accion, acciones, disabled,
            configuracionColumnas: configuracionColumnasPagoProveedores,
            columnasItems: configuracionColumnasItemsPago,
            accionesTabla,
            refArchivo,
            endpoint: endpoints.pagos_proveedores,

            //botones de tablas
            btnEliminarFila,

            //funciones
            subirArchivos,
            calcularValores,

            //investigar aqua, capa 2 para BTC
        }
    }
})