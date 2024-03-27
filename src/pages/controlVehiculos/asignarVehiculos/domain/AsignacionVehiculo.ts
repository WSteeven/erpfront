import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class AsignacionVehiculo extends EntidadAuditable {
    vehiculo: string | null
    persona_entrega: number | null
    persona_responsable: number | null
    observacion: string | null

    constructor() {
        super()
        this.vehiculo = null
    }
}