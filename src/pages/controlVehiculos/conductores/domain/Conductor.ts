import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado";
import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Conductor extends EntidadAuditable {
    empleado: number | null
    identificacion: string | null
    tipo_licencia: string | null
    puntos: number | null
    plaza: number | null
    info_empleado: Empleado | null
    licencias: any[]

    multas: any[]

    constructor() {
        super()
        this.empleado = null
        this.identificacion = null
        this.tipo_licencia = null
        this.puntos = null
        this.plaza = null
        this.info_empleado = null
        this.licencias = []
    
        this.multas = []
    }
}