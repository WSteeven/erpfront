import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Auditoria extends EntidadAuditable {
    empleado: string | null
    fecha_inicio: string | null
    fecha_fin: string | null
    auditable_type: string | null
    auditable_id: number | null

    constructor() {
        super()
        this.empleado = null
        this.fecha_inicio = null
        this.fecha_fin = null
        this.auditable_type = null
        this.auditable_id = null
    }
}