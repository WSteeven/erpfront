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
    canton: string | null
    ciudad: string | null
    sucursal: string | null
    direccion: string | null
    agente_retencion: boolean
    lleva_contabilidad: boolean
    contribuyente_especial: boolean
    regimen_tributario: string | null
    sitio_web: string | null
    actividad_economica: string | null

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
    }


}
