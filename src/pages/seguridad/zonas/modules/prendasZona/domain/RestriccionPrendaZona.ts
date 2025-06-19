import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class RestriccionPrendaZona extends EntidadAuditable {
    detalle_producto: number | null = null
    detalle_producto_id: number | null = null
    miembro_zona: number | null = null
    miembro_zona_id: number | null = null
}