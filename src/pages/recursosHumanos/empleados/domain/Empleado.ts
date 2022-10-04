import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Empleado extends EntidadAuditable{
    identificacion:string|null
    nombres:string|null
    apellidos:string|null
    telefono:string|null
    fecha_nacimiento:string|null
    jefe:string|null
    email:string|null
    password:string|null
    // usuario:string|null
    sucursal:string|null
    estado:string|null
    roles:string|null

    constructor(){
        super()
        this.identificacion=null
        this.nombres=null
        this.apellidos=null
        this.telefono=null
        this.fecha_nacimiento=null
        this.jefe=null
        this.email=null
        this.password=null
        this.sucursal=null
        this.estado=null
        this.roles=null
    }
}