import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Pago extends EntidadAuditable {
    tipo: string | null = null
    num_cuenta_empresa: string | null = null
    num_secuencial: number | null = null
    num_comprobante: string | null = null
    moneda: string | null = null
    valor: number | null = 0
    forma_pago: string | null = null
    referencia: string | null = null
    referencia_adicional: string | null = null

    // Foreigns keys
    beneficiario: number | null = null
    cuenta_banco: number | null = null
    generador_cash: number | null = null

    // Auxiliares
    tipo_documento: string | null = null
    identificacion_beneficiario: string | null = null
    nombre_beneficiario: string | null = null
    codigo_beneficiario: string | null = null
    numero_cuenta: string | null = null
    tipo_cuenta: string | null = null
    // banco: string | null | number = null
    codigo_banco: string | null | number = null
    beneficiario_id: number | null = null
    cuenta_banco_id: number | null = null
}