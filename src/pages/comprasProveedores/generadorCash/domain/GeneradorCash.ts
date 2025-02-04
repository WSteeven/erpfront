import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Pago } from './Pago'

export class GeneradorCash extends EntidadAuditable {
    titulo: string | null = null
    pagos: Pago[] = []

    // Foreign keys
    creador: number | null = null
}