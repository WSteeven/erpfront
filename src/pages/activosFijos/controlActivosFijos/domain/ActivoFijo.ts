import { PermisoArma } from 'pages/bodega/permisosArmas/domain/PermisoArma'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ActivoFijo extends EntidadAuditable {
    codigo: string | null
    descripcion: string | null
    tipo: string | null
    marca: string | null
    modelo: string | null
    serie: string | null
    calibre: string | null
    unidad_medida: string | null
    fecha_caducidad_producto: string | null
    total_ingresos: number | null
    total_egresos: number | null
    fotografia: string | null
    permiso_arma: PermisoArma
    detalle_producto_id: number | null

    cantidad: number | null
    fecha_desde: string | null
    fecha_hasta: string | null
    accion: string | null
    observacion: string | null
    lugar: string | null
    producto: number | null
    empleado: number | null
    sucursal: number | null
    condicion: number | null

    constructor() {
        super()
        this.codigo = null
        this.descripcion = null
        this.tipo = null
        this.marca = null
        this.modelo = null
        this.serie = null
        this.calibre = null
        this.unidad_medida = null
        this.fecha_caducidad_producto = null
        this.total_ingresos = null
        this.total_egresos = null
        this.fotografia = null
        this.permiso_arma = new PermisoArma()
        this.detalle_producto_id = null

        this.cantidad = null
        this.fecha_desde = null
        this.fecha_hasta = null
        this.accion = null
        this.observacion = null
        this.lugar = null
        this.producto = null
        this.empleado = null
        this.sucursal = null
        this.condicion = null
    }
}