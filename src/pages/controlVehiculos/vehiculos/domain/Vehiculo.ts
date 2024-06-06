import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Vehiculo extends EntidadAuditable {
    placa: string | null
    num_chasis: string | null
    num_motor: string | null
    anio_fabricacion: number | null
    cilindraje: number | null
    rendimiento: number | null
    marca: string | null
    modelo: string | null
    combustible: string | null
    traccion: string | null
    tipo_vehiculo: string | null
    tiene_gravamen: boolean
    prendador: string | null
    aire_acondicionado: boolean | false
    capacidad_tanque: number | null
    color: string | null
    seguro: number | null
    tipo: string | null
    tiene_rastreo: boolean
    propietario: string | null
    custodio: string | null
    conductor_externo: string | null
    identificacion_conductor_externo: string | null

    constructor() {
        super()
        this.placa = null
        this.num_chasis = null
        this.num_motor = null
        this.anio_fabricacion = null
        this.cilindraje = null
        this.rendimiento = null
        this.marca = null
        this.modelo = null
        this.combustible = null
        this.tipo_vehiculo = null
        this.traccion = null
        this.aire_acondicionado = false
        this.capacidad_tanque = null
        this.color = null
        this.seguro = null
        this.tiene_gravamen = false
        this.prendador = null
        this.tipo = null
        this.tiene_rastreo = false
        this.propietario = null
        this.custodio = null
        this.conductor_externo = null
        this.identificacion_conductor_externo = null
    }
}