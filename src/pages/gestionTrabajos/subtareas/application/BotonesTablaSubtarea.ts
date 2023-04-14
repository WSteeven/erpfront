import { ObtenerPlantilla } from 'pages/gestionTrabajos/trabajoAsignado/application/ObtenerPlantilla'
import { MotivoSuspendido } from 'pages/gestionTrabajos/motivosSuspendidos/domain/MotivoSuspendido'
import { MotivoPausa } from 'pages/gestionTrabajos/motivosPausas/domain/MotivoPausa'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useMovilizacionSubtareaStore } from 'stores/movilizacionSubtarea'
import { SubtareaController } from '../infraestructure/SubtareaController'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { CambiarEstadoSubtarea } from './CambiarEstadoSubtarea'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { useSubtareaStore } from 'stores/subtarea'
import { obtenerUbicacion } from 'shared/utils'
import { estadosTrabajos } from 'config/utils'
import { Subtarea } from '../domain/Subtarea'
import { Ref, reactive } from 'vue'

export const useBotonesTablaSubtarea = (listado: Ref<Subtarea[]>, modales: any, listadosAuxiliares?: any) => {
  /***********
  * Stores
  ***********/
  const movilizacionSubtareaStore = useMovilizacionSubtareaStore()
  const trabajoAsignadoStore = useTrabajoAsignadoStore()
  const authenticationStore = useAuthenticationStore()
  const subtareaStore = useSubtareaStore()

  /************
   * Variables
   ************/
  const { notificarAdvertencia, confirmar, notificarCorrecto, prompt, promptItems } = useNotificaciones()
  const cambiarEstadoTrabajo = new CambiarEstadoSubtarea()
  let filtrarTrabajoAsignado: (estado: string) => void

  const movilizacion = reactive({
    latitud_llegada: null,
    longitud_llegada: null,
    empleado_responsable_subtarea: null,
    coordinador_registrante_llegada: null,
  })

  const btnIniciar: CustomActionTable = {
    titulo: 'Ejecutar',
    icono: 'bi-play-fill',
    color: 'positive',
    visible: ({ entidad }) => [estadosTrabajos.AGENDADO].includes(entidad.estado) && entidad.puede_ejecutar && (authenticationStore.esJefeTecnico || authenticationStore.esCoordinador || entidad.es_responsable),
    accion: ({ entidad }) => {

      obtenerCoordenadas(entidad)

      confirmar('¿Está seguro de iniciar el trabajo?', async () => {
        if (entidad.es_dependiente) {
          const { result: subtareaDependiente } = await new SubtareaController().consultar(entidad.subtarea_dependiente_id)
          if (subtareaDependiente.estado !== estadosTrabajos.REALIZADO) {
            return notificarAdvertencia('No puedes proceder. Primero debes finalizar con el trabajo ' + subtareaDependiente.codigo_subtarea)
          }
        }

        const data = {
          estado_subtarea_llegada: estadosTrabajos.EJECUTANDO,
          ...movilizacion
        }

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
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.EJECUTANDO && (authenticationStore.esJefeTecnico || authenticationStore.esCoordinador || entidad.es_responsable),
    accion: ({ entidad, posicion }) => {

      obtenerCoordenadas(entidad)

      confirmar('¿Está seguro de pausar la subtarea?', () => {
        const config: CustomActionPrompt = reactive({
          mensaje: 'Seleccione el motivo de la pausa',
          accion: async (idMotivoPausa) => {

            const data = {
              estado_subtarea_llegada: estadosTrabajos.PAUSADO,
              motivo_pausa_id: idMotivoPausa,
              ...movilizacion
            }

            await new CambiarEstadoSubtarea().pausar(entidad.id, data)
            entidad.estado = estadosTrabajos.PAUSADO
            filtrarTrabajoAsignado(estadosTrabajos.PAUSADO)
            notificarCorrecto('Trabajo pausado exitosamente!')
            eliminarElemento(posicion)
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
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.PAUSADO && entidad.puede_ejecutar && (authenticationStore.esJefeTecnico || authenticationStore.esCoordinador || entidad.es_responsable),
    accion: async ({ entidad, posicion }) => {

      obtenerCoordenadas(entidad)

      confirmar('¿Está seguro de reanudar el trabajo?', async () => {
        const data = {
          estado_subtarea_llegada: estadosTrabajos.EJECUTANDO,
          ...movilizacion
        }

        await new CambiarEstadoSubtarea().reanudar(entidad.id, data)
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
    visible: ({ entidad }) => entidad.estado === estadosTrabajos.EJECUTANDO && (authenticationStore.esJefeTecnico || authenticationStore.esCoordinador || entidad.es_responsable),
    accion: ({ entidad, posicion }) => {
      obtenerCoordenadas(entidad)

      confirmar('¿Está seguro de que completó el trabajo?', async () => {
        const data = {
          estado_subtarea_llegada: estadosTrabajos.REALIZADO,
          ...movilizacion
        }

        const { result } = await new CambiarEstadoSubtarea().realizar(entidad.id, data)
        entidad.estado = estadosTrabajos.REALIZADO
        entidad.fecha_hora_realizado = result.fecha_hora_realizado
        eliminarElemento(posicion)
        movilizacionSubtareaStore.getSubtareaDestino(authenticationStore.user.id)
        notificarCorrecto('El trabajo ha sido marcado como realizado exitosamente!')
      })
    }
  }

  const btnSeguimiento: CustomActionTable = {
    titulo: 'Seguimiento',
    icono: 'bi-check2-square',
    color: 'indigo',
    visible: ({ entidad }) => ![estadosTrabajos.AGENDADO, estadosTrabajos.CREADO].includes(entidad.estado) && (authenticationStore.esJefeTecnico || authenticationStore.esCoordinador || entidad.es_responsable),
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

  const btnSuspender: CustomActionTable = {
    titulo: 'Suspender',
    icono: 'bi-power',
    color: 'negative',
    visible: ({ entidad }) => [estadosTrabajos.EJECUTANDO, estadosTrabajos.AGENDADO].includes(entidad.estado) && entidad.puede_suspender && (authenticationStore.esJefeTecnico || authenticationStore.esCoordinador || entidad.es_responsable),
    accion: ({ entidad, posicion }) => {

      obtenerCoordenadas(entidad)

      confirmar('¿Está seguro de suspender el trabajo?', () => {
        const config: CustomActionPrompt = {
          mensaje: 'Seleccione el motivo de la suspención del trabajo',
          accion: async (idMotivoSuspendido) => {
            const data = {
              motivo_suspendido_id: idMotivoSuspendido,
              estado_subtarea_llegada: estadosTrabajos.SUSPENDIDO,
              ...movilizacion
            }

            await new CambiarEstadoSubtarea().suspender(entidad.id, data)
            // entidad.estado = estadosTrabajos.SUSPENDIDO
            // entidad.fecha_hora_suspendido = result.fecha_hora_suspendido

            if (authenticationStore.esCoordinador) filtrarTrabajoAsignado(estadosTrabajos.SUSPENDIDO)
            if (authenticationStore.esTecnico) eliminarElemento(posicion)

            notificarCorrecto('Trabajo suspendido exitosamente!')
            movilizacionSubtareaStore.getSubtareaDestino(authenticationStore.user.id)
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
      })
    },
  }

  const btnCancelar: CustomActionTable = {
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

  const btnReagendar: CustomActionTable = {
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

  /************
   * Funciones
   ************/
  function obtenerCoordenadas(entidad) {
    obtenerUbicacion((ubicacion) => {
      movilizacion.latitud_llegada = ubicacion.coords.latitude
      movilizacion.longitud_llegada = ubicacion.coords.longitude
      movilizacion.empleado_responsable_subtarea = (authenticationStore.esTecnico ? authenticationStore.user.id : (authenticationStore.esCoordinador || authenticationStore.esJefeTecnico ? entidad.empleado_responsable : null))
      movilizacion.coordinador_registrante_llegada = authenticationStore.esCoordinador || authenticationStore.esJefeTecnico ? authenticationStore.user.id : null
    })
  }

  const setFiltrarTrabajoAsignado = (funcion: (estado: string) => void) => filtrarTrabajoAsignado = funcion

  function actualizarElemento(posicion: number, entidad: Subtarea): void {
    if (posicion >= 0) {
      listado.value.splice(posicion, 1, entidad)
      listado.value = [...listado.value]
    }
  }

  function eliminarElemento(posicion: number): void {
    if (posicion >= 0) {
      listado.value.splice(posicion, 1)
    }
  }

  return {
    // movilizacion,
    btnIniciar,
    btnPausar,
    btnReanudar,
    btnRealizar,
    btnSeguimiento,
    // btnFormulario,
    btnCancelar,
    btnReagendar,
    btnSuspender,
    btnFinalizar,
    setFiltrarTrabajoAsignado,
  }
}
