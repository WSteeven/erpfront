//Dependencias
import { defineComponent, reactive, ref } from "vue";
import { LocalStorage, useQuasar, } from "quasar";

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
import { TransaccionIngresoController } from "pages/bodega/transacciones/infraestructure/TransaccionIngresoController";
import { Transaccion } from "pages/bodega/transacciones/domain/Transaccion";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { accionesTabla, opcionesReportesEgresos, tiposReportesEgresos } from 'config/utils';
import { MotivoController } from 'pages/administracion/motivos/infraestructure/MotivoController';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { useTransaccionEgresoStore } from 'stores/transaccionEgreso';
import { EmpleadoRoleController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoRolesController';
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController';
import { imprimirArchivo } from 'shared/utils'
import { useNotificacionStore } from 'stores/notificacion';
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController';
import { ComportamientoModalesTransaccionEgreso } from 'pages/bodega/transacciones/modules/transaccionEgreso/application/ComportamientoModalesGestionarEgresos';
import { useCargandoStore } from "stores/cargando";
import { Gasto } from "pages/fondosRotativos/gasto/domain/Gasto";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { ValoresFondosEmpleadoController } from "../infraestructure/ValoresFondosEmpleadoController";
import { EmpleadoFondoRotativoController } from "../infraestructure/EmpleadoFondoRotativoController";

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

        const reporte = reactive({
            todos: false,
            empleado: null,
            accion: '',
        })

        const { notificarError, notificarAdvertencia } = useNotificaciones()
        const { empleados, filtrarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)

        cargarVista(async () => {
            await obtenerListados({
                empleados: new EmpleadoFondoRotativoController(),
            })
            console.log(listadosAuxiliares.empleados)
            console.log(await new EmpleadoFondoRotativoController().listar())
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
                        url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.transacciones_egresos) + '/reportes'
                        reporte.accion = 'excel'
                        imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, reporte)

                        break
                    case 'pdf':
                        url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.transacciones_egresos) + '/reportes'
                        reporte.accion = 'pdf'
                        imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, reporte)
                        break
                    default:
                        reporte.accion = ''
                        const response: AxiosResponse = await axios.post(url, reporte)
                        console.log(response)
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
        async function consultarListado(id: number) {
            limpiarCampos()
            // if (id == tiposReportesEgresos.cliente && em.value.length == 0) {
            //     cargando.activar()
            //     const { response } = await new ClienteController().listar({ estado: 1, requiere_bodega: 1 })
            //     cargando.desactivar()
            //     clientes.value = response.data.results
            // }
        }

        /**
         * Botones de tabla
         */


        //listados
        empleados.value = listadosAuxiliares.empleados







        return {
            reporte,
            //listados
            listado,
            empleados, filtrarEmpleados,

            //funciones
            buscarReporte,
            consultarListado,
            //botones
            modales,

        }
    }
})
