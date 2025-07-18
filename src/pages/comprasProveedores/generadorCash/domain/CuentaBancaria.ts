import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class CuentaBancaria extends EntidadAuditable {
    tipo_cuenta: string | null = null
    numero_cuenta: string | null = null

    // Foreign keys
    banco: number | null | string = null
    codigo_banco: string | null = null
    beneficiario: number | null = null
}