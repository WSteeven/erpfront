import { TabOption } from "components/tables/domain/TabOption"

export const tiposReportes = {
  TRABAJOS_REALIZADOS: 'TRABAJOS REALIZADOS',
  TRABAJO_REALIZADO_POR_REGION: 'TRABAJO REALIZADO POR REGION',
  TRABAJO_REALIZADO_POR_REGION_TIPO_TRABAJO: 'TRABAJO REALIZADO POR REGION Y TIPO DE TRABAJO',
  TRABAJO_REALIZADO_POR_GRUPO_TIPO_TRABAJO: 'TRABAJO REALIZADO POR GRUPO Y TIPO DE TRABAJO',
  TRABAJO_REALIZADO_POR_GRUPO_TIPOS_TRABAJOS_EMERGENCIA: 'TRABAJO REALIZADO POR GRUPO Y TIPOS DE TRABAJOS EMERGENCIA',
  TRABAJO_REALIZADO_POR_GRUPO_CAUSA_INTERVENCION: 'TRABAJO REALIZADO POR GRUPO Y CAUSA DE INTERVENCION',
}

export const mediosNotificacion = [
  'CORREO',
  'LLAMADA',
  'CHAT',
  'TICKET',
]

export const modosAsignacionTrabajo = { por_grupo: 'POR_GRUPO', por_empleado: 'POR_EMPLEADO' }

export const destinosTareas = {
  paraProyecto: 'PARA_PROYECTO',
  paraClienteFinal: 'PARA_CLIENTE_FINAL',
} as const

export const tiposTareas = [
  { value: destinosTareas.paraProyecto, label: 'Tarea para un proyecto' },
  { value: destinosTareas.paraClienteFinal, label: 'Tarea para cliente final y mantenimiento' },
] as const

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
  //{ label: 'Todo', value: '' },
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
