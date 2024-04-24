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
export const tiposServicios = [
  { value: 'PREVENTIVO', label: 'PREVENTIVO', },
  { value: 'CORRECTIVO', label: 'CORRECTIVO', },
]

export const tiposIncidentes = [
  { value: 'ROBO', label: 'ROBO', },
  { value: 'ACCIDENTE', label: 'ACCIDENTE', },
]

export const subtiposIncidentes = [
  { value: 'PARCIAL', label: 'PARCIAL', tipo: 'ROBO'},
  { value: 'TOTAL', label: 'TOTAL', tipo: 'ROBO'},
  { value: 'LEVE', label: 'LEVE', tipo: 'ACCIDENTE'},
  { value: 'GRAVE', label: 'GRAVE', tipo: 'ACCIDENTE'},
]

export const tabOptionsOrdenesReparaciones: TabOption[] = [
  { value: '1', label: 'PENDIENTES', },
  { value: '2', label: 'APROBADAS', },
  { value: '3', label: 'CANCELADAS', },
]

export const tabOptionsConductores: TabOption[] = [
  { label: 'Vigentes', value: '1' },
  { label: 'Por caducar', value: '2' },
  { label: 'Caducadas', value: '3' },
]

export const tabOptionsSeguros: TabOption[] = [
  { label: 'Vigentes', value: '1' },
  { label: 'Por caducar', value: '2' },
  { label: 'Caducados', value: '3' }
]
export const tabOptionsServicios: TabOption[] = [
  { label: 'Preventivos', value: 'PREVENTIVO' },
  { label: 'Correctivos', value: 'CORRECTIVO' }
]

export const tabOptionsMatriculas: TabOption[] = [
  { label: 'Este mes', value: '1' },
  { label: 'Vencidas', value: '2' },
  { label: 'Matriculadas', value: '3' },
  { label: 'Proximas a matricular', value: '4' },
]

export const tabOptionsAsignacionVehiculos: TabOption[] = [
  { label: 'PENDIENTES', value: 'PENDIENTE' },
  { label: 'FIRMADAS', value: 'FIRMADA' },
  { label: 'RECHAZADAS', value: 'RECHAZADO' },
  { label: 'ANULADAS', value: 'ANULADO' },
]

export const estadosAsignacionesVehiculos = [
  { label: 'PENDIENTE' },
  { label: 'ACEPTADO' },
  { label: 'RECHAZADO' },
  { label: 'ANULADO' },
]

export const optionsEstadosExtintor = [
  {
    label: 'Lleno',
    value: 'LLENO',
    color: 'green',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye',
  },
  {
    label: 'Vacio',
    value: 'VACIO',
    color: 'orange',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye',
  },
  {
    label: 'Caducado',
    value: 'CADUCADO',
    color: 'red',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye',
  },
]
export const optionsEstadosCualitativos = [
  {
    label: 'Lleno',
    value: 'LLENO',
    color: 'green',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye',
  },
  {
    label: 'Vacio',
    value: 'VACIO',
    color: 'red',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye',
  },
]
export const optionsEstados = [
  {
    label: 'Buen estado',
    value: 'BUENO',
    color: 'green',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye',
  },
  {
    label: 'Mal estado',
    value: 'MALO',
    color: 'red',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye',
  },
]
export const optionsDefault = [
  {
    label: '',
    value: 'CORRECTO',
    color: 'green',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye',
    iconColor: 'green-2',
  },
  {
    label: '',
    value: 'ADVERTENCIA',
    color: 'orange',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye',
  },
  {
    label: '',
    value: 'PELIGRO',
    color: 'red',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye',
  },
]
