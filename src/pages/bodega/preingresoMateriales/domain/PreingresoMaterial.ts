import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PreingresoMaterial extends EntidadAuditable {
    listadoProductos: any[]
    num_guia: string | null
    cliente: number | null
    tarea: number | null
    tipo: string | null
    observacion: string | null
    autorizacion: number | null
    autorizador: number | null
    responsable: number | null
    coordinador: number | null
    courier: string | null
    fecha:string | null
    categoria:string | null

    constructor() {
        super()
        this.cliente = null
        this.num_guia = null
        this.observacion = null
        this.tipo = null
        this.tarea = null
        this.autorizador= null
        this.fecha= null
        this.responsable= null
        this.coordinador= null
        this.categoria= null
        this.courier= null
        this.autorizacion= null
        this.listadoProductos = []


    }
}