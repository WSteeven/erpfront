import { SelectOption } from 'components/tables/domain/SelectOption'
import { TabOption } from 'components/tables/domain/TabOption'
import { OptionGroup } from 'components/optionGroup/domain/OptionGroup'

export const estadosTareas = {
  pendiente: 'PENDIENTE',
  iniciada: 'INICIADA',
  finalizada: 'FINALIZADA',
  cancelada: 'CANCELADA',
  suspendida: 'SUSPENDIDA'
}
export const estadosTareasConecel: SelectOption[] = [
  { label: estadosTareas.pendiente, value: estadosTareas.pendiente },
  { label: estadosTareas.iniciada, value: estadosTareas.iniciada },
  { label: estadosTareas.finalizada, value: estadosTareas.finalizada },
  { label: estadosTareas.cancelada, value: estadosTareas.cancelada },
  { label: estadosTareas.suspendida, value: estadosTareas.suspendida }
]

export const tabOptionsTareasConecel: TabOption[] = [
  { label: 'TODAS', value: 'TODAS' },
  { label: 'PENDIENTE', value: 'PENDIENTE' },
  { label: 'INICIADA', value: 'INICIADA' },
  { label: 'FINALIZADA', value: 'FINALIZADA' },
  { label: 'CANCELADA', value: 'CANCELADA' },
  { label: estadosTareas.suspendida, value: estadosTareas.suspendida }
]

export const tiposCarga: OptionGroup[] = [
  { label: 'INDIVIDUAL', value: 'INDIVIDUAL' },
  { label: 'POR LOTES', value: 'LOTES' }
]


export const obtenerColorEstado = (estado: string): string => {
  switch (estado) {
    case estadosTareas.pendiente:
      return 'warning'
    case estadosTareas.iniciada:
      return 'info'
    case estadosTareas.finalizada:
      return 'positive'
    case estadosTareas.cancelada:
      return 'negative'
    // case estadosTareas.suspendida:
    //   return 'orange'
    default:
      return 'gray'
  }
}

// Paleta base — puedes ampliarla según tus necesidades
export const coloresBase = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8',
  '#f58231', '#911eb4', '#46f0f0', '#f032e6',
  '#bcf60c', '#fabebe', '#008080', '#e6beff',
  '#9a6324', '#fffac8', '#800000', '#aaffc3',
  '#808000', '#ffd8b1', '#000075', '#808080'
]