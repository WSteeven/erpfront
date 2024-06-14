//Dependencias
import { configuracionColumnasMatriculas } from "../domain/configuracionColumnasMatriculas";
import { defineComponent, reactive, ref } from "vue";
import { AxiosResponse } from "axios";
import { useQuasar } from "quasar";


// Componentes
import GraficoGenerico from "components/chartJS/GraficoGenerico.vue";
import EssentialTable from "components/tables/view/EssentialTable.vue";
import ModalEntidad from "components/modales/view/ModalEntidad.vue";

//Logica y controladores
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { apiConfig, endpoints } from "config/api";
import { optionsPie } from "config/graficoGenerico";
import { Matricula } from "pages/controlVehiculos/matriculacion/domain/Matricula";
import { MatricularController } from "pages/controlVehiculos/matriculacion/infraestructure/MatriculaController";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { useNotificaciones } from "shared/notificaciones";
import { imprimirArchivo } from "shared/utils";
import { useCargandoStore } from "stores/cargando";
import { useNotificacionStore } from "stores/notificacion";
import { accionesTabla } from "config/utils";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";

export default defineComponent({
    components: { EssentialTable, GraficoGenerico },
    setup(props, ctx) {
        const mixin = new ContenedorSimpleMixin(Matricula, new MatricularController())
        const { listadosAuxiliares } = mixin.useReferencias()
        const { obtenerListados, cargarVista } = mixin.useComportamiento()
        const { notificarError, notificarAdvertencia } = useNotificaciones()
        useNotificacionStore().setQuasar(useQuasar())
        useCargandoStore().setQuasar(useQuasar())
        const cargando = new StatusEssentialLoading()
        const listado = ref([])
        const isYear = ref(false)
        const graficos = ref()

        const reporte = reactive({
            tipo: null,
            anio: '',
            accion: '',
        })


        async function buscarReporte(accion: string) {
            try {
                cargando.activar()
                const axios = AxiosHttpRepository.getInstance()
                let url = axios.getEndpoint(endpoints.matriculas) + '/reportes'
                const filename = 'reporte_ingresos_bodega'
                switch (accion) {
                    case 'excel':
                        url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.matriculas) + '/reportes'
                        reporte.accion = 'excel'
                        imprimirArchivo(url, 'POST', 'blob', 'xlsx', filename, reporte)

                        break
                    case 'pdf':
                        url = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.matriculas) + '/reportes'
                        reporte.accion = 'pdf'
                        cargando.activar()
                        imprimirArchivo(url, 'POST', 'blob', 'pdf', filename, reporte)
                        cargando.desactivar()
                        break
                    default:
                        reporte.accion = ''
                        const response: AxiosResponse = await axios.post(url, reporte)
                        if (response.data.results) {
                            listado.value = response.data.results
                            graficos.value = response.data.graficos
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


        function checkValue(val, reason, details) {
            isYear.value = reason === 'year' ? false : true
        }
        function clickGrafico(data: any, key: string) {
            // labelTabla.value = data.label
            console.log('Diste clic en grafico', data, key)
            // console.log('Ordenes para filtrar', ordenes.value)
            // switch (key) {
            //     case identificadorGrafico.creadas:
            //         ordenesPorEstado.value = filtroOrdenesComprasCreadas(data.label, ordenes)
            //         break
            //     case identificadorGrafico.aprobadas:
            //         ordenesPorEstado.value = filtroOrdenesComprasAprobadas(data.label, ordenes)
            //         break
            //     case identificadorGrafico.proveedores:
            //         ordenesPorEstado.value = filtroOrdenesComprasProveedores(data.label, ordenes)
            //         break
            //     default:
            //         console.log('Entro en default de clic grafico')
            // }
            // tabs.value = opcionesGrafico.listado
        }


        const btnVerMatricula: CustomActionTable = {
            titulo: 'Ver',
            icono: 'bi-eye',
            color: 'primary',
            accion: () => {

            }
        }
        return {
            reporte,
            listado, graficos,
            buscarReporte, clickGrafico,
            checkValue, isYear,
            configuracionColumnas: configuracionColumnasMatriculas,
            accionesTabla,
            optionsPie,
            btnVerMatricula,


        }
    },
})