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
    visible: ({ entidad }) => [estadosRolPago.EJECUTANDO].includes(entidad.estado) && (authenticationStore.esRecursosHumanos || authenticationStore.esAdministrador),
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
  const btnRealizar: CustomActionTable = {
    titulo: 'Firmar Rol de Pago',
    icono: 'fa-solid fa-file-signature',
    color: 'positive',
    visible: ({ entidad }) => entidad.estado === estadosRolPago.REALIZADO && (authenticationStore.esRecursosHumanos),
    accion: ({ entidad, posicion }) => {

      confirmar('¿Tiene el rol de pagos firmado?', async () => {
        rolPagoStore.idRolPagoSeleccionada = entidad.id;
        rolPagoStore.accion= acciones.editar;
        modales.abrirModalEntidad('RolPagoFirmadoPage')

      })
    }
  }

  const btnFinalizar: CustomActionTable = {
    titulo: 'Finalizar',
    color: 'positive',
    icono: 'bi-check',
    visible: ({ entidad }) => entidad.estado === estadosRolPago.REALIZADO,
    accion: ({ entidad }) => {
      const config: CustomActionPrompt = reactive({
        mensaje: 'Confirme la causa de intervención',
        accion: (causa_intervencion_id) => {
          confirmarFinalizar({ entidad, causa_intervencion_id })
        },
        requerido: false,
        defecto: entidad.causa_intervencion_id,
        tipo: 'radio',
        items: listadosAuxiliares.causasIntervenciones.filter((causa: CausaIntervencion) => causa.tipo_trabajo === entidad.tipo_trabajo).map((causa: CausaIntervencion) => {
          return {
            label: causa.nombre,
            value: causa.id
          }
        })
      })

      if (entidad.cliente_id === clientes.NEDETEL) {
        promptItems(config)
      } else {
        confirmarFinalizar({ entidad })
      }
    }
  }

  function confirmarFinalizar(data: any) {
    const { entidad, causa_intervencion_id } = data

    confirmar('¿Está seguro de marcar como finalizada la subtarea?', async () => {
      try {

        notificarCorrecto('Trabajo finalizada exitosamente!')
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const mensajes: string[] = error.erroresValidacion
          notificarMensajesError(mensajes, notificaciones)
        }
      }
    })
  }






  return {
    btnIniciar,
    btnRealizado,
    btnRealizar,
    btnFinalizar,
  }
}
