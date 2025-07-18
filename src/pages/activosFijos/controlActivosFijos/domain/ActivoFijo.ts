import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto'
import { PermisoArma } from 'pages/bodega/permisosArmas/domain/PermisoArma'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ActivoFijo extends EntidadAuditable {
    codigo: string | null
    etiqueta_personalizada: string | null
    // detalle_producto_id: string | null
    etiqueta: string | null
    descripcion: string | null
    tipo: string | null
    marca: string | null
    modelo: string | null
    serie: string | null
    calibre: string | null
    unidad_medida: string | null
    total_ingresos: number | null
    total_egresos: number | null
    fotografia: string | null
    fotografia_detallada: string | null
    detalle_producto: DetalleProducto
    permiso_arma: PermisoArma
    cliente: string | number | null
    cliente_id: number | null

    fecha_caducidad: string | null
    ingresos: number | null
    egresos: number | null
    diferencia: number | null

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

    codigo_producto: string | null = null
    codigo_personalizado: string | null = null
    codigo_sistema_anterior: string | null = null

    constructor() {
        super()
        this.codigo = null
        this.etiqueta_personalizada = null
        // this.detalle_producto_id = null
        this.etiqueta = null
        this.descripcion = null
        this.tipo = null
        this.marca = null
        this.modelo = null
        this.serie = null
        this.calibre = null
        this.unidad_medida = null
        this.total_ingresos = null
        this.total_egresos = null
        this.fotografia = null
        this.fotografia_detallada = null
        this.detalle_producto = new DetalleProducto()
        this.permiso_arma = new PermisoArma()
        this.cliente = null
        this.cliente_id = null

        this.fecha_caducidad = null
        this.ingresos = null
        this.egresos = null
        this.diferencia = null

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
        this.codigo_producto = null
    }
}