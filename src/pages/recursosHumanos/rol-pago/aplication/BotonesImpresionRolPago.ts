import { CausaIntervencion } from 'pages/gestionTrabajos/causasIntervenciones/domain/CausaIntervencion'
import { imprimirArchivo, isAxiosError, notificarMensajesError } from 'shared/utils'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { acciones, estadosRolPago } from 'config/utils'
import { RolPago } from 'pages/recursosHumanos/rol-pago/domain/RolPago'
import { Ref, reactive } from 'vue'
import { clientes } from 'config/clientes'
import { useRolPagoStore } from 'stores/rolPago'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { CambiarEstadoRolPago } from './CambiarEstadoRolPago'
import { RolPagoMes } from 'pages/recursosHumanos/rol-pago-mes/domain/RolPagoMes'

export const useBotonesImpresionTablaRolPago = (rolPago:RolPagoMes) => {
  /***********
  * Stores
  ***********/
  const authenticationStore = useAuthenticationStore()
  /************
   * Variables
   ************/

  const btnImprimir: CustomActionTable = {
    titulo: ' ',
    icono: 'bi-printer',
    color: 'primary',
    visible: ({ entidad }) =>  [estadosRolPago.EJECUTANDO,estadosRolPago.REALIZADO].includes(entidad.estado) && (authenticationStore.esRecursosHumanos),
    accion: ({ entidad }) => {
      generar_reporte(entidad)
    },
  }
  async function generar_reporte(valor: RolPago): Promise<void> {
    const axios = AxiosHttpRepository.getInstance()
    const filename = 'rol_pago'
    const url_pdf =
      apiConfig.URL_BASE +
      '/' +
      axios.getEndpoint(endpoints.imprimir_rol_pago) +
      valor.id
    imprimirArchivo(url_pdf, 'GET', 'blob', 'pdf', filename, valor)
  }

  async function generar_reporte_general(): Promise<void> {
    const axios = AxiosHttpRepository.getInstance()
    const filename = 'rol_pago'
    const url_pdf =
      apiConfig.URL_BASE +
      '/' +
      axios.getEndpoint(endpoints.imprimir_rol_pago_general) +
      rolPago.id
    imprimirArchivo(url_pdf, 'GET', 'blob', 'xlsx', filename, null)
  }
  const btnGenerarReporte: CustomActionTable = {
    titulo: 'Generar Reporte',
    icono: 'bi-file-earmark-ruled',
    color: 'primary',
    accion: () => {
      generar_reporte_general()
    },
  }

  return {
    btnImprimir,
    btnGenerarReporte
  }
}
