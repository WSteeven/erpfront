import { TabOption } from 'components/tables/domain/TabOption'
import { SelectOption } from 'components/tables/domain/SelectOption'

export const tabOptionsEstadosRolPagoEmpleado: TabOption[] = [
  { label: 'Todo', value: '' },
  { label: 'Creado', value: 'CREADO' },
  { label: 'Ejecutando', value: 'EJECUTANDO' },
  { label: 'Realizado', value: 'REALIZADO' },
  { label: 'Finalizado', value: 'FINALIZADO' }
]

export const tabOptionsEstadosRolPago: TabOption[] = [
  // { label: 'Todo', value: '' },
  { label: 'Activas', value: '0' },
  { label: 'Finalizadas', value: '1' }
]
export const tabOptionsEstadosAlimentacion: TabOption[] = [
  { label: 'Activas', value: '0' },
  { label: 'Finalizadas', value: '1' }
]
export const tabOptionsPlanificiones: TabOption[] = [
  { label: 'Pendientes', value: '0' },
  { label: 'Completas', value: '1' }
]

export const tabOptionsDescuentos: TabOption[] = [
  { label: 'Pendientes', value: '0' },
  { label: 'Pagados', value: '1' }
]

export const tabOptionsVacaciones: TabOption[] = [
  { label: 'Pendientes', value: 'PENDIENTES' },
  { label: 'Realizadas', value: 'REALIZADAS' }
]

export const opcionesReporteVacaciones: SelectOption[] = [
  { value: 'PLAN_VACACIONES', label: 'Plan de Vacaciones' },
  { value: 'VACACIONES_PENDIENTES', label: 'Vacaciones pendientes' },
  { value: 'VACACIONES_TOMADAS', label: 'Vacaciones tomadas' }
]

export const opcionesSubactividadesPlanificador: SelectOption[] = [
  // {label: 'No iniciado', value:-1},
  // {label: 'En Proceso', value:0},
  // {label: 'Finalizado', value:1},
  { label: 'No iniciado', value: 'No iniciado' },
  { label: 'En Proceso', value: 'En Proceso' },
  { label: 'Finalizado', value: 'Finalizado' }
]
export const opcionesPeriodicidad: SelectOption[] = [
  { label: 'Una vez', value: 'Una vez' },
  { label: 'Diario', value: 'Diario' },
  { label: 'Semanal', value: 'Semanal' },
  { label: 'Quincenal', value: 'Quincenal' },
  { label: 'Mensual', value: 'Mensual' },
  { label: 'Semestral', value: 'Semestral' },
  { label: 'Anual', value: 'Anual' }
]
export const estadosRolPagoEmpleado = {
  todo: '',
  creado: 'CREADO',
  ejecutando: 'EJECUTANDO',
  realizado: 'REALIZADO',
  finalizado: 'FINALIZADO'
}
export const estadosAlimentacion = {
  activa: '0',
  finalizado: '1'
}

export const tipo_puesto = {
  nuevo: 1,
  vacante: 2,
  pasante: 3
}
export const parentezcos = [
  { nombre: 'CÓNYUGE', value: 'CÓNYUGE' },
  { nombre: 'HIJO', value: 'HIJO' },
  { nombre: 'HIJA', value: 'HIJA' }
]

export const autoidentificaciones_etnicas = [
  { nombre: 'INDIGENA', value: 'INDIGENA' },
  { nombre: 'AFRODECENDIENTE/AFROECUATORIANO', value: 'AFRODECENDIENTE' },
  { nombre: 'MESTIZO', value: 'MESTIZO' },
  { nombre: 'BLANCO', value: 'BLANCO' },
  { nombre: 'MONTUBIO', value: 'MONTUBIO' },
  { nombre: 'OTRO', value: 'OTRO' }
]
