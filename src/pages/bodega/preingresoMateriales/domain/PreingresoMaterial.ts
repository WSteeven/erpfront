import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PreingresoMaterial extends EntidadAuditable {
    listadoProductos: any[]
    num_guia: string | null
    cliente: number | null
    cuadrilla: number | null
    tarea: number | null
    observacion: string | null
    autorizacion: number | null
    observacion_aut: number | null
    autorizador: number | null
    solicitante: string | null
    responsable: string | null
    responsable_id: number | null
    coordinador: number | null
    courier: string | null
    fecha:string | null
    proyecto:string|number | null
    etapa:string|number | null


    constructor() {
        super()
        this.cliente = null
        this.cuadrilla = null
        this.num_guia = null
        this.observacion = null
        this.tarea = null
        this.autorizador= null
        this.fecha= null
        this.responsable= null
        this.solicitante= null
        this.responsable_id= null
        this.coordinador= null
        this.courier= null
        this.autorizacion= null
        this.observacion_aut= null
        this.listadoProductos = []
        this.proyecto= null
        this.etapa= null


    }
}
