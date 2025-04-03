import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class DetalleDepartamentoProveedor extends EntidadAuditable {
    id: number | null
    departamento: string | null
    razon_social: string | null
    sucursal: string | null
    empleado: string | null
    calificacion: string | null
    fecha_calificacion: string | null
    created_at: string | null

    constructor() {
        super()
        this.id = null
        this.departamento = null
        this.razon_social = null
        this.sucursal = null
        this.empleado = null
        this.calificacion = null
        this.fecha_calificacion = null
        this.created_at = null
    }
}