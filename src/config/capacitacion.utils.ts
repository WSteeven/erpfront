import { SelectOption } from 'components/tables/domain/SelectOption'
import { TabOption } from 'components/tables/domain/TabOption'

export const tiposCampos: SelectOption[] = [
  { label: 'Texto', value: 'text' },
  { label: 'Bloque de Texto', value: 'textblock' },
  { label: 'Tip', value: 'tip' },
  { label: 'Alerta', value: 'alert' },
  { label: 'Radio', value: 'radio' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Lista Desplegable', value: 'select' },
  { label: 'Lista de Seleccion Múltiple', value: 'select_multiple' }
]

export const tabOptionsFormularios: TabOption[] = [
  { label: 'Activos', value: '1' },
  { label: 'Inactivos', value: '0' }
]

export const tiposRecurrencias:SelectOption[] = [
  { label: 'Trimestral', value: 3 },
  { label: 'Semestral', value: 6 },
  { label: 'Anual', value: 12 },
]

export const tiposFormularios= [
  'INTERNO',
  'EXTERNO',
]
