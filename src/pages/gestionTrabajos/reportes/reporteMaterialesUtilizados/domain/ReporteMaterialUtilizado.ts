import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ReporteMaterialUtilizado extends EntidadAuditable {
    tipo_reporte: string | null
    proyecto_id: number | null
    tarea_id: number | null

    constructor() {
        super()
        this.tipo_reporte = null
        this.proyecto_id = null
        this.tarea_id = null
    }
}