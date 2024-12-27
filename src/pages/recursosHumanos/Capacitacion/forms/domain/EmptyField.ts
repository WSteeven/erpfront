import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class EmptyField extends EntidadAuditable {
  // id: number
  type: string
  label: string | null
  options: any | null
  valor: string | null
  placeholder: string | null
  required: boolean
  orientacion: boolean

  constructor() {
    super()
    // this.id= 0
    this.type = 'text'
    this.label = null
    this.options = null
    this.valor = null
    this.placeholder = null
    this.required = true
    this.orientacion = true
  }
}
