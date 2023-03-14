// import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ComportamientoModalesSubtarea } from '../../subtareas/application/ComportamientoModalesSubtarea'
import { CambiarEstadoSubtarea } from '../../subtareas/application/CambiarEstadoSubtarea'
import { useNotificaciones } from 'shared/notificaciones'
import { useSubtareaStore } from 'stores/subtarea'
import { estadosTrabajos } from 'config/utils'
import { Subtarea } from '../../subtareas/domain/Subtarea'
import { Ref } from 'vue'
import { MotivoSuspendido } from 'pages/gestionTrabajos/motivosSuspendidos/domain/MotivoSuspendido'
import { Tarea } from '../domain/Tarea'

export const useBotonesTablaTarea = (listado: Ref<Tarea[]>, modales: ComportamientoModalesSubtarea, listadosAuxiliares: any) => {
  const subtareaStore = useSubtareaStore()

  const { confirmar, notificarCorrecto, prompt, promptItems } = useNotificaciones()
  const cambiarEstadoTrabajo = new CambiarEstadoSubtarea()

  // const cargando = new StatusEssentialLoading()

  const botonFormulario: CustomActionTable = {
    titulo: 'Formulario',
    icono: 'bi-check2-square',
    color: 'indigo',
    visible: ({ entidad }) => [estadosTrabajos.EJECUTANDO, estadosTrabajos.REALIZADO, estadosTrabajos.PAUSADO, estadosTrabajos.FINALIZADO].includes(entidad.estado),
    accion: ({ entidad }) => {
      subtareaStore.idSubtareaSeleccionada = entidad.id
      modales.abrirModalEntidad('EmergenciasPage')
    }
  }

  const btnVerPausas: CustomActionTable = {
    titulo: 'Ver pausas',
    icono: 'bi-pause-circle',
    color: 'blue-6',
    visible: ({ entidad }) => true,//entidad.estado !== estadosTrabajos.CREADO,
    accion: ({ entidad }) => {
      subtareaStore.idSubtareaSeleccionada = entidad.id
      subtareaStore.codigoTrabajoSeleccionado = entidad.codigo_subtarea
      modales.abrirModalEntidad('PausasRealizadasPage')
    }
  }

  const btnFinalizar: CustomActionTable = {
    titulo: 'Finalizar',
    color: 'positive',
    icono: 'bi-check',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.REALIZADO,
    accion: ({ entidad, posicion }) => confirmar('¿Está seguro de marcar como finalizada la subtarea?', async () => {
      const { result } = await cambiarEstadoTrabajo.finalizar(entidad.id)
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
        const { result } = await cambiarEstadoTrabajo.asignar(entidad.id)
        entidad.estado = estadosTrabajos.ASIGNADO
        entidad.fecha_hora_asignacion = result.fecha_hora_asignacion
        actualizarElemento(posicion, entidad)
        cargando.desactivar()
        notificarCorrecto('Trabajo asignada exitosamente!')
      })
    },
  } */

  const botonCancelar: CustomActionTable = {
    titulo: 'Cancelar',
    color: 'negative',
    icono: 'bi-x-circle',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.SUSPENDIDO,
    accion: ({ entidad, posicion }) => confirmar(['¿Está seguro de cancelar definitivamente la subtarea?'], async () => {
      const config: CustomActionPrompt = {
        mensaje: 'Seleccione el motivo de la cancelación',
        accion: async (data) => {
          const { result } = await cambiarEstadoTrabajo.cancelar(entidad.id, data)
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
    accion: ({ entidad, posicion }) => confirmar(['¿Está seguro de anular la subtarea?'], async () => {
      const config: CustomActionPrompt = {
        mensaje: 'Ingrese el motivo de la cancelación',
        accion: async (data) => {
          const { result } = await cambiarEstadoTrabajo.cancelar(entidad.id, data)
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

  const botonReagendar: CustomActionTable = {
    titulo: 'Reagendar',
    color: 'orange-8',
    icono: 'bi-calendar-check',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.PENDIENTE,
    accion: async ({ entidad, posicion }) => confirmar('¿Está seguro de reagendar la subtarea?', () => {
      subtareaStore.codigoTrabajoSeleccionado = entidad.codigo_subtarea
      subtareaStore.fechaHoraPendiente = entidad.fecha_hora_pendiente
      subtareaStore.motivoPendiente = entidad.motivo_pendiente
      subtareaStore.idSubtareaSeleccionada = entidad.id
      subtareaStore.posicionSubtareaSeleccionada = posicion
      subtareaStore.subtareaEsVentana = entidad.es_ventana
      subtareaStore.fechaInicioTrabajo = entidad.fecha_inicio_trabajo
      subtareaStore.horaInicioTrabajo = entidad.hora_inicio_trabajo
      subtareaStore.horaFinTrabajo = entidad.hora_fin_trabajo
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
      subtareaStore.codigoTrabajoSeleccionado = entidad.codigo_subtarea
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
    botonFormulario,
    // botonSubirArchivos,
    botonCancelar,
    botonReagendar,
    btnAnular,
    // botonAsignar,
    btnFinalizar,
    btnVerPausas,
  }
}
