import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class SeguroVehicular extends EntidadAuditable {
    nombre: string | null
    num_poliza: string | null
    fecha_caducidad: string | null
    estado: boolean

    constructor() {
        super()
        this.nombre = null
        this.num_poliza = null
        this.fecha_caducidad = null
        this.estado = true
    }
}