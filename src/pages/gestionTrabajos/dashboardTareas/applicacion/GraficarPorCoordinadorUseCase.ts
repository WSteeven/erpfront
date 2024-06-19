import { DashboardTareaController } from '../infraestructure/DashboardTareaController'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { FiltroDashboardTicket } from '../domain/FiltroReporteMaterial'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { Ref, UnwrapRef, computed, reactive, ref } from 'vue'
import { generarColorAzulPastelClaro } from 'shared/utils'
import { useNotificaciones } from 'shared/notificaciones'
import { acciones, estadosTrabajos } from 'config/utils'
import { useSubtareaStore } from 'stores/subtarea'
import { GraficoConfig } from 'components/chartJS/domain/GraficoConfig'


export function graficarPorCoordinadorUseCase(dashboardTareaController: DashboardTareaController, filtro: UnwrapRef<FiltroDashboardTicket>, modalesSubtarea) {
  // Stores
  const subtareaStore = useSubtareaStore()
  const trabajoAsignadoStore = useTrabajoAsignadoStore()

  const { promptItems } = useNotificaciones()

  // Cantidades
  const mostrarCantidades = ref(false)
  const subtareas: Ref<Subtarea[]> = ref([])
  const subtareasGrupo: Ref<Subtarea[]> = ref([])
  const subtareasEmpleado: Ref<Subtarea[]> = ref([])
  const subtareasSubordinados: Ref<Subtarea[]> = ref([])
  const subtareasEmpleadoSubordinado: Ref<Subtarea[]> = ref([])

  const cantidadTareasActivas = ref()
  const cantidadTareasFinalizadas = ref()
  const cantidadSubtareasAgendadas = ref()
  const cantidadSubtareasEjecutadas = ref()
  const cantidadSubtareasPausadas = ref()
  const cantidadSubtareasSuspendidas = ref()
  const cantidadSubtareasCanceladas = ref()
  const cantidadSubtareasRealizadas = ref()
  const cantidadSubtareasFinalizadas = ref()

  const totalSubtareas = computed(() => {
    return cantidadSubtareasAgendadas.value
      + cantidadSubtareasEjecutadas.value
      + cantidadSubtareasPausadas.value
      + cantidadSubtareasSuspendidas.value
      + cantidadSubtareasCanceladas.value
      + cantidadSubtareasRealizadas.value
      + cantidadSubtareasFinalizadas.value
  })

  const cantidadesPorEstadosSubtareas = ref([])
  const cantidadesPorEstadosSubtareasBar = ref()

  // Por grupo
  const agendados: Ref<any> = ref([])
  const ejecutados: Ref<any> = ref([])
  const pausados: Ref<any> = ref([])
  const suspendidos: Ref<any> = ref([])
  const cancelados: Ref<any> = ref([])
  const realizados: Ref<any> = ref([])
  const finalizados: Ref<any> = ref([])

  const agendadosBar = ref()
  const ejecutadosBar = ref()
  const pausadosBar = ref()
  const suspendidosBar = ref()
  const canceladosBar = ref()
  const realizadosBar = ref()
  const finalizadosBar = ref()

  // Por empleado
  const agendadosEmpleado: Ref<any> = ref([])
  const ejecutadosEmpleado: Ref<any> = ref([])
  const pausadosEmpleado: Ref<any> = ref([])
  const suspendidosEmpleado: Ref<any> = ref([])
  const canceladosEmpleado: Ref<any> = ref([])
  const realizadosEmpleado: Ref<any> = ref([])
  const finalizadosEmpleado: Ref<any> = ref([])

  // Lineas de tiempo
  const graficoLineaTiempoSubtareasFinalizadasCoordinador = ref()
  const graficoLineaTiempoSubtareasRealizadasCoordinador = ref()

  const lineasTiempo = {
    lineaTiempoSubtareasFinalizadasCoordinador: [],
    lineaTiempoSubtareasRealizadasCoordinador: [],
  }

  const graficosCoordinadorSubordinadosPorGrupo: Ref<GraficoConfig[]> = ref([])
  const graficosCoordinadorSubordinadosPorCoordinador: Ref<GraficoConfig[]> = ref([])

  async function consultarDashboardCoordinador() {
    const campos = 'id,codigo_tarea,tarea_id,codigo_subtarea,titulo,estado,grupo,empleado_responsable,empleado_responsable_id,coordinador,tipo_trabajo,cantidad_adjuntos,fecha_solicitud,es_ventana,fecha_hora_creacion,fecha_inicio_trabajo,hora_inicio_trabajo,hora_fin_trabajo,fecha_hora_asignacion,fecha_hora_agendado,fecha_hora_ejecucion,fecha_hora_realizado,fecha_hora_finalizacion,dias_ocupados,fecha_hora_suspendido,motivo_suspendido,fecha_hora_cancelado,motivo_cancelado,subtarea_dependiente,canton,cliente,proyecto'
    const { result } = await dashboardTareaController.listar({ fecha_inicio: filtro.fecha_inicio, fecha_fin: filtro.fecha_fin, empleado_id: filtro.empleado, campos })

    // Listados consulta por empleado coordinador
    subtareas.value = result.subtareasCoordinador
    subtareasGrupo.value = result.subtareasGrupo
    subtareasEmpleado.value = result.subtareasEmpleado

    // Cantidades del coordinador consultado
    cantidadTareasActivas.value = result.cantidadTareasActivas
    cantidadTareasFinalizadas.value = result.cantidadTareasFinalizadas
    cantidadSubtareasAgendadas.value = result.cantidadSubtareasAgendadas
    cantidadSubtareasEjecutadas.value = result.cantidadSubtareasEjecutadas
    cantidadSubtareasPausadas.value = result.cantidadSubtareasPausadas
    cantidadSubtareasSuspendidas.value = result.cantidadSubtareasSuspendidas
    cantidadSubtareasCanceladas.value = result.cantidadSubtareasCanceladas
    cantidadSubtareasRealizadas.value = result.cantidadSubtareasRealizadas
    cantidadSubtareasFinalizadas.value = result.cantidadSubtareasFinalizadas

    mostrarCantidades.value = true

    // Graficos del coordinador consultado
    cantidadesPorEstadosSubtareas.value = result.cantidadesPorEstadosSubtareas
    const labels3 = result.cantidadesPorEstadosSubtareas.map((item) => item.estado)
    const valores3 = result.cantidadesPorEstadosSubtareas.map((item) => item.total_subtareas)
    const colores3 = result.cantidadesPorEstadosSubtareas.map((item) => mapearColor(item.estado))
    cantidadesPorEstadosSubtareasBar.value = mapearDatos('Estados de las subtareas del coordinador', labels3, valores3, 'Cantidad de subtareas', colores3)

    // Graficos de grupos grupos del coordinador seleccionado y sus estados
    const subtareasPorGrupo = contarSubtareasGrupo(result.subtareasGrupo)
    const subtareasPorEmpleado = contarSubtareasEmpleado(result.subtareasEmpleado)

    /************
     * Por grupo
     ************/
    agendados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.AGENDADO)
    const labelsAgendado = agendados.value.map((item) => item.grupo)
    const valoresAgendado = agendados.value.map((item) => item.total_subtareas)
    const coloresAgendado = agendados.value.map(() => generarColorAzulPastelClaro())
    agendadosBar.value = mapearDatos(estadosTrabajos.AGENDADO, labelsAgendado, valoresAgendado, 'Cantidad de subtareas', coloresAgendado)

    ejecutados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.EJECUTANDO)
    const labelsEjecutando = ejecutados.value.map((item) => item.grupo)
    const valoresEjecutando = ejecutados.value.map((item) => item.total_subtareas)
    const coloresEjecutando = ejecutados.value.map(() => generarColorAzulPastelClaro())
    ejecutadosBar.value = mapearDatos(estadosTrabajos.EJECUTANDO, labelsEjecutando, valoresEjecutando, 'Cantidad de subtareas', coloresEjecutando)

    pausados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.PAUSADO)
    const labelsPausado = pausados.value.map((item) => item.grupo)
    const valoresPausado = pausados.value.map((item) => item.total_subtareas)
    const coloresPausado = pausados.value.map(() => generarColorAzulPastelClaro())
    pausadosBar.value = mapearDatos(estadosTrabajos.PAUSADO, labelsPausado, valoresPausado, 'Cantidad de subtareas', coloresPausado)

    suspendidos.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.SUSPENDIDO)
    const labelsSuspendido = suspendidos.value.map((item) => item.grupo)
    const valoresSuspendido = suspendidos.value.map((item) => item.total_subtareas)
    const coloresSuspendido = suspendidos.value.map(() => generarColorAzulPastelClaro())
    suspendidosBar.value = mapearDatos(estadosTrabajos.SUSPENDIDO, labelsSuspendido, valoresSuspendido, 'Cantidad de subtareas', coloresSuspendido)

    cancelados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.CANCELADO)
    const labelsCancelado = cancelados.value.map((item) => item.grupo)
    const valoresCancelado = cancelados.value.map((item) => item.total_subtareas)
    const coloresCancelado = cancelados.value.map(() => generarColorAzulPastelClaro())
    canceladosBar.value = mapearDatos(estadosTrabajos.CANCELADO, labelsCancelado, valoresCancelado, 'Cantidad de subtareas', coloresCancelado)

    realizados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.REALIZADO)
    const labelsRealizado = realizados.value.map((item) => item.grupo)
    const valoresRealizado = realizados.value.map((item) => item.total_subtareas)
    const coloresRealizado = realizados.value.map(() => generarColorAzulPastelClaro())
    realizadosBar.value = mapearDatos(estadosTrabajos.REALIZADO, labelsRealizado, valoresRealizado, 'Cantidad de subtareas', coloresRealizado)

    finalizados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.FINALIZADO)
    const labelsFinalizado = finalizados.value.map((item) => item.grupo)
    const valoresFinalizado = finalizados.value.map((item) => item.total_subtareas)
    const coloresFinalizado = finalizados.value.map(() => generarColorAzulPastelClaro())
    finalizadosBar.value = mapearDatos(estadosTrabajos.FINALIZADO, labelsFinalizado, valoresFinalizado, 'Cantidad de subtareas', coloresFinalizado)

    graficosCoordinadorSubordinadosPorGrupo.value = []

    if (agendadosBar.value.labels.length) graficosCoordinadorSubordinadosPorGrupo.value.push(agendadosBar.value)
    if (ejecutadosBar.value.labels.length) graficosCoordinadorSubordinadosPorGrupo.value.push(ejecutadosBar.value)
    if (pausadosBar.value.labels.length) graficosCoordinadorSubordinadosPorGrupo.value.push(pausadosBar.value)
    if (suspendidosBar.value.labels.length) graficosCoordinadorSubordinadosPorGrupo.value.push(suspendidosBar.value)
    if (canceladosBar.value.labels.length) graficosCoordinadorSubordinadosPorGrupo.value.push(canceladosBar.value)
    if (realizadosBar.value.labels.length) graficosCoordinadorSubordinadosPorGrupo.value.push(realizadosBar.value)
    if (finalizadosBar.value.labels.length) graficosCoordinadorSubordinadosPorGrupo.value.push(finalizadosBar.value)

    /***************
    * Por empleado
    ****************/
    const agendadosEmpleado = filtrarSubtareasGrupoPorEstado(subtareasPorEmpleado, estadosTrabajos.AGENDADO)
    const labelsAgendadoEmpleado = agendadosEmpleado.map((item) => item.empleado)
    const valoresAgendadoEmpleado = agendadosEmpleado.map((item) => item.total_subtareas)
    const coloresAgendadoEmpleado = agendadosEmpleado.map(() => generarColorAzulPastelClaro())
    const agendadosEmpleadoBar: GraficoConfig = mapearDatos(estadosTrabajos.AGENDADO, labelsAgendadoEmpleado, valoresAgendadoEmpleado, 'Cantidad de subtareas', coloresAgendadoEmpleado)

    const ejecutadosEmpleado = filtrarSubtareasGrupoPorEstado(subtareasPorEmpleado, estadosTrabajos.EJECUTANDO)
    const labelsEjecutandoEmpleado = ejecutadosEmpleado.map((item) => item.empleado)
    const valoresEjecutandoEmpleado = ejecutadosEmpleado.map((item) => item.total_subtareas)
    const coloresEjecutandoEmpleado = ejecutadosEmpleado.map(() => generarColorAzulPastelClaro())
    const ejecutadosEmpleadoBar = mapearDatos(estadosTrabajos.EJECUTANDO, labelsEjecutandoEmpleado, valoresEjecutandoEmpleado, 'Cantidad de subtareas', coloresEjecutandoEmpleado)

    const pausadosEmpleado = filtrarSubtareasGrupoPorEstado(subtareasPorEmpleado, estadosTrabajos.PAUSADO)
    const labelsPausadoEmpleado = pausadosEmpleado.map((item) => item.empleado)
    const valoresPausadoEmpleado = pausadosEmpleado.map((item) => item.total_subtareas)
    const coloresPausadoEmpleado = pausadosEmpleado.map(() => generarColorAzulPastelClaro())
    const pausadosEmpleadoBar = mapearDatos(estadosTrabajos.PAUSADO, labelsPausadoEmpleado, valoresPausadoEmpleado, 'Cantidad de subtareas', coloresPausadoEmpleado)

    const suspendidosEmpleado = filtrarSubtareasGrupoPorEstado(subtareasPorEmpleado, estadosTrabajos.SUSPENDIDO)
    const labelsSuspendidoEmpleado = suspendidosEmpleado.map((item) => item.empleado)
    const valoresSuspendidoEmpleado = suspendidosEmpleado.map((item) => item.total_subtareas)
    const coloresSuspendidoEmpleado = suspendidosEmpleado.map(() => generarColorAzulPastelClaro())
    const suspendidosEmpleadoBar = mapearDatos(estadosTrabajos.SUSPENDIDO, labelsSuspendidoEmpleado, valoresSuspendidoEmpleado, 'Cantidad de subtareas', coloresSuspendidoEmpleado)

    const canceladosEmpleado = filtrarSubtareasGrupoPorEstado(subtareasPorEmpleado, estadosTrabajos.CANCELADO)
    const labelsCanceladoEmpleado = canceladosEmpleado.map((item) => item.empleado)
    const valoresCanceladoEmpleado = canceladosEmpleado.map((item) => item.total_subtareas)
    const coloresCanceladoEmpleado = canceladosEmpleado.map(() => generarColorAzulPastelClaro())
    const canceladosEmpleadoBar = mapearDatos(estadosTrabajos.CANCELADO, labelsCanceladoEmpleado, valoresCanceladoEmpleado, 'Cantidad de subtareas', coloresCanceladoEmpleado)

    const realizadosEmpleado = filtrarSubtareasGrupoPorEstado(subtareasPorEmpleado, estadosTrabajos.REALIZADO)
    const labelsRealizadoEmpleado = realizadosEmpleado.map((item) => item.empleado)
    const valoresRealizadoEmpleado = realizadosEmpleado.map((item) => item.total_subtareas)
    const coloresRealizadoEmpleado = realizadosEmpleado.map(() => generarColorAzulPastelClaro())
    const realizadosEmpleadoBar = mapearDatos(estadosTrabajos.REALIZADO, labelsRealizadoEmpleado, valoresRealizadoEmpleado, 'Cantidad de subtareas', coloresRealizadoEmpleado)

    const finalizadosEmpleado = filtrarSubtareasGrupoPorEstado(subtareasPorEmpleado, estadosTrabajos.FINALIZADO)
    const labelsFinalizadoEmpleado = finalizadosEmpleado.map((item) => item.empleado)
    const valoresFinalizadoEmpleado = finalizadosEmpleado.map((item) => item.total_subtareas)
    const coloresFinalizadoEmpleado = finalizadosEmpleado.map(() => generarColorAzulPastelClaro())
    const finalizadosEmpleadoBar = mapearDatos(estadosTrabajos.FINALIZADO, labelsFinalizadoEmpleado, valoresFinalizadoEmpleado, 'Cantidad de subtareas', coloresFinalizadoEmpleado)

    graficosCoordinadorSubordinadosPorCoordinador.value = []

    if (agendadosEmpleadoBar.labels.length) graficosCoordinadorSubordinadosPorCoordinador.value.push(agendadosEmpleadoBar)
    if (ejecutadosEmpleadoBar.labels.length) graficosCoordinadorSubordinadosPorCoordinador.value.push(ejecutadosEmpleadoBar)
    if (pausadosEmpleadoBar.labels.length) graficosCoordinadorSubordinadosPorCoordinador.value.push(pausadosEmpleadoBar)
    if (suspendidosEmpleadoBar.labels.length) graficosCoordinadorSubordinadosPorCoordinador.value.push(suspendidosEmpleadoBar)
    if (canceladosEmpleadoBar.labels.length) graficosCoordinadorSubordinadosPorCoordinador.value.push(canceladosEmpleadoBar)
    if (realizadosEmpleadoBar.labels.length) graficosCoordinadorSubordinadosPorCoordinador.value.push(realizadosEmpleadoBar)
    if (finalizadosEmpleadoBar.labels.length) graficosCoordinadorSubordinadosPorCoordinador.value.push(finalizadosEmpleadoBar)

    // Linea de tiempo
    lineasTiempo.lineaTiempoSubtareasFinalizadasCoordinador = result.lineaTiempoSubtareasFinalizadasCoordinador
    const labelsLineaTiempoSubtareasFinalizadasCoordinador = result.lineaTiempoSubtareasFinalizadasCoordinador.map((item) => item.codigo_subtarea)
    const valoresLineaTiempoSubtareasFinalizadasCoordinador = result.lineaTiempoSubtareasFinalizadasCoordinador.map((item) => item.tiempo)
    const coloresLineaTiempoSubtareasFinalizadasCoordinador = result.lineaTiempoSubtareasFinalizadasCoordinador.map(() => generarColorAzulPastelClaro())
    graficoLineaTiempoSubtareasFinalizadasCoordinador.value = mapearDatos('', labelsLineaTiempoSubtareasFinalizadasCoordinador, valoresLineaTiempoSubtareasFinalizadasCoordinador, 'Tiempo ocupado (h)', coloresLineaTiempoSubtareasFinalizadasCoordinador)

    lineasTiempo.lineaTiempoSubtareasRealizadasCoordinador = result.lineaTiempoSubtareasRealizadasCoordinador
    const labelsLineaTiempoSubtareasRealizadasCoordinador = result.lineaTiempoSubtareasRealizadasCoordinador.map((item) => item.codigo_subtarea)
    const valoresLineaTiempoSubtareasRealizadasCoordinador = result.lineaTiempoSubtareasRealizadasCoordinador.map((item) => item.tiempo)
    const coloresLineaTiempoSubtareasRealizadasCoordinador = result.lineaTiempoSubtareasRealizadasCoordinador.map(() => generarColorAzulPastelClaro())
    graficoLineaTiempoSubtareasRealizadasCoordinador.value = mapearDatos('', labelsLineaTiempoSubtareasRealizadasCoordinador, valoresLineaTiempoSubtareasRealizadasCoordinador, 'Tiempo ocupado (h)', coloresLineaTiempoSubtareasRealizadasCoordinador)
  }

  function filtrarSubtareasGrupoPorEstado(subtareasGrupo: any[], estado: string) {
    // console.log(subtareasGrupo)
    return subtareasGrupo.filter((item) =>
      item.estado === estado
    )
  }

  function contarSubtareasGrupo(subtareas: Subtarea[]): any[] {
    const conteo = subtareas.reduce((acumulador: any, subtarea) => {
      const estado = subtarea.estado
      const grupo = subtarea.grupo

      // Verificar si la clave ya existe en el acumulador
      const elementoExistente: any = acumulador.find((item: any) => item.estado === estado && item.grupo === grupo)

      if (!elementoExistente) {
        acumulador.push({ estado, grupo, total_subtareas: 1 })
      } else {
        elementoExistente.total_subtareas++
      }

      return acumulador
    }, [])

    return conteo
  }

  function contarSubtareasEmpleado(subtareas: Subtarea[]): any[] {
    const conteo = subtareas.reduce((acumulador: any, subtarea) => {
      const estado = subtarea.estado
      const empleado = subtarea.empleado_responsable

      // Verificar si la clave ya existe en el acumulador
      const elementoExistente: any = acumulador.find((item: any) => item.estado === estado && item.empleado === empleado)

      if (!elementoExistente) {
        //console.log(estado)
        acumulador.push({ estado, empleado, total_subtareas: 1 })
      } else {
        elementoExistente.total_subtareas++
      }

      return acumulador
    }, [])

    return conteo
  }

  function resetearDatosDashboardCoordinador() {
    graficosCoordinadorSubordinadosPorGrupo.value = []
    graficosCoordinadorSubordinadosPorCoordinador.value = []
    cantidadesPorEstadosSubtareasBar.value = null
    graficoLineaTiempoSubtareasRealizadasCoordinador.value = null
    graficoLineaTiempoSubtareasFinalizadasCoordinador.value = null
    mostrarCantidades.value = false
  }

  

  function mapearDatos(titulo: string, labels: string[], valores: number[], tituloLabel: string, colores?: string[]) {
    return {
      titulo: titulo,
      labels: labels,
      datasets: [
        {
          backgroundColor: colores ?? '#666f88',
          label: tituloLabel,
          data: valores,
        },
      ],
    }
  }

  function mapearColor(estadoTicket: keyof typeof estadosTrabajos) {
    switch (estadoTicket) {
      case estadosTrabajos.AGENDADO: return '#f9de8d'
      case estadosTrabajos.EJECUTANDO: return '#ffc107'
      case estadosTrabajos.PAUSADO: return '#78909c'
      case estadosTrabajos.SUSPENDIDO: return '#ec5c64'
      case estadosTrabajos.REALIZADO: return '#9ba98c'
      case estadosTrabajos.FINALIZADO: return '#8bc34a'
      case estadosTrabajos.CANCELADO: return '#c31d25'
    }
  }

  function seleccionarGraficoLineaTiempo(data) {
    if (!data.label) return

    const config: CustomActionPrompt = reactive({
      mensaje: 'Seleccione una opción',
      accion: async (opcion) => {
        const entidad: Subtarea = lineasTiempo.lineaTiempoSubtareasFinalizadasCoordinador.filter((subtarea: Subtarea) => subtarea.codigo_subtarea === data.label)[0]
        switch (opcion) {
          case 'MAS_DETALLES':
            subtareaStore.idSubtareaSeleccionada = entidad.id
            subtareaStore.accion = acciones.consultar
            modalesSubtarea.abrirModalEntidad('SubtareaPage')
            break
          case 'SEGUIMIENTO':
            trabajoAsignadoStore.subtarea = entidad

            modalesSubtarea.abrirModalEntidad('SeguimientoSubtareaPage')
            break
        }
      },
      tipo: 'radio',
      items: [
        {
          label: 'Más detalles',
          value: 'MAS_DETALLES',
        },
        {
          label: 'Seguimiento',
          value: 'SEGUIMIENTO',
        }
      ]
    })
    promptItems(config)
  }

  const subtareasFiltradas: Ref<Subtarea[]> = ref([])
  function seleccionarCantidadesPorEstadoSubtareas(data) {
    subtareasFiltradas.value = subtareas.value.filter((subtarea: Subtarea) => subtarea.estado === data.label)
  }

  function seleccionarCantidadesSubtareasSubordinados(data, estado) {
    subtareasSubordinados.value = subtareasGrupo.value.filter((subtarea: Subtarea) => subtarea.grupo === data.label && subtarea.estado === estado)
  }

  function seleccionarGraficoEmpleadoSubordinado(data, estado) {
    const { label } = data
    if (label) {
      subtareasEmpleadoSubordinado.value = subtareasEmpleado.value.filter((subtarea: Subtarea) => subtarea.empleado_responsable === label && subtarea.estado === estado)
    }
  }

  return {
    consultarDashboardCoordinador,
    resetearDatosDashboardCoordinador,
    // Por empleado
    agendadosEmpleado,
    ejecutadosEmpleado,
    pausadosEmpleado,
    suspendidosEmpleado,
    canceladosEmpleado,
    realizadosEmpleado,
    finalizadosEmpleado,
    // Por grupo
    agendados,
    ejecutados,
    pausados,
    suspendidos,
    cancelados,
    realizados,
    finalizados,
    subtareasFiltradas,
    subtareasSubordinados,
    subtareasEmpleadoSubordinado,
    seleccionarCantidadesPorEstadoSubtareas,
    seleccionarCantidadesSubtareasSubordinados,
    seleccionarGraficoEmpleadoSubordinado,
    subtareas,
    cantidadTareasActivas,
    cantidadTareasFinalizadas,
    cantidadSubtareasAgendadas,
    cantidadSubtareasPausadas,
    cantidadSubtareasSuspendidas,
    cantidadSubtareasCanceladas,
    cantidadSubtareasRealizadas,
    cantidadSubtareasFinalizadas,
    totalSubtareas,
    graficoLineaTiempoSubtareasFinalizadasCoordinador,
    graficoLineaTiempoSubtareasRealizadasCoordinador,
    cantidadSubtareasEjecutadas,
    cantidadesPorEstadosSubtareas,
    cantidadesPorEstadosSubtareasBar,
    seleccionarGraficoLineaTiempo,
    graficosCoordinadorSubordinadosPorGrupo,
    graficosCoordinadorSubordinadosPorCoordinador,
    mostrarCantidades,
  }
}
