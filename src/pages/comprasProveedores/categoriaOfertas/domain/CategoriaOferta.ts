import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class CategoriaOferta extends EntidadAuditable{
    nombre: string|null
    tipo_oferta: number|null
    tipo_oferta_id: number|null
    estado: boolean
    departamentos: any[]
    nombres_departamentos: any[]

    constructor(){
        super()
        this.nombre = null
        this.tipo_oferta = null
        this.tipo_oferta_id = null
        this.estado = true
        this.departamentos =[]
        this.nombres_departamentos =[]
    }
}