import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class AntecedentePersonal extends EntidadAuditable {
  antecedentes_quirurgicos: string | null
  vida_sexual_activa: boolean
  tiene_metodo_planificacion_familiar: boolean
  tipo_metodo_planificacion_familiar: string | null
  hijos_vivos: number | null
  hijos_muertos: number | null
  ficha_preocupacional: number | null

  constructor() {
    super()
    this.vida_sexual_activa = false
    this.antecedentes_quirurgicos = null
    this.tiene_metodo_planificacion_familiar = false
    this.tipo_metodo_planificacion_familiar = null
    this.hijos_vivos = null
    this.hijos_muertos = null
    this.ficha_preocupacional = null
  }
}
