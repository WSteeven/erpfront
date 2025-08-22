import { TabOption } from 'components/tables/domain/TabOption'

export const tabOptionsRetenciones: TabOption[] = [
  { label: 'No Pagadas', value: '0' }, //inactivo
  { label: 'Pagadas', value: '1' } //activo
]
export const tabOptionsProductos: TabOption[] = [
  { label: 'Activos', value: '1' }, //activo
  { label: 'Inactivos', value: '0' } //inactivo
]
export const tabOptionsVentas: TabOption[] = [
  { label: 'Activo', value: '1' },
  { label: 'Pendiente Instalar', value: '2' },
  { label: 'Pendiente Biometrico', value: '3' }
]

export const tabOptionsPagosComisiones: TabOption[] = [
  { label: 'Pendiente', value: 'PENDIENTE' }, //pendiente
  { label: 'Completa', value: 'COMPLETA' }, //completa
  { label: 'Anulada', value: 'ANULADA' } //anulada
]
export const estadosActivacionesVentas = {
  activado: '5',
  pendienteInstalar: '6',
  pendienteBiometrico: '7'
}

export const tabOptionsBonosMensuales: TabOption[] = [
  { label: 'Pendientes', value: '0' }, //no pagadas
  { label: 'Pagadas', value: '1' } //pagadas
]
