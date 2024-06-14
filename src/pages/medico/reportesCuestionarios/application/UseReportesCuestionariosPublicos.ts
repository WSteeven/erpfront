import { RespuestaCuestionarioEmpleado } from 'pages/medico/cuestionarioPsicosocial/domain/RespuestaCuestionarioEmpleado'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { ReporteCuestionarioEmpleado } from '../domain/ReporteCuestionarioEmpleado'
import { useNotificaciones } from 'shared/notificaciones'
import { imprimirArchivo } from 'shared/utils'
import { ParamsType } from 'config/types'
import { apiConfig } from 'config/api'

export function useReportesCuestionariosPublicos(mixin: ContenedorSimpleMixin<ReporteCuestionarioEmpleado | RespuestaCuestionarioEmpleado>, filtro: ParamsType) {
    /*********
     * Mixin
     *********/
    const { cargarVista, listar } = mixin.useComportamiento()
    const { listado } = mixin.useReferencias()

    /************
     * Variables
     ************/
    const { notificarAdvertencia } = useNotificaciones()

    /************
     * Funciones
     ************/
    const consultar = async () => {
        await cargarVista(async () => {
            await listar({ anio: filtro.anio, tipo_cuestionario_id: filtro.tipo_cuestionario })
            if (!listado.value.length) notificarAdvertencia('Sin resultados')
        })
    }

    async function descagarReporte(): Promise<void> {
        const fechaActual = new Date()
        const filename = 'reporte_cuestionarios_' + filtro.tipo_cuestionario + "_" + fechaActual.toLocaleString()

        const controller = mixin.getController()
        const endpoint = controller.getEndpoint()
        const urlPdf = apiConfig.URL_BASE + '/' + AxiosHttpRepository.getInstance().getEndpoint(endpoint, { imprimir: true, formato: 'xlsx', anio: filtro.anio, tipo_cuestionario_id: filtro.tipo_cuestionario })
        imprimirArchivo(urlPdf, 'GET', 'blob', 'xlsx', filename)
    }

    async function descargarFpsico(): Promise<void> {
        const fecha_actual = new Date()
        const filename = 'respuesta_cuestionarios_' + fecha_actual.toLocaleString()

        const controller = mixin.getController()
        const endpoint = controller.getEndpoint()
        const urlPdf = apiConfig.URL_BASE + '/' + AxiosHttpRepository.getInstance().getEndpoint(endpoint, { imprimir: true, formato: 'txt', anio: filtro.anio, tipo_cuestionario_id: filtro.tipo_cuestionario })
        imprimirArchivo(urlPdf, 'GET', 'blob', 'txt', filename) //, null,'plain')
    }

    return {
        consultar,
        listado,
        descagarReporte,
        descargarFpsico,
    }
}
