import { CausaIntervencion } from 'pages/gestionTrabajos/causasIntervenciones/domain/CausaIntervencion'
import { MotivoSuspendido } from 'pages/gestionTrabajos/motivosSuspendidos/domain/MotivoSuspendido'
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

export const useBotonesTablaRolPago = (listado: Ref<RolPago[]>, modales: any, listadosAuxiliares?: any) => {
  /***********
  * Stores
  ***********/
  const authenticationStore = useAuthenticationStore()
  const rolPagoStore = useRolPagoStore()
  const store = useAuthenticationStore()


  const esRecursosHumanos = store.esRecursosHumanos


  /************
   * Variables
   ************/
  const { notificarAdvertencia, confirmar, notificarCorrecto, prompt, promptItems } = useNotificaciones()
  const notificaciones = useNotificaciones()
  const btnIniciar: CustomActionTable = {
    titulo: 'Ejecutar',
    icono: 'bi-play-fill',
    color: 'positive',
    visible: ({ entidad }) => [estadosRolPago.CREADO].includes(entidad.estado) && (authenticationStore.esRecursosHumanos || authenticationStore.esAdministrador),
    accion: ({ entidad }) => {
      confirmar('¿Está seguro de iniciar cambios rol de pago?', async () => {
        entidad.estado = estadosRolPago.EJECUTANDO
        const data = {
          estado: estadosRolPago.EJECUTANDO,
        }
        const { result } = await new CambiarEstadoRolPago().ejecutar(entidad.id, data)
        notificarCorrecto('Rol de Pagos se esta Verificando!')
      })
    }
  }
  const btnRealizado: CustomActionTable = {
    titulo: 'Realizar',
    icono: 'bi-check-circle',
    color: 'positive',
    visible: ({ entidad }) => [estadosRolPago.EJECUTANDO].includes(entidad.estado) && (authenticationStore.esRecursosHumanos || authenticationStore.esAdministrador ||authenticationStore.esContabilidad),
    accion: ({ entidad }) => {
      confirmar('¿Está seguro de iniciar cambios rol de pago?', async () => {
        entidad.estado = estadosRolPago.REALIZADO
        const data = {
          estado: estadosRolPago.REALIZADO,
        }
        const { result } = await new CambiarEstadoRolPago().realizar(entidad.id, data)
        notificarCorrecto('Rol de Pagos se esta Verificando!')
      })
    }
  }
  const btnFirmar: CustomActionTable = {
    titulo: 'Firmar Rol de Pago',
    icono: 'fa-solid fa-file-signature',
    color: 'positive',
    visible: ({ entidad }) => entidad.estado === estadosRolPago.REALIZADO && (authenticationStore.esRecursosHumanos) && !entidad.es_quincena,
    accion: ({ entidad, posicion }) => {

      confirmar('¿Tiene el rol de pagos firmado?', async () => {
        rolPagoStore.idRolPagoSeleccionada = entidad.id;
        rolPagoStore.accion= acciones.editar;
        modales.abrirModalEntidad('RolPagoFirmadoPage')
        entidad.estado = estadosRolPago.FINALIZADO
      })
    }
  }

  const btnFinalizar: CustomActionTable = {
    titulo: 'Finalizar',
    color: 'positive',
    icono: 'bi-check',
    visible: ({ entidad }) => entidad.estado === estadosRolPago.REALIZADO && entidad.es_quincena,
    accion: ({ entidad }) => {
      confirmar('¿Está seguro de marcar como finalizada el rol de pago?', async () => {
        entidad.estado = estadosRolPago.FINALIZADO
        const data = {
          estado: estadosRolPago.FINALIZADO,
        }
        const { result } = await new CambiarEstadoRolPago().finalizar(entidad.id, data)
        notificarCorrecto('Rol finalizado exitosamente!')
      })
    }
  }
  return {
    btnIniciar,
    btnRealizado,
    btnFirmar,
    btnFinalizar,
  }
}
