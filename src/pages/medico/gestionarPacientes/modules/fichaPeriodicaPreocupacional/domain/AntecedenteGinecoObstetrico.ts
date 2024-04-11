import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class AntecedenteGinecoObstetrico extends EntidadAuditable {
  menarquia: string | null
  ciclos: string | null
  fecha_ultima_menstruacion: string | null
  gestas: string | null
  partos: string | null
  cesareas: string | null
  abortos: string | null
  hijos_vivos: string | null
  hijos_muertos: string | null
  antecedentes_personales: number | null
  tiene_metodo_planificacion_familiar: boolean
  tipo_metodo_planificacion_familiar: string | null
  resultados_examenes_preocupacionales: any[]

  constructor() {
    super()
    this.menarquia = null
    this.ciclos = null
    this.fecha_ultima_menstruacion = null
    this.gestas = null
    this.partos = null
    this.cesareas = null
    this.abortos = null
    this.hijos_vivos = null
    this.hijos_muertos = null
    this.antecedentes_personales = null
    this.tiene_metodo_planificacion_familiar = false
    this.tipo_metodo_planificacion_familiar = null
    this.resultados_examenes_preocupacionales = []
  }
}
