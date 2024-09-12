// Dependencias
import { opcionesTipoReporteMaterialUtilizado, tiposReportesMaterialUtilizado } from 'config/tareas.utils'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent } from 'vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ReporteMaterialUtilizadoController } from '../infraestructure/ReporteMaterialUtilizadoController'
import { ProyectoController } from 'pages/gestionTrabajos/proyectos/infraestructure/ProyectoController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ReporteMaterialUtilizado } from '../domain/ReporteMaterialUtilizado'
import { imprimirArchivo } from 'shared/utils'
import { apiConfig } from 'config/api'

export default defineComponent({
    setup() {
        /***********
         * Mixin
         ************/
        const mixin = new ContenedorSimpleMixin(ReporteMaterialUtilizado, new ReporteMaterialUtilizadoController())
        const { entidad: filtro, listadosAuxiliares } = mixin.useReferencias()
        const { obtenerListados, cargarVista, setValidador, listar } = mixin.useComportamiento()

        cargarVista(async () => {
            await obtenerListados({
                proyectos: {
                    controller: new ProyectoController(),
                    params: {
                        campos: 'id,nombre,codigo_proyecto',
                    },
                },
                tareas: {
                    controller: new TareaController(),
                    params: {
                        campos: 'id,codigo_tarea,titulo,cliente_id,proyecto_id',
                    },
                },
            })
        })

        /*************
         * Funciones
         *************/
        const { tareas, filtrarTareas, proyectos, filtrarProyectos } = useFiltrosListadosSelects(listadosAuxiliares)

        async function consultarDescargar(): Promise<void> {
            const fechaActual = new Date()
            const filename = 'reporte_material_utilizado_' + fechaActual.toLocaleString()

            const controller = mixin.getController()
            const endpoint = controller.getEndpoint()
            const urlPdf = apiConfig.URL_BASE + '/' + AxiosHttpRepository.getInstance().getEndpoint(endpoint, filtro)
            imprimirArchivo(urlPdf, 'GET', 'blob', 'xlsx', filename)
        }

        /*************
         * Validaciones
         **************/
        const reglas = {
            tipo_reporte: { required },
            tarea_id: { required },
            proyecto_id: { required },
        }

        const v$ = useVuelidate(reglas, filtro)
        setValidador(v$.value)

        return {
            v$,
            filtro,
            tiposReportesMaterialUtilizado,
            opcionesTipoReporteMaterialUtilizado,
            tareas,
            filtrarTareas,
            proyectos,
            filtrarProyectos,
            consultarDescargar,
        }
    }
})