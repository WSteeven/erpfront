export class Persona {
    // Cuestionario Riesgos Psicosociales
    primer_nombre: string | null
    segundo_nombre: string | null
    primer_apellido: string | null
    segundo_apellido: string | null
    provincia: number | null
    canton: number | null
    area: string | null
    nivel_academico: string | null
    antiguedad: string | null
    correo: number | null
    genero: string | null

    // Cuestionario alcohol y drogas
    nombre_empresa: string | null
    ruc: string | null
    cargo: string | null
    identificacion: string | null
    fecha_nacimiento: string | null
    tipo_afiliacion_seguridad_social: string | null
    estado_civil: number | null
    numero_hijos: number | null
    autoidentificacion_etnica: string | null
    discapacidad: boolean
    porcentaje_discapacidad: string | null
    es_trabajador_sustituto: boolean
    enfermedades_preexistentes: string | null
    ha_recibido_capacitacion: boolean
    tiene_examen_preocupacional: boolean
    // nivel_instruccion: string | null

    constructor() {
        // Cuestionario Riesgos Psicosociales
        this.primer_nombre = null
        this.segundo_nombre = null
        this.primer_apellido = null
        this.segundo_apellido = null
        this.provincia = null
        this.canton = null
        this.area = null
        this.nivel_academico = null
        this.antiguedad = null
        this.correo = null

        // Cuestionario alcohol y drogas
        this.nombre_empresa = null
        this.ruc = null
        this.cargo = null
        this.identificacion = null
        this.fecha_nacimiento = null
        this.tipo_afiliacion_seguridad_social = null
        this.estado_civil = null
        this.genero = 'M'
        this.numero_hijos = 0
        this.autoidentificacion_etnica = null
        this.discapacidad = false
        this.porcentaje_discapacidad = null
        this.es_trabajador_sustituto = false
        this.enfermedades_preexistentes = null
        this.ha_recibido_capacitacion = true
        this.tiene_examen_preocupacional = true
        // this.nivel_instruccion = null
    }
}