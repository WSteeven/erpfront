import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class PrendaZona extends EntidadAuditable {
    zona: number | null = null
    detalles_productos: DetalleProducto[] = []
    empleado_id: number | null = null
    cliente_id: number | null = null

    // Auxiliares
    tiene_restricciones = false
    miembro_zona: number | null = null
}