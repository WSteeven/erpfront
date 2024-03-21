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
import { apiConfig, endpoints } from 'config/api'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { format } from '@formkit/tempo'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { imprimirArchivo } from 'shared/utils'
import { useQuasar } from 'quasar'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
    components: { TabLayout, GestorDocumentos, EssentialPopupEditableTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(PagoProveedor, new PagoProveedorController())
        const { entidad: pago, accion, disabled, listado } = mixin.useReferencias()
        const { setValidador, listar } = mixin.useComportamiento()
        const { confirmar } = useNotificaciones()
        const { onConsultado } = mixin.useHooks()

        // Stores
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())

        // variables
        const refArchivo = ref()
        const total = computed(() => pago.listado.reduce((prev, curr: any) => prev + parseFloat(curr.valor_pagar), 0).toFixed(2))

        //Reglas de validacion
        const reglas = {
            // mes: { required },
        }
        const v$ = useVuelidate(reglas, pago)
        setValidador(v$.value)

        /************************
         * Botones de tabla
         ***********************/
        onConsultado(() => {
            if (accion.value == acciones.editar) {
                configuracionColumnasItemsPago.find((item) => item.field === 'valor_pagar')!.visible = true
                configuracionColumnasItemsPago.find((item) => item.field === 'valor_pagar')!.editable = true
                configuracionColumnasItemsPago.find((item) => item.field === 'valor_pagar')!.type = 'number'
                configuracionColumnasItemsPago.find((item) => item.field === 'valor_pagar')!.hint = 'Ingresa el valor a pagar'
            } else {
                configuracionColumnasItemsPago.find((item) => item.field === 'valor_pagar')!.editable = false
                // configuracionColumnasItemsPago.find((item) => item.field === 'valor_pagar')!.editable = false
            }
        })
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

        const btnCash: CustomActionTable = {
            titulo: 'Cash',
            icono: 'bi-file-earmark-excel-fill',
            color: 'positive',
            accion: async ({ entidad }) => {
                await exportarCash(entidad)
            },
        }

        /************************
         * FUNCIONES
         ***********************/
        async function exportarCash(entidad): Promise<void> {
            const filename = 'pago_a_proveedores_' + format(new Date(), 'D-MM-YYYY')
            const axios = AxiosHttpRepository.getInstance()
            const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.pagos_proveedores) + '/cash/' + entidad.id
            await imprimirArchivo(url, 'GET', 'blob', 'xlsx', filename, null)
        }

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
            data.valor_pagar = Number(data.valor_pagar).toFixed(2)
            if (data.total < data.valor_pagar) data.valor_pagar = data.total
            // console.log(data)
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
            btnCash,

            //funciones
            subirArchivos,
            calcularValores,
            //investigar aqua, capa 2 para BTC
            //variable computada para el calculo del total a pagar 
            total,
        }
    }
})