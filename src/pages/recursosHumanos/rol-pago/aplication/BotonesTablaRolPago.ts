import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { acciones, estadosRolPago } from 'config/utils'
import { useRolPagoStore } from 'stores/rolPago'
import { CambiarEstadoRolPago } from './CambiarEstadoRolPago'

export const useBotonesTablaRolPago = (modales: any) => {
  /***********
  * Stores
  ***********/
  const authenticationStore = useAuthenticationStore()
  const rolPagoStore = useRolPagoStore()




  /************
   * Variables
   ************/
  const { confirmar, notificarCorrecto } = useNotificaciones()
  const btnIniciar: CustomActionTable = {
    titulo: '',
    icono: 'bi-play-fill',
    color: 'positive',
    visible: ({ entidad }) => [estadosRolPago.CREADO].includes(entidad.estado) && (authenticationStore.esRecursosHumanos || authenticationStore.esAdministrador),
    accion: ({ entidad }) => {
      confirmar('¿Está seguro de iniciar cambios rol de pago?', async () => {
        entidad.estado = estadosRolPago.EJECUTANDO
        const data = {
          estado: estadosRolPago.EJECUTANDO,
        }
         await new CambiarEstadoRolPago().ejecutar(entidad.id, data)
        notificarCorrecto('Rol de Pagos se esta ejecutando!')
      })
    }
  }
  const btnRealizado: CustomActionTable = {
    titulo: '',
    icono: 'bi-check-circle',
    color: 'positive',
    visible: ({ entidad }) => [estadosRolPago.EJECUTANDO].includes(entidad.estado) && (authenticationStore.esRecursosHumanos || authenticationStore.esAdministrador ||authenticationStore.esContabilidad),
    accion: ({ entidad }) => {
      confirmar('¿Está seguro de iniciar cambios rol de pago?', async () => {
        entidad.estado = estadosRolPago.REALIZADO
        const data = {
          estado: estadosRolPago.REALIZADO,
        }
         await new CambiarEstadoRolPago().realizar(entidad.id, data)
        notificarCorrecto('Rol de Pagos se esta Verificando!')
      })
    }
  }
  const btnFirmar: CustomActionTable = {
    titulo: '',
    icono: 'fa-solid fa-file-signature',
    color: 'positive',
    visible: ({ entidad }) => entidad.estado === estadosRolPago.EJECUTANDO && (authenticationStore.esRecursosHumanos) && !entidad.es_quincena,
    accion: ({ entidad }) => {

      confirmar('¿Tiene el rol de pagos firmado?', async () => {
        rolPagoStore.idRolPagoSeleccionada = entidad.id;
        rolPagoStore.accion= acciones.editar;
        modales.abrirModalEntidad('RolPagoFirmadoPage')
        entidad.estado = estadosRolPago.FINALIZADO
      })
    }
  }

  const btnFinalizar: CustomActionTable = {
    titulo: '',
    color: 'positive',
    icono: 'bi-check',
    visible: ({ entidad }) => entidad.estado === estadosRolPago.REALIZADO && entidad.es_quincena,
    accion: ({ entidad }) => {
      confirmar('¿Está seguro de marcar como finalizada el rol de pago?', async () => {
        entidad.estado = estadosRolPago.FINALIZADO
        const data = {
          estado: estadosRolPago.FINALIZADO,
        }
        await new CambiarEstadoRolPago().finalizar(entidad.id, data)
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
