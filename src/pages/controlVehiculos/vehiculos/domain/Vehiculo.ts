import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Vehiculo extends EntidadAuditable {
    placa: string | null
    num_chasis: string | null
    num_motor: string | null
    anio_fabricacion: number | null
    cilindraje: number | null
    rendimiento: string | null
    marca: string | null
    modelo: string | null
    // modelo_id: number | null
    combustible: string | null
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
        // this.modelo_id = null
        this.combustible = null
        // this.combustible_id = null
    }
}