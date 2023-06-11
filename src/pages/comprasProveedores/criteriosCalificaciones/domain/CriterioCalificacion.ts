import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class CriterioCalificacion extends EntidadAuditable {
    nombre: string | null
    descripcion: string | null
    ponderacion_referencia: string | null
    departamento: number | null
    oferta:number | null

    constructor() {
        super()
        this.nombre = null
        this.descripcion = null
        this.ponderacion_referencia = null
        this.departamento = null
        this.oferta= null
    }
}