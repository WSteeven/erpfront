import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ReporteAlimentacion extends EntidadAuditable  {
  guardia: null | string  = ''
  fecha: null | string = ''
  jornada: null | string = ''
  alimentacion: number | null = null
}
