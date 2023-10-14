import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Conductor extends EntidadAuditable{
    empleado:number|null
    identificacion:string|null
    tipo_licencia:string|null
    inicio_vigencia:string|null
    fin_vigencia:string|null
    puntos:number|null
    plaza:number|null

    constructor(){
        super()
        this.empleado = null
        this.identificacion= null
        this.tipo_licencia = null
        this.inicio_vigencia= null
        this.fin_vigencia= null
        this.puntos= null
        this.plaza= null
    }
}