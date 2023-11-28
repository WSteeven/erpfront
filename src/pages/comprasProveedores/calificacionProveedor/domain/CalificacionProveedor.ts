import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class CalificacionProveedor extends EntidadAuditable{

    listadoCriterios: any[]

    constructor(){
        super()
        this.listadoCriterios = []
    }
}