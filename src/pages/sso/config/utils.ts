import { TabOption } from 'components/tables/domain/TabOption'

export const estadosIncidentes = {
    CREADO: 'CREADO',
    // EJECUTANDO: 'EJECUTANDO',
    RESUELTO: 'RESUELTO',
}

export const tabOptionsEstadosIncidentes: TabOption[] = [
    { label: 'Creado', value: estadosIncidentes.CREADO },
    // { label: 'Ejecutando', value: estadosIncidentes.EJECUTANDO },
    { label: 'Resuelto', value: estadosIncidentes.RESUELTO },
]

export const tiposIncidentes = {
    REPORTE_INCIDENTE: 'REPORTE INCIDENTE',
    CAMBIO_EPP: 'CAMBIO EPP',
}

export const tabOptionsTiposIncidentes: TabOption[] = [
    { label: 'Es un reporte de incidente', value: tiposIncidentes.REPORTE_INCIDENTE },
    { label: 'En un cambio de EPPs', value: tiposIncidentes.CAMBIO_EPP },
]

export const estadosInspecciones = {
    CREADO: 'CREADO',
    // EJECUTANDO: 'EJECUTANDO',
    FINALIZADO: 'FINALIZADO',
}

export const tabOptionsEstadosInspecciones: TabOption[] = [
    { label: 'Creado', value: estadosInspecciones.CREADO },
    { label: 'Finalizado', value: estadosInspecciones.FINALIZADO },
    // { label: 'Ejecutando', value: estadosInspecciones.EJECUTANDO },
]