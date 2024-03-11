//Dependencias
import { defineComponent, reactive, } from "vue";
import { useQuasar, } from "quasar";

//Componentes
import EssentialTable from "components/tables/view/EssentialTable.vue";
import ModalEntidad from 'components/modales/view/ModalEntidad.vue';


//Logica y controladores
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { AxiosResponse } from "axios"
import { apiConfig, endpoints } from "config/api";
import { useNotificaciones } from "shared/notificaciones";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { imprimirArchivo, ordenarLista } from 'shared/utils'
import { useNotificacionStore } from 'stores/notificacion';
import { ComportamientoModalesTransaccionEgreso } from 'pages/bodega/transacciones/modules/transaccionEgreso/application/ComportamientoModalesGestionarEgresos';
import { useCargandoStore } from "stores/cargando";
import { Gasto } from "pages/fondosRotativos/gasto/domain/Gasto";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { ValoresFondosEmpleadoController } from "../infraestructure/ValoresFondosEmpleadoController";
import { EmpleadoSaldoFondosRotativos } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoSaldoFondosRotativos";
import { configuracionColumnasReportesFondosRotativos } from "../domain/configuracionColumnasReportesFondosRotativos";
import { useAuthenticationStore } from "stores/authentication";

export default defineComponent({
    components: { EssentialTable, ModalEntidad },
    setup() {
        const mixin = new ContenedorSimpleMixin(Gasto, new ValoresFondosEmpleadoController())
        const { listadosAuxiliares, listado } = mixin.useReferencias()
        const { obtenerListados, cargarVista } = mixin.useComportamiento()
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const cargando = new StatusEssentialLoading()
        const modales = new ComportamientoModalesTransaccionEgreso()
        const store = useAuthenticationStore()

        const reporte = reactive({
            todos: false,
            empleado: null,
            accion: '',
        })

        const { notificarError, notificarAdvertencia } = useNotificaciones()
        const { empleados, filtrarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)

        cargarVista(async () => {
            await obtenerListados({
                empleados: {
                    controller: new EmpleadoSaldoFondosRotativos(),
                    params: {
                        // activo: 1
                    }
                },
            })
            //listados
            empleados.value = listadosAuxiliares.empleados
            reporte.empleado = store.user.id
        })


        /**
         * Funciones
         */
        function limpiarCampos() {
            reporte.todos = false
            reporte.empleado = null
            reporte.accion = ''
        }
        async function buscarReporte(accion: string) {
            try {
                cargando.activar()
                const axios = AxiosHttpRepository.getInstance()
                let url = axios.getEndpoint(endpoints.reporte_valores_fondos_empleados)
                const filename = 'reporte_egresos_bodega'
                switch (accion) {
                    case 'excel':
                        url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.reporte_valores_fondos_empleados) + '/reportes'
                        reporte.accion = 'excel'
                        imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, reporte)

                        break
                    case 'pdf':
                        url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.reporte_valores_fondos_empleados) + '/reportes'
                        reporte.accion = 'pdf'
                        imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, reporte)
                        break
                    default:
                        reporte.accion = ''
                        const response: AxiosResponse = await axios.post(url, reporte)
                        // console.log(response)
                        if (response.data.results) {
                            listado.value = response.data.results
                            if (response.data.results.length < 1) notificarAdvertencia('No se obtuvieron resultados')
                        }
                }
                cargando.desactivar()
            } catch (e) {
                console.log(e)
                notificarError('Error al obtener reporte')
            } finally {
                cargando.desactivar()
            }
        }


        return {
            reporte,
            //listados
            listado,
            empleados, filtrarEmpleados,
            configuracionColumnas: configuracionColumnasReportesFondosRotativos,

            //funciones
            buscarReporte,
            ordenarLista,
            //botones
            modales,
            store,

        }
    }
})
