import { TabOption } from 'components/tables/domain/TabOption'

export const estadosIncidentes = {
    CREADO: 'CREADO',
    // EJECUTANDO: 'EJECUTANDO',
    FINALIZADO: 'FINALIZADO',
}

export const tabOptionsEstadosIncidentes: TabOption[] = [
    { label: 'Creado', value: estadosIncidentes.CREADO },
    // { label: 'Ejecutando', value: estadosIncidentes.EJECUTANDO },
    { label: 'Finalizado', value: estadosIncidentes.FINALIZADO },
]

export const tiposIncidentes = {
    REPORTE_INCIDENTE: 'REPORTE INCIDENTE',
    CAMBIO_EPP: 'CAMBIO DE EPP',
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

export const estadosSolicitudDescuento = {
    CREADO: 'CREADO',
    PRECIOS_ESTABLECIDOS: 'PRECIOS ESTABLECIDOS',
    DESCONTADO: 'DESCONTADO',
}

export const tabOptionsEstadosSolicitudDescuento: TabOption[] = [
    { label: 'Creado', value: estadosSolicitudDescuento.CREADO },
    { label: 'Precios establecidos', value: estadosSolicitudDescuento.PRECIOS_ESTABLECIDOS },
    { label: 'Descontado', value: estadosSolicitudDescuento.DESCONTADO },
]

export const estadosAccidentes = {
    CREADO: 'CREADO',
    FINALIZADO: 'FINALIZADO',
}

export const tabOptionsEstadosAccidentes: TabOption[] = [
    { label: 'Creado', value: estadosAccidentes.CREADO },
    { label: 'Finalizado', value: estadosAccidentes.FINALIZADO },
]