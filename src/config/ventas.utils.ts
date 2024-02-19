import { TabOption } from "components/tables/domain/TabOption";

export const tabOptionsRetenciones: TabOption[] = [
    { label: 'No Pagadas', value: '0' }, //inactivo
    { label: 'Pagadas', value: '1' }, //activo
]
export const tabOptionsProductos: TabOption[] = [
    { label: 'Activos', value: '1' }, //activo
    { label: 'Inactivos', value: '0' }, //inactivo
]
export const tabOptionsVentas: TabOption[] = [
    { label: 'Aprobadas', value: 'APROBADO' }, //activo
    { label: 'Activadas', value: '1' }, //activo
    { label: 'Inactivas', value: '0' }, //inactivo
]

export const tabOptionsPagosComisiones: TabOption[] = [
    { label: 'Pendiente', value: 'PENDIENTE' }, //pendiente
    { label: 'Completa', value: 'COMPLETA' }, //completa
    { label: 'Anulada', value: 'ANULADA' }, //anulada
]
export const estadosActivacionesVentas = {
    aprobado: 'APROBADO',
    activado: 'ACTIVADO',
}

export const tabOptionsBonosMensuales: TabOption[] = [
    { label: 'Pendientes', value: '0' }, //no pagadas
    { label: 'Pagadas', value: '1' }, //pagadas
]
