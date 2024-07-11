import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Vacante extends EntidadAuditable {
    nombre: string | null
    tipo_puesto: number | null
    imagen_referencia: string | null
    publicidad: string | null
    fecha_caducidad: Date | null
    descripcion: string
    anios_experiencia: number | null
    conocimientos: any[] | null
    formaciones_academicas: any[] | null
    numero_postulantes: number
    areas_conocimiento: any[]
    requiere_experiencia: boolean

    constructor() {
        super()
        this.nombre = null
        this.tipo_puesto = null
        this.imagen_referencia = null
        this.publicidad = null
        this.fecha_caducidad = null
        this.descripcion = ''
        this.anios_experiencia = null
        this.conocimientos = []
        this.formaciones_academicas = []
        this.numero_postulantes = 0
        this.areas_conocimiento = []
        this.requiere_experiencia = false
    }
}