import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { estadosInspecciones } from 'pages/sso/config/utils'

export class SolicitudDescuento extends EntidadAuditable {
    titulo: string | null
    descripcion: string | null
    estado: string | null
    detalles_productos: DetalleProducto[]
    empleado_involucrado: number | null
    empleado_solicitante: number | null | string
    cliente: number | null
    incidente: number | null

    constructor() {
        super()
        this.titulo = null
        this.descripcion = null
        this.estado = estadosInspecciones.CREADO
        this.detalles_productos = []
        this.empleado_involucrado = null
        this.empleado_solicitante = null
        this.cliente = null
        this.incidente = null
    }
} 