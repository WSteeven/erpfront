import { TabOption } from "components/tables/domain/TabOption"

export const nivelesTrabajos = {
  TAREA: 0,
  SUBTAREA_N1: 1,
  SUBTAREA_N2: 2,
  SUBTAREA_N3: 3,
}

export const mediosNotificacion = [
  'CORREO',
  'LLAMADA',
  'CHAT',
]

export const modosAsignacionTrabajo = { por_grupo: 'POR_GRUPO', por_empleado: 'POR_EMPLEADO' }

export const destinosTareas = {
  paraProyecto: 'PARA_PROYECTO',
  paraClienteFinal: 'PARA_CLIENTE_FINAL',
}

export const ubicacionesTrabajo = {
  clienteFinal: 'CLIENTE_FINAL',
  ruta: 'RUTA',
}

export const tabOptionsEstadosTareas: TabOption[] = [
  // { label: 'Todo', value: '' },
  { label: 'Activas', value: 0 },
  { label: 'Finalizadas', value: 1 },
];

export const tabOptionsEstadosSubtareas: TabOption[] = [
  { label: 'Todo', value: '' },
  // { label: 'Creado', value: 'CREADO' },
  // { label: 'Asignado', value: 'ASIGNADO' },
  { label: 'Agendado', value: 'AGENDADO' },
  { label: 'Ejecutando', value: 'EJECUTANDO' },
  { label: 'Pausado', value: 'PAUSADO' },
  //{ label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Suspendido', value: 'SUSPENDIDO' },
  { label: 'Cancelado', value: 'CANCELADO' },
  { label: 'Realizado', value: 'REALIZADO' },
  { label: 'Finalizado', value: 'FINALIZADO' },
]

export const tabOptionsEstadosSubtareasMonitor: TabOption[] = [
  { label: 'Todo', value: '' },
  { label: 'Agendado', value: 'AGENDADO' },
  { label: 'Ejecutando', value: 'EJECUTANDO' },
  { label: 'Pausado', value: 'PAUSADO' },
  { label: 'Suspendido', value: 'SUSPENDIDO' },
  { label: 'Cancelado', value: 'CANCELADO' },
  { label: 'Realizado', value: 'REALIZADO' },
  { label: 'Finalizado', value: 'FINALIZADO' },
]

export const tabTrabajoAsignado: TabOption[] = [
  //{ label: 'Todo', value: '' },
  { label: 'Agendado', value: 'AGENDADO' },
  { label: 'Ejecutando', value: 'EJECUTANDO' },
  { label: 'Pausado', value: 'PAUSADO' },
  //{ label: 'Realizado', value: 'REALIZADO' },
  { label: 'Próximos trabajos', value: 'PROXIMO' },
  /*{ label: 'Suspendido', value: 'SUSPENDIDO' },
  { label: 'Cancelado', value: 'CANCELADO' },*/
]

export const modosStock: TabOption[] = [
  { label: 'Para tareas', value: 'TAREAS' },
  { label: 'Stock personal', value: 'PERSONAL' },
]

// Listados estaticos
export const motivosMovilizacion = [
  { id: 'IDA', descripcion: 'IDA AL TRABAJO' },
  { id: 'REGRESO', descripcion: 'REGRESO DEL TRABAJO' },
]
