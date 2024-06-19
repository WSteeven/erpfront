import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { CitaMedica } from '../domain/CitaMedica'
import { useAuthenticationStore } from 'stores/authentication'
import { estadosCitaMedica } from 'config/utils/medico'
import { Ref } from 'vue'
import { CambiarEstadoCitaMedica } from './CambiarEstadoCitaMedica'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'
import { acciones } from 'config/utils'
import { ComportamientoModalesCitaMedica } from '../domain/ComportamientoModalesCitaMedica'
import { useMedicoStore } from 'stores/medico'

export function useBotonesCitaMedica(listado: Ref<CitaMedica[]>, accion: Ref<string>, consultar: (params: any) => void, tabEstado: Ref<string>, modales: ComportamientoModalesCitaMedica) {
  // export function useBotonesCitaMedica(mixin: ContenedorSimpleMixin<CitaMedica>, tabEstado: Ref<string>, modales: ComportamientoModalesCitaMedica) {
  /**********
   * Stores
   **********/
  const store = useAuthenticationStore()
  const medicoStore = useMedicoStore()

  /************
   * Variables
   ************/
  const cambiarEstado = new CambiarEstadoCitaMedica()
  const { confirmar, prompt, notificarCorrecto } = useNotificaciones()
  // const { entidad: citaMedica, listado, accion } = mixin.useReferencias()
  // const { consultar } = mixin.useComportamiento()

  const btnCancelarCita: CustomActionTable<CitaMedica> = {
    titulo: 'Cancelar cita',
    icono: 'bi-x',
    color: 'negative',
    visible: ({ entidad }) => tabEstado.value === estadosCitaMedica.PENDIENTE && store.user.id === entidad.paciente_id,
    accion: async ({ entidad, posicion }) => {
      const config: CustomActionPrompt = {
        mensaje: 'Escriba el motivo de la cancelación',
        accion: (motivo: string) => {
          confirmar('¿Está seguro de cancelar la cita médica?', async () => {
            const { response } = await cambiarEstado.cancelar(entidad.id, motivo)
            notificarCorrecto(response.data.mensaje)
            eliminarElemento(posicion)
          })
        },
      }

      prompt(config)
    }
  }

  const btnRechazar: CustomActionTable<CitaMedica> = {
    titulo: 'Rechazar',
    icono: 'bi-x',
    color: 'negative',
    visible: () => tabEstado.value === estadosCitaMedica.PENDIENTE && store.can('puede.rechazar.citas_medicas'),
    accion: async ({ entidad, posicion }) => {
      const config: CustomActionPrompt = {
        mensaje: 'Escriba el motivo del rechazo',
        accion: (motivo: string) => {
          confirmar('¿Está seguro de rechazar la cita médica?', async () => {
            const { response } = await cambiarEstado.rechazar(entidad.id, motivo)
            notificarCorrecto(response.data.mensaje)
            eliminarElemento(posicion)
          })
        },
      }

      prompt(config)
    }
  }

  const btnDiagnosticoReceta: CustomActionTable<CitaMedica> = {
    titulo: 'Consulta médica',
    icono: 'bi-capsule-pill',
    color: 'blue-grey',
    visible: () => [estadosCitaMedica.AGENDADO, estadosCitaMedica.ATENDIDO].includes(tabEstado.value) && store.can('puede.crear.diagnosticos_recetas') && store.can('puede.editar.diagnosticos_recetas'),
    accion: ({ entidad }) => {
      console.log(entidad)
      medicoStore.idCita = entidad.id
      medicoStore.empleado = entidad.paciente_id
      medicoStore.tipoCitaMedica = entidad.tipo_cita_medica
      modales.abrirModalEntidad('DiagnosticoRecetaPage')
    }
  }

  const btnAgendarCita: CustomActionTable<CitaMedica> = {
    titulo: 'Agendar cita',
    icono: 'bi-pencil-square',
    color: 'positive',
    visible: () => tabEstado.value === estadosCitaMedica.PENDIENTE && ![estadosCitaMedica.CANCELADO, estadosCitaMedica.RECHAZADO].includes(tabEstado.value), // && store.esMedico,
    accion: async ({ entidad }) => {
      await consultar({ id: entidad.id })
      accion.value = acciones.editar
    }
  }

  function eliminarElemento(posicion: number): void {
    if (posicion >= 0) listado.value.splice(posicion, 1)
  }

  return {
    btnCancelarCita,
    btnRechazar,
    btnDiagnosticoReceta,
    btnAgendarCita,
  }
}
