import { estadosIncidentes, tiposIncidentes } from 'pages/sso/config/utils'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Incidente extends EntidadAuditable {
    titulo: string | null
    descripcion: string | null
    coordenadas: string | null
    tipo_incidente: string | null
    estado: string | null
    detalles_productos: []
    empleado_reporta: number | null
    empleado_involucrado: number | null
    inspeccion: number | null
    es_parte_inspeccion: boolean
    acciones_correctivas: string | null

    constructor() {
        super()
        this.titulo = null
        this.descripcion = null
        this.coordenadas = null
        this.tipo_incidente = tiposIncidentes.REPORTE_INCIDENTE
        this.estado = estadosIncidentes.CREADO
        this.detalles_productos = []
        this.empleado_reporta = null
        this.empleado_involucrado = null
        this.inspeccion = null
        this.es_parte_inspeccion = false
        this.acciones_correctivas = null
    }
}