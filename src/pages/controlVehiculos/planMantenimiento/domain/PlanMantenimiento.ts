import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PlanMantenimiento extends EntidadAuditable {
    vehiculo: string | null
    aplicar_desde: number | null
    listadoServicios: any[]
    cantidad_servicios: number | null
    activo: boolean

    constructor() {
        super()
        this.vehiculo = null
        this.aplicar_desde = null
        this.listadoServicios = []
        this.cantidad_servicios = null
        this.activo = true
    }
}