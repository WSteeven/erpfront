import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Empresa extends EntidadAuditable {
    identificacion: string | null
    tipo_contribuyente: string | null
    razon_social: string | null
    nombre_comercial: string | null
    celular: string | null
    telefono: string | null
    correo: string | null
    pais: number | null
    provincia: number | null
    nombre_provincia: number | null
    canton: string | number| null
    ciudad: string | null
    sucursal: string | null
    direccion: string | null
    agente_retencion: boolean
    lleva_contabilidad: boolean
    contribuyente_especial: boolean
    regimen_tributario: string | null
    sitio_web: string | null
    actividad_economica: string | null
    created_at: string | null
    updated_at: string | null
    representante_legal: string | null
    identificacion_representante: string | null
    antiguedad_proveedor: string | null

    contactos: any[]

    constructor() {
        super()
        this.identificacion = null
        this.tipo_contribuyente = null
        this.razon_social = null
        this.nombre_comercial = null
        this.celular = null
        this.telefono = null
        this.pais = null
        this.provincia = null
        this.nombre_provincia = null
        this.canton = null
        this.ciudad = null
        this.correo = null
        this.direccion = null
        this.sucursal = null
        this.agente_retencion = false
        this.lleva_contabilidad = false
        this.contribuyente_especial = false
        this.regimen_tributario = null
        this.sitio_web = null
        this.actividad_economica = null
        this.contactos = []
        this.created_at = null
        this.updated_at = null
        this.representante_legal = null
        this.identificacion_representante = null
        this.antiguedad_proveedor = null

    }


}
