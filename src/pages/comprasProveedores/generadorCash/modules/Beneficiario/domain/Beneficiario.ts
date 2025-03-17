import { CuentaBancaria } from 'pages/comprasProveedores/generadorCash/domain/CuentaBancaria'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Beneficiario extends EntidadAuditable {
    codigo_beneficiario: string | null = null
    tipo_documento: string | null = null
    identificacion_beneficiario: string | null = null
    nombre_beneficiario: string | null = null
    direccion: string | null = null
    telefono: string | null = null
    localidad: string | null = null
    correo: string | null = null

    // Foreign keys
    canton: number | null = null

    // Auxiliares
    cuentas_bancarias: CuentaBancaria[] = []
}