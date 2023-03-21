// import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
// import { ComportamientoModalesSubtarea } from '../../subtareas/application/ComportamientoModalesSubtarea'
import { CambiarEstadoSubtarea } from '../../subtareas/application/CambiarEstadoSubtarea'
import { useNotificaciones } from 'shared/notificaciones'
import { useSubtareaStore } from 'stores/subtarea'
import { estadosTrabajos } from 'config/utils'
// import { Subtarea } from '../../subtareas/domain/Subtarea'
import { Ref } from 'vue'
import { MotivoSuspendido } from 'pages/gestionTrabajos/motivosSuspendidos/domain/MotivoSuspendido'
import { Tarea } from '../domain/Tarea'
import { ComportamientoModalesTarea } from './ComportamientoModalesTarea'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosError, AxiosResponse } from 'axios'
import { ApiError } from 'shared/error/domain/ApiError'

export const useBotonesTablaTarea = (listado: Ref<Tarea[]>, modales: ComportamientoModalesTarea, listadosAuxiliares: any) => {
  const subtareaStore = useSubtareaStore()

  const { confirmar, notificarCorrecto, prompt, promptItems } = useNotificaciones()
  const cambiarEstadoSubtarea = new CambiarEstadoSubtarea()

  // const cargando = new StatusEssentialLoading()

  const btnFormulario: CustomActionTable = {
    titulo: 'Formulario',
    icono: 'bi-pencil-square',
    color: 'indigo',
    visible: ({ entidad }) => !entidad.tiene_subtareas && [estadosTrabajos.EJECUTANDO, estadosTrabajos.REALIZADO, estadosTrabajos.PAUSADO, estadosTrabajos.FINALIZADO].includes(entidad.estado),
    accion: ({ entidad }) => {
      subtareaStore.idSubtareaSeleccionada = entidad.id
      modales.abrirModalEntidad('EmergenciasPage')
    }
  }

  const btnVerPausas: CustomActionTable = {
    titulo: 'Ver pausas',
    icono: 'bi-pause-circle',
    color: 'blue-6',
    visible: ({ entidad }) => !entidad.tiene_subtareas,//entidad.estado !== estadosTrabajos.CREADO,
    accion: ({ entidad }) => {
      subtareaStore.idSubtareaSeleccionada = entidad.subtarea.id
      subtareaStore.codigoTareaSeleccionada = entidad.codigo_tarea
      subtareaStore.tareaTieneSubtareas = entidad.tiene_subtareas
      modales.abrirModalEntidad('PausasRealizadasPage')
    }
  }

  const btnFinalizar: CustomActionTable = {
    titulo: 'Finalizar',
    color: 'positive',
    icono: 'bi-check-circle',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.REALIZADO,
    accion: ({ entidad, posicion }) => confirmar('¿Está seguro de marcar como finalizada la subtarea?', async () => {
      const { result } = await cambiarEstadoSubtarea.finalizar(entidad.id)
      entidad.estado = estadosTrabajos.FINALIZADO
      entidad.fecha_hora_finalizacion = result.fecha_hora_finalizacion
      entidad.dias_ocupados = result.dias_ocupados
      actualizarElemento(posicion, entidad)
      notificarCorrecto('Trabajo finalizada exitosamente!')
    }),
  }

  // x - Se va porque las subtareas se guardan y se asignan en el mismo paso
  /* const botonAsignar: CustomActionTable = {
    titulo: 'Asignar',
    color: 'indigo',
    icono: 'bi-person-fill-check',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.CREADO,
    accion: ({ entidad, posicion }) => {
      confirmar('¿Está seguro de asignar el trabajo?', async () => {
        cargando.activar();
        const { result } = await cambiarEstadoSubtarea.asignar(entidad.id)
        entidad.estado = estadosTrabajos.ASIGNADO
        entidad.fecha_hora_asignacion = result.fecha_hora_asignacion
        actualizarElemento(posicion, entidad)
        cargando.desactivar()
        notificarCorrecto('Trabajo asignada exitosamente!')
      })
    },
  } */
  async function solicitud(accion, tarea, data?) {
    const cargando = new StatusEssentialLoading()
    const axios = AxiosHttpRepository.getInstance()

    try {
      const ruta =
        axios.getEndpoint(endpoints.tareas) + accion + '/' + tarea

      cargando.activar()
      const response: AxiosResponse = await axios.post(ruta, data)

      return {
        response,
        result: response.data.modelo,
      }
    } catch (e: unknown) {
      const axiosError = e as AxiosError
      throw new ApiError(axiosError)
    } finally {
      cargando.desactivar()
    }
  }

  async function cancelar(idTarea: number, idMotivoCancelado: number) {
    return solicitud('/cancelar', idTarea, { motivo_suspendido_id: idMotivoCancelado }) // Correcto: es motivo_suspendido_id
  }

  const botonCancelar: CustomActionTable = {
    titulo: 'Cancelar',
    color: 'negative',
    icono: 'bi-x-circle',
    visible: ({ entidad }) => !entidad.tiene_subtareas && entidad.estado === estadosTrabajos.SUSPENDIDO,
    accion: ({ entidad, posicion }) => confirmar(['¿Está seguro de cancelar definitivamente la tarea?'], async () => {
      const config: CustomActionPrompt = {
        mensaje: 'Seleccione el motivo de la cancelación',
        accion: async (data) => {
          const { result } = await cancelar(entidad.id, data) //cambiarEstadoSubtarea.cancelar(entidad.id, data)
          entidad.estado = estadosTrabajos.CANCELADO
          entidad.fecha_hora_cancelado = result.fecha_hora_cancelado
          entidad.motivo_cancelado = result.motivo_cancelado
          notificarCorrecto('Trabajo cancelado exitosamente!')
          actualizarElemento(posicion, entidad)
        },
        tipo: 'radio',
        items: listadosAuxiliares.motivosSuspendidos.map((motivo: MotivoSuspendido) => {
          return {
            label: motivo.motivo,
            value: motivo.id
          }
        })
      }

      promptItems(config)
    }),
  }

  const btnAnular: CustomActionTable = {
    titulo: 'Anular',
    color: 'negative',
    icono: 'bi-x',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.AGENDADO,
    accion: ({ entidad, posicion }) => confirmar(['¿Está seguro de anular la tarea?'], async () => {
      const config: CustomActionPrompt = {
        mensaje: 'Ingrese el motivo de la cancelación',
        accion: async (data) => {
          const { result } = await cambiarEstadoSubtarea.cancelar(entidad.id, data)
          entidad.estado = estadosTrabajos.CANCELADO
          entidad.fecha_hora_cancelacion = result.fecha_hora_cancelacion
          entidad.causa_cancelacion = result.causa_cancelacion
          notificarCorrecto('Trabajo cancelado exitosamente!')
          actualizarElemento(posicion, entidad)
        }
      }

      prompt(config)
    }),
  }

  const btnReagendar: CustomActionTable = {
    titulo: 'Reagendar',
    color: 'orange-8',
    icono: 'bi-calendar-check',
    visible: ({ entidad }) => !entidad.tiene_subtareas && entidad.estado === estadosTrabajos.SUSPENDIDO,
    accion: async ({ entidad, posicion }) => confirmar('¿Está seguro de reagendar la tarea?', () => {
      subtareaStore.codigoSubtareaSeleccionada = entidad.codigo_tarea
      subtareaStore.fechaHoraPendiente = entidad.subtarea.fecha_hora_suspendido
      subtareaStore.motivoPendiente = entidad.subtarea.motivo_suspendido
      subtareaStore.idSubtareaSeleccionada = entidad.id
      subtareaStore.tareaTieneSubtareas = entidad.tiene_subtareas
      subtareaStore.posicionSubtareaSeleccionada = posicion
      subtareaStore.subtareaEsVentana = entidad.subtarea.es_ventana
      subtareaStore.fechaInicioTrabajo = entidad.subtarea.fecha_inicio_trabajo
      subtareaStore.horaInicioTrabajo = entidad.subtarea.hora_inicio_trabajo
      subtareaStore.horaFinTrabajo = entidad.subtarea.hora_fin_trabajo
      modales.abrirModalEntidad('ReagendarPage')
    }),
  }



  /* const botonSubirArchivos: CustomActionTable = {
    titulo: 'Archivos',
    color: 'yellow-9',
    icono: 'bi-folder-fill',
    visible: () => true,
    accion: async ({ entidad }) => {
      subtareaStore.idSubtareaSeleccionada = entidad.id
      subtareaStore.codigoSubtareaSeleccionada = entidad.codigo_subtarea
      modales.abrirModalEntidad('GestorArchivoTrabajo')
    }
  } */

  function actualizarElemento(posicion: number, entidad: Tarea): void {
    if (posicion >= 0) {
      listado.value.splice(posicion, 1, entidad)
      listado.value = [...listado.value]
    }
  }

  return {
    btnFormulario,
    // botonSubirArchivos,
    botonCancelar,
    btnReagendar,
    btnAnular,
    // botonAsignar,
    btnFinalizar,
    btnVerPausas,
  }
}
