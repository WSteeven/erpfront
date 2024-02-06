import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ConfiguracionExamenCampo extends EntidadAuditable {
  campo: string | null
  unidad_medida: string | null
  rango_inferior: number | null
  rango_superior: number | null
  configuracion_examen_categoria: number | null
  resultado: number | null // para configutracion columnas
  resultado_examen: number | null

  constructor() {
    super()
    this.campo = null
    this.unidad_medida = null
    this.rango_inferior = null
    this.rango_superior = null
    this.configuracion_examen_categoria = null
    this.resultado = null
    this.resultado_examen = null
  }
}
