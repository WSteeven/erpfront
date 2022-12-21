import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class RegistroTendido extends EntidadAuditable {
    tipo_elemento: string | null
    propietario_elemento: string | null
    numero_elemento: string | null
    codigo_elemento: string | null
    progresiva_entrada: string | null
    progresiva_salida: string | null
    coordenada_del_elemento: string | null
    coordenada_poste_anclaje1: string | null
    coordenada_poste_anclaje2: string | null
    // latitud: string | null
    // longitud: string | null
    estado_elemento: string | null
    tiene_transformador: boolean
    cantidad_transformadores: number | null
    americano: boolean
    tiene_retenidas: boolean
    cantidad_retenidas: number | null
    instalo_manga: boolean
    instalo_reserva: boolean
    cantidad_reservas: number | null
    observaciones: string | null
    fecha: string | null
    hora: string | null
    imagen: string | null
    listadoProductosSeleccionados: any[]
    coordenada_cruce_americano: string | null

    constructor() {
        super()
        this.tipo_elemento = null
        this.propietario_elemento = null
        this.numero_elemento = null
        this.codigo_elemento = null
        this.progresiva_entrada = null
        this.progresiva_salida = null
        this.coordenada_del_elemento = null
        this.coordenada_poste_anclaje1 = null
        this.coordenada_poste_anclaje2 = null
        // this.latitud = null
        // this.longitud = null
        this.estado_elemento = null
        this.tiene_transformador = false
        this.cantidad_transformadores = null
        this.americano = false
        this.tiene_retenidas = false
        this.cantidad_retenidas = null
        this.instalo_manga = false
        this.instalo_reserva = false
        this.cantidad_reservas = null
        this.observaciones = null
        this.fecha = null
        this.hora = null
        this.imagen = null
        this.listadoProductosSeleccionados = []
        this.coordenada_cruce_americano = null
    }
}