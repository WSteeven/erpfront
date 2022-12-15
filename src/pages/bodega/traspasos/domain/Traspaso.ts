import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Traspaso extends EntidadAuditable {
    justificacion:string|null
    devuelta:string|null
    solicitante:string|null
    desde_cliente:string|null
    hasta_cliente:string|null
    tarea:string|null
    sucursal:string|null
    estado:string|null

    listadoProductos:any[]

    //variables auxiliares
    es_tarea:boolean|null

    constructor(){
        super()
        this.justificacion=null
        this.devuelta=null
        this.solicitante=null
        this.desde_cliente=null
        this.hasta_cliente=null
        this.tarea=null
        this.sucursal=null
        this.estado=null

        this.listadoProductos=[]

        //aux
        this.es_tarea=false
    }
}