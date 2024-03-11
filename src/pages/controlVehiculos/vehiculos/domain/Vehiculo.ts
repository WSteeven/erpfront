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
    aire_acondicionado: boolean | false
    capacidad_tanque: number | null
    color: string | null
    seguro: number | null
    // combustible_id: number | null

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
        this.traccion = null
        this.aire_acondicionado = false
        this.capacidad_tanque = null
        this.color = null
        this.seguro = null
        // this.combustible_id = null
    }
}