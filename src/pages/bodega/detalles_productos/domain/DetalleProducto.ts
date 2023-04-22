import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class DetalleProducto extends EntidadAuditable {
    id:number | null
    categoria: string | null
    codigo: string | null
    producto: string | null
    producto_id: number | null
    descripcion: string | null
    marca: string | null
    modelo: string | null
    modelo_id: string | null
    serial: string | null
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
    tipo: string | null

    //variables auxiliares
    tiene_serial: boolean
    es_computadora: boolean
    es_fibra: boolean
    tiene_precio_compra: boolean
    tiene_adicionales: boolean
    calco:boolean

    constructor() {
        super()
        this.id = null
        this.producto = null
        this.producto_id = null
        this.descripcion = null
        this.marca = null
        this.modelo = null
        this.modelo_id = null
        this.serial = null
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

        this.color = null
        this.talla = null
        this.tipo = null

        this.adicionales = null
        this.es_computadora = false
        this.es_fibra = false
        this.tiene_serial = false
        this.tiene_precio_compra = false
        this.tiene_adicionales = false
        this.calco=false
    }
}
