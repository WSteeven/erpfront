import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Zona extends EntidadAuditable {
    nombre: string | null = null
    descripcion: string | null = null
    activo = true
    direccion: string | null = null
    coordenadas: string | null = null
    empleados_asignados: Empleado[] | number[] = []
    empleados_asignados_ids: number[] = []
}