import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Pago } from './Pago'

export class GeneradorCash extends EntidadAuditable {
    titulo: string | null = null
    pagos: Pago[] = []
    total_pagos: number | null = null
    valor_total: number | null = null

    // Foreign keys
    creador: number | null = null
}