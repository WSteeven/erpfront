import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PlanMantenimiento extends EntidadAuditable {
    vehiculo: string | null
    comienza_km: number | null
    listadoServicios: any[]
    cant_servicios: number | null

    constructor() {
        super()
        this.vehiculo = null
        this.comienza_km = null
        this.listadoServicios = []
        this.cant_servicios = null
    }
}