import { PermisoArma } from 'pages/bodega/permisosArmas/domain/PermisoArma'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class DetalleProducto extends EntidadAuditable {
    detalle_id: number | null
    categoria: string | null
    codigo: string | null
    producto: string | null
    producto_id: number | null
    descripcion: string | null
    marca: string | null
    nombre_marca: string | null
    modelo: string | null
    nombre_modelo: string | null
    modelo_id: string | null
    serial: string | null
    lote: string | null
    precio_compra: string | null

    ram: string | null
    disco: string | null
    procesador: string | null
    imei: string | null

    computadora: string | null
    fibra: string | null

    span: string | null
    tipo_fibra: string | null
    hilos: string | null
    punta_inicial: string | null
    punta_final: string | null
    punta_corte: string | null
    custodia: string | null
    puntas: string | null
    adicionales: string | null

    color: string | null
    talla: string | null
    calibre: string | null
    peso: string | null
    dimensiones: string | null
    permiso: string | null
    permiso_id: number | null
    caducidad: string | null

    tipo: string | null
    activo: boolean

    es_generico: boolean
    nombre_alternativo: string | null
    vida_util: number | null

    //variables auxiliares
    esActivo: boolean | null
    tiene_serial: boolean
    tiene_lote: boolean
    es_computadora: boolean
    es_fibra: boolean
    tiene_precio_compra: boolean
    tiene_adicionales: boolean
    tiene_fecha_caducidad: boolean
    fecha_caducidad: string | null
    calco: boolean

    varios_items: boolean
    archivo: string
    subida_masiva: boolean
    _method:string
    seriales: any[]

    unidad_medida: string | null
    fotografia: string | null
    fotografia_detallada: string | null
    permiso_arma: PermisoArma
    codigo_activo_fijo: string | null

    constructor() {
        super()
        this.id = null
        this.detalle_id = null
        this.producto = null
        this.producto_id = null
        this.descripcion = null
        this.marca = null
        this.nombre_marca = null
        this.modelo = null
        this.nombre_modelo = null
        this.modelo_id = null
        this.serial = null
        this.lote = null
        this.precio_compra = null
        this.ram = null
        this.disco = null
        this.procesador = null
        this.imei = null
        this.computadora = null
        this.fibra = null
        this.span = null
        this.tipo_fibra = null
        this.categoria = null
        this.codigo = null
        this.hilos = null
        this.punta_inicial = null
        this.punta_final = null
        this.punta_corte = null
        this.custodia = null
        this.puntas = null
        this.vida_util = null

        this.es_generico = false
        this.nombre_alternativo = null

        this.color = null
        this.talla = null
        this.calibre = null
        this.peso = null
        this.dimensiones = null
        this.permiso = null
        this.permiso_id = null
        this.caducidad = null
        this.tipo = null
        this.activo = true

        this.adicionales = null
        this.es_computadora = false
        this.esActivo = false
        this.es_fibra = false
        this.tiene_serial = false
        this.tiene_lote = false
        this.tiene_precio_compra = false
        this.tiene_adicionales = false
        this.tiene_fecha_caducidad = false
        this.fecha_caducidad = null
        this.calco = false
        this.varios_items = false
        this.subida_masiva = false
        this.seriales = []

        this.unidad_medida = null
        this.fecha_caducidad = null
        this.permiso_arma = new PermisoArma()

        this.fotografia = null
        this.fotografia_detallada = null
        this.codigo_activo_fijo = null

        this.archivo = null
        this._method = 'GET'
    }
}
