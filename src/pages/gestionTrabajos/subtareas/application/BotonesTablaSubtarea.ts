// import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ComportamientoModalesSubtarea } from './ComportamientoModalesSubtarea'
import { CambiarEstadoSubtarea } from './CambiarEstadoSubtarea'
import { useNotificaciones } from 'shared/notificaciones'
import { useSubtareaStore } from 'stores/subtarea'
import { estadosTrabajos } from 'config/utils'
import { Subtarea } from '../domain/Subtarea'
import { Ref, reactive } from 'vue'
import { MotivoSuspendido } from 'pages/gestionTrabajos/motivosSuspendidos/domain/MotivoSuspendido'
import { ObtenerPlantilla } from 'pages/gestionTrabajos/trabajoAsignado/application/ObtenerPlantilla'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { useAuthenticationStore } from 'stores/authentication'
import { useMovilizacionSubtareaStore } from 'stores/movilizacionSubtarea'
import { SubtareaController } from '../infraestructure/SubtareaController'
import { MotivoPausa } from 'pages/gestionTrabajos/motivosPausas/domain/MotivoPausa'
import { obtenerUbicacion } from 'shared/utils'

export const useBotonesTablaSubtarea = (listado: Ref<Subtarea[]>, modales: any, listadosAuxiliares?: any) => {
  /***********
    * Stores
    ***********/
  const authenticationStore = useAuthenticationStore()
  const movilizacionSubtareaStore = useMovilizacionSubtareaStore()
  const subtareaStore = useSubtareaStore()
  const trabajoAsignadoStore = useTrabajoAsignadoStore()

  /************
   * Variables
   ************/
  const { notificarAdvertencia, confirmar, notificarCorrecto, prompt, promptItems } = useNotificaciones()
  const cambiarEstadoTrabajo = new CambiarEstadoSubtarea()
  let filtrarTrabajoAsignado: (estado: string) => void

  const setFiltrarTrabajoAsignado = (funcion: (estado: string) => void) => filtrarTrabajoAsignado = funcion

  const btnIniciar: CustomActionTable = {
    titulo: 'Ejecutar',
    icono: 'bi-play-fill',
    color: 'positive',
    visible: ({ entidad }) => [estadosTrabajos.AGENDADO].includes(entidad.estado) && entidad.puede_ejecutar && (authenticationStore.esCoordinador || entidad.es_responsable),
    accion: ({ entidad }) => {
      confirmar('¿Está seguro de iniciar el trabajo?', async () => {
        if (entidad.es_dependiente) {
          const { result: subtareaDependiente } = await new SubtareaController().consultar(entidad.subtarea_dependiente_id)
          if (subtareaDependiente.estado !== estadosTrabajos.REALIZADO) {
            notificarAdvertencia('No puedes proceder. Primero debes finalizar con el trabajo ' + subtareaDependiente.codigo_subtarea)
            return
          }
        }

        const data = reactive({
          latitud_llegada: null,
          longitud_llegada: null,
          empleado_responsable_subtarea: (authenticationStore.esTecnico ? authenticationStore.user.id : (authenticationStore.esCoordinador || authenticationStore.esJefeTecnico ? entidad.empleado_responsable : null)),
          coordinador_registrante_llegada: authenticationStore.esCoordinador || authenticationStore.esJefeTecnico ? authenticationStore.user.id : null,
        })

        obtenerUbicacion((ubicacion) => {
          data.latitud_llegada = ubicacion.coords.latitude
          data.longitud_llegada = ubicacion.coords.longitude
        })

        console.log(data)

        const { result } = await new CambiarEstadoSubtarea().ejecutar(entidad.id, data)
        entidad.estado = estadosTrabajos.EJECUTANDO
        entidad.fecha_hora_ejecucion = result.fecha_hora_ejecucion
        filtrarTrabajoAsignado(estadosTrabajos.EJECUTANDO)
        notificarCorrecto('Trabajo iniciado exitosamente!')
        movilizacionSubtareaStore.getSubtareaDestino(authenticationStore.user.id)
      })
    }
  }

  const btnPausar: CustomActionTable = {
    titulo: 'Pausar',
    icono: 'bi-pause-circle',
    color: 'blue-6',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.EJECUTANDO && (authenticationStore.esCoordinador || entidad.es_responsable),
    accion: ({ entidad, posicion }) => {
      confirmar('¿Está seguro de pausar el trabajo?', () => {
        const config: CustomActionPrompt = reactive({
          mensaje: 'Seleccione el motivo de la pausa',
          accion: async (idMotivoPausa) => {
            console.log(idMotivoPausa)
            await new CambiarEstadoSubtarea().pausar(entidad.id, idMotivoPausa)
            entidad.estado = estadosTrabajos.PAUSADO
            filtrarTrabajoAsignado(estadosTrabajos.PAUSADO)
            notificarCorrecto('Trabajo pausado exitosamente!')
            eliminarElemento(posicion, entidad)
            movilizacionSubtareaStore.getSubtareaDestino(authenticationStore.user.id)
          },
          tipo: 'radio',
          items: listadosAuxiliares.motivosPausas.map((motivo: MotivoPausa) => {
            return {
              label: motivo.motivo,
              value: motivo.id
            }
          })
        })

        promptItems(config)
      })
    },
  }

  const btnReanudar: CustomActionTable = {
    titulo: 'Reanudar',
    icono: 'bi-play-circle',
    color: 'positive',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.PAUSADO && entidad.puede_ejecutar && (authenticationStore.esCoordinador || entidad.es_responsable),
    accion: async ({ entidad, posicion }) => {
      confirmar('¿Está seguro de reanudar el trabajo?', async () => {
        await new CambiarEstadoSubtarea().reanudar(entidad.id)
        entidad.estado = estadosTrabajos.EJECUTANDO
        filtrarTrabajoAsignado(estadosTrabajos.EJECUTANDO)
        notificarCorrecto('Trabajo ha sido reanudado exitosamente!')
        movilizacionSubtareaStore.getSubtareaDestino(authenticationStore.user.id)
        // eliminarElemento(posicion, entidad)
      })
    }
  }

  const btnRealizar: CustomActionTable = {
    titulo: 'Realizado',
    icono: 'bi-check-circle',
    color: 'positive',
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.EJECUTANDO && (authenticationStore.esCoordinador || entidad.es_responsable),
    accion: ({ entidad, posicion }) => {
      confirmar('¿Está seguro de que completó el trabajo?', async () => {
        const { result } = await new CambiarEstadoSubtarea().realizar(entidad.id)
        entidad.estado = estadosTrabajos.REALIZADO
        entidad.fecha_hora_realizado = result.fecha_hora_realizado
        eliminarElemento(posicion, entidad)
        movilizacionSubtareaStore.getSubtareaDestino(authenticationStore.user.id)
        notificarCorrecto('El trabajo ha sido marcado como realizado exitosamente!')
      })
    }
  }

  const btnSeguimiento: CustomActionTable = {
    titulo: 'Seguimiento',
    icono: 'bi-check2-square',
    color: 'indigo',
    visible: ({ entidad }) => [estadosTrabajos.EJECUTANDO].includes(entidad.estado) && (authenticationStore.esCoordinador || entidad.es_responsable),
    accion: async ({ entidad }) => {
      confirmar('¿Está seguro de abrir el formulario de seguimiento?', () => {
        trabajoAsignadoStore.idSubtareaSeleccionada = entidad.id
        trabajoAsignadoStore.idTareaSeleccionada = entidad.tarea_id
        trabajoAsignadoStore.idEmpleadoResponsable = entidad.empleado_responsable
        trabajoAsignadoStore.idEmergencia = entidad.seguimiento
        trabajoAsignadoStore.codigoSubtarea = entidad.codigo_subtarea
        const obtenerPlantilla = new ObtenerPlantilla()
        modales.abrirModalEntidad(obtenerPlantilla.obtener(entidad.tipo_trabajo))
      })
    }
  }

  const botonFormulario: CustomActionTable = {
    titulo: 'Seguimiento',
    icono: 'bi-check2-square',
    color: 'indigo',
    visible: ({ entidad }) => [estadosTrabajos.EJECUTANDO, estadosTrabajos.REALIZADO, estadosTrabajos.PAUSADO, estadosTrabajos.FINALIZADO].includes(entidad.estado),
    accion: ({ entidad }) => {
      if (entidad.seguimiento === null) {
        return notificarAdvertencia('Espere a que el técnico responsable inicie el seguimiento.')
      }
      // subtareaStore.idSubtareaSeleccionada = entidad.id
      // modales.abrirModalEntidad('EmergenciasPage')
      trabajoAsignadoStore.idSubtareaSeleccionada = entidad.id
      trabajoAsignadoStore.idTareaSeleccionada = entidad.tarea_id
      trabajoAsignadoStore.idEmpleadoResponsable = entidad.empleado_responsable
      trabajoAsignadoStore.idEmergencia = entidad.seguimiento
      trabajoAsignadoStore.codigoSubtarea = entidad.codigo_subtarea
      const obtenerPlantilla = new ObtenerPlantilla()
      modales.abrirModalEntidad(obtenerPlantilla.obtener(entidad.tipo_trabajo))
      console.log(obtenerPlantilla.obtener(entidad.tipo_trabajo))
    }
  }

  const botonFinalizar: CustomActionTable = {
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
    visible: ({ entidad }) => [estadosTrabajos.AGENDADO, estadosTrabajos.SUSPENDIDO].includes(entidad.estado),
    accion: async ({ entidad, posicion }) => confirmar('¿Está seguro de reagendar la subtarea?', () => {
      subtareaStore.codigoSubtareaSeleccionada = entidad.codigo_subtarea
      subtareaStore.fechaHoraSuspendido = entidad.fecha_hora_suspendido
      subtareaStore.motivoSuspendido = entidad.motivo_suspendido
      subtareaStore.idSubtareaSeleccionada = entidad.id
      subtareaStore.tareaTieneSubtareas = entidad.tiene_subtareas
      subtareaStore.posicionSubtareaSeleccionada = posicion
      subtareaStore.subtareaEsVentana = entidad.es_ventana
      subtareaStore.fechaInicioTrabajo = entidad.fecha_inicio_trabajo
      subtareaStore.horaInicioTrabajo = entidad.hora_inicio_trabajo
      subtareaStore.horaFinTrabajo = entidad.hora_fin_trabajo
      modales.abrirModalEntidad('ReagendarPage')
    }),
  }

  function actualizarElemento(posicion: number, entidad: Subtarea): void {
    if (posicion >= 0) {
      listado.value.splice(posicion, 1, entidad)
      listado.value = [...listado.value]
    }
  }

  function eliminarElemento(posicion: number, entidad: any): void {
    if (posicion >= 0) {
      listado.value.splice(posicion, 1)
    }
  }

  return {
    btnIniciar,
    btnPausar,
    btnReanudar,
    btnRealizar,
    btnSeguimiento,
    botonFormulario,
    botonCancelar,
    botonReagendar,
    btnAnular,
    botonFinalizar,
    setFiltrarTrabajoAsignado,
  }
}
