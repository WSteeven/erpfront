import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class MiembroZona extends EntidadAuditable {
    zona: number | null = null
    empleado: number | null = null
    tiene_restriccion = false
}