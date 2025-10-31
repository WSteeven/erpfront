import { SelectOption } from 'components/tables/domain/SelectOption'
import { TabOption } from 'components/tables/domain/TabOption'
import { OptionGroup } from 'components/optionGroup/domain/OptionGroup'

export const estadosTareas = {
  pendiente: 'PENDIENTE',
  iniciada: 'INICIADA',
  finalizada: 'FINALIZADA',
  cancelada: 'CANCELADA',
  riesgo_perderse: 'RIESGO DE PERDERSE'
}
export const estadosTareasConecel: SelectOption[] = [
  { label: estadosTareas.pendiente, value: estadosTareas.pendiente },
  { label: estadosTareas.iniciada, value: estadosTareas.iniciada },
  { label: estadosTareas.finalizada, value: estadosTareas.finalizada },
  { label: estadosTareas.cancelada, value: estadosTareas.cancelada },
  { label: estadosTareas.riesgo_perderse, value: estadosTareas.riesgo_perderse }
]

export const tabOptionsTareasConecel: TabOption[] = [
  { label: 'TODAS', value: 'TODAS' },
  { label: 'PENDIENTE', value: 'PENDIENTE' },
  { label: 'INICIADA', value: 'INICIADA' },
  { label: 'FINALIZADA', value: 'FINALIZADA' },
  { label: 'CANCELADA', value: 'CANCELADA' },
  { label: 'RIESGO DE PERDERSE', value: 'RIESGO DE PERDERSE' }
]

export const tiposCarga: OptionGroup[] = [
  { label: 'INDIVIDUAL', value: 'INDIVIDUAL' },
  { label: 'POR LOTES', value: 'LOTES' }
]
