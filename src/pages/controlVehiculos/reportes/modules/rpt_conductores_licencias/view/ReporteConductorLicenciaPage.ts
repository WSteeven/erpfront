//Dependencies
import { defineComponent, reactive, ref } from "vue"
import { apiConfig, endpoints } from "config/api"
import { imprimirArchivo } from "shared/utils"
import { AxiosResponse } from "axios"

//Components
import EssentialTable from "components/tables/view/EssentialTable.vue"

//Logic and controllers
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin"
import { Conductor } from "pages/controlVehiculos/conductores/domain/Conductor"
import { ConductorController } from "pages/controlVehiculos/conductores/infraestructure/ConductorController"
import { useQuasar } from "quasar"
import { useNotificacionStore } from "stores/notificacion"
import { useCargandoStore } from "stores/cargando"
import { useNotificaciones } from "shared/notificaciones"
import { useAuthenticationStore } from "stores/authentication"
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading"
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales"
import { tiposLicencias } from "config/vehiculos.utils"
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository"
import { requiredIf } from "shared/i18n-validators"
import useVuelidate from "@vuelidate/core"
import { configuracionColumnasConductorLicencia } from "../domain/configuracionColumnasConductorLicencia"

export default defineComponent({
    components: { EssentialTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(Conductor, new ConductorController())
        const { listadosAuxiliares } = mixin.useReferencias()
        const { obtenerListados, cargarVista } = mixin.useComportamiento()

        /************************
         * Stores
         ***********************/
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const { notificarError, notificarAdvertencia } = useNotificaciones()
        const store = useAuthenticationStore()
        const cargando = new StatusEssentialLoading()

        /************************
         * Variables
         ***********************/
        const reporte = reactive({
            conductor: null,
            tipo_licencia: null,
            vigencia: null,
            todos: false,
        })
        const listado = ref([])
        const { empleados, filtrarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)
        cargarVista(async () => {
            await obtenerListados({
                empleados: new ConductorController(),
            })
            empleados.value = listadosAuxiliares.empleados
        })

        const reglas = {
            conductor: { requiredIf: requiredIf(() => !reporte.todos) }
        }
        const v$ = useVuelidate(reglas, reporte)


        /************************
         * Funciones
         ***********************/
        async function obtenerReporte(accion: string, data, listado) {
            if (await v$.value.$validate()) {
                try {
                    cargando.activar()
                    const axios = AxiosHttpRepository.getInstance()
                    const url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.reporte_conductor_licencia)
                    const filename = 'reporte_conductores'
                    switch (accion) {
                        case 'excel':
                            data.accion = 'excel'
                            imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, data)
                            return listado
                        case 'pdf':
                            data.accion = 'pdf'
                            imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, data)
                            return listado
                        default:
                            data.accion = ''
                            const response: AxiosResponse = await axios.post(url, data)
                            // console.log(response)
                            if (response.data.results) {
                                if (response.data.results.length < 1) notificarAdvertencia('No se obtuvieron resultados')
                                return response.data.results
                            } else return listado
                    }
                } catch (error) {
                    console.log(error)
                    notificarError('Error al obtener el reporte')
                } finally {
                    cargando.desactivar()
                }
            }
        }

        async function buscarReporte(accion: string) {
            listado.value = await obtenerReporte(accion, reporte, listado.value)
        }

        return {
            reporte, v$,
            tiposLicencias,
            configuracionColumnas: configuracionColumnasConductorLicencia,
            // modales,

            //listados
            listado,
            empleados, filtrarEmpleados,

            //funciones
            buscarReporte,
        }
    }
})