import { TabOption } from "components/tables/domain/TabOption"

export const opciones_traccion_vehiculos = [
  { value: '4X2 FWD', label: '4X2 FWD' },
  { value: '4X2 RWD', label: '4X2 RWD' },
  { value: 'AWD', label: 'AWD' },
  { value: '4WD', label: '4WD' },
  { value: '4X4', label: '4X4' },
  { value: '2X2', label: '2X2' },
  { value: '2X1', label: '2X1' },
]

export const tiposLicencias = [
  { value: 'A', label: 'A', caption: 'NO PROFESIONAL' },
  { value: 'B', label: 'B', caption: 'NO PROFESIONAL' },
  { value: 'F', label: 'F', caption: 'NO PROFESIONAL' },
  { value: 'A1', label: 'A1', caption: 'PROFESIONAL' },
  { value: 'C', label: 'C', caption: 'PROFESIONAL' },
  { value: 'C1', label: 'C1', caption: 'PROFESIONAL' },
  { value: 'D', label: 'D', caption: 'PROFESIONAL' },
  { value: 'D1', label: 'D1', caption: 'PROFESIONAL' },
  { value: 'E', label: 'E', caption: 'PROFESIONAL' },
  { value: 'E1', label: 'E1', caption: 'PROFESIONAL' },
  { value: 'G', label: 'G', caption: 'PROFESIONAL' },
]


export const tabOptionsConductores: TabOption[] = [
  { label: 'Vigentes', value: '1' },
  { label: 'Por caducar', value: '2' }
]

export const tabOptionsSeguros: TabOption[] = [
  { label: 'Vigentes', value: '1' },
  { label: 'Caducados', value: '2' }
]

export const tabOptionsMatriculas: TabOption[] = [
  { label: 'Este mes', value: '1' },
  { label: 'Este año', value: '2' },
  { label: 'Pasadas', value: '3' },
]