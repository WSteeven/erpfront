import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class ClienteFinal extends EntidadAuditable {
    id_cliente: string | null
    nombres: string | null
    apellidos: string | null
    celular: string | null
    provincia: number | null
    canton: number | null
    parroquia: string | null
    direccion: string | null
    referencias: string | null
    coordenadas: string | null

    constructor() {
        super()
        this.id_cliente = null
        this.nombres = null // responsable
        this.apellidos = null
        this.celular = null
        this.provincia = null
        this.canton = null
        this.parroquia = null
        this.direccion = null
        this.referencias = null
        this.coordenadas = null
    }
}