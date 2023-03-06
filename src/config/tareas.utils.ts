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

export const tabOptionsEstadosSubtareas: TabOption[] = [
  { label: 'Todo', value: '' },
  // { label: 'Creado', value: 'CREADO' },
  { label: 'Asignado', value: 'ASIGNADO' },
  { label: 'Ejecutando', value: 'EJECUTANDO' },
  { label: 'Pausado', value: 'PAUSADO' },
  { label: 'Suspendido', value: 'SUSPENDIDO' },
  { label: 'Cancelado', value: 'CANCELADO' },
  { label: 'Realizado', value: 'REALIZADO' },
  { label: 'Finalizado', value: 'FINALIZADO' },
]
