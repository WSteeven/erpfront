import {imprimirArchivo} from 'shared/utils'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import {estadosRolPago } from 'config/utils'
import { RolPago } from 'pages/recursosHumanos/rol-pago/domain/RolPago'
import { reactive } from 'vue'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { RolPagoMes } from 'pages/recursosHumanos/rol-pago-mes/domain/RolPagoMes'

export const useBotonesImpresionTablaRolPago = (rolPago: RolPagoMes) => {
  /***********
   * Stores
   ***********/
  const authenticationStore = useAuthenticationStore()
  const { promptItems } = useNotificaciones()

  /************
   * Variables
   ************/
  const lista_tipo_reporte = [
    { id: 'pdf', name: 'PDF' },
    { id: 'xlsx', name: 'EXCEL' },
  ]
  const btnImprimir: CustomActionTable = {
    titulo: ' ',
    icono: 'bi-printer',
    color: 'primary',
    visible: ({ entidad }) =>
      [estadosRolPago.EJECUTANDO, estadosRolPago.REALIZADO].includes(
        entidad.estado
      ) && authenticationStore.esRecursosHumanos && !entidad.es_quincena,
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

  async function generar_reporte_general(tipo: string): Promise<void> {
    const axios = AxiosHttpRepository.getInstance()
    const filename = 'rol_pago'
    const url_pdf =
      apiConfig.URL_BASE +
      '/' +
      axios.getEndpoint(endpoints.imprimir_rol_pago_general) +
      rolPago.id + '?tipo=' + tipo

    imprimirArchivo(url_pdf, 'GET', 'blob', tipo, filename, null)
  }
  const btnGenerarReporte: CustomActionTable = {
    titulo: 'Generar Reporte',
    icono: 'bi-file-earmark-ruled',
    color: 'primary',
    // visible: ()=>  rolPago.finalizado!=null ? rolPago.finalizado:false,
    accion: () => {
      const config: CustomActionPrompt = reactive({
        mensaje: 'Confirme el tipo de reporte',
        accion: (tipo) => {
          generar_reporte_general(tipo)
        },
        requerido: false,
        defecto: 'EXCEL',
        tipo: 'radio',
        items: lista_tipo_reporte.map((tipo) => {
          return {
            label: tipo.name,
            value: tipo.id,
          }
        }),
      })
      promptItems(config)
      //generar_reporte_general()
    },
  }

  return {
    btnImprimir,
    btnGenerarReporte,
  }
}
// function confirmarFinalizar(arg0: {
//   entidad: any
//   causa_intervencion_id: any
// }) {
//   throw new Error('Function not implemented.')
// }
