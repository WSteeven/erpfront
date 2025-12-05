import {EntidadAuditable} from 'shared/entidad/domain/entidadAuditable';

export class HorarioEmpleado extends EntidadAuditable{
    empleado: number| null;
    empleado_id: number| null;
    horario: number | null;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    activo:boolean

    constructor() {
        super();
        this.empleado = null;
        this.empleado_id = null;
        this.horario = null;
        this.fecha_inicio = null;
        this.fecha_fin = null;
        this.activo = true;
    }
}