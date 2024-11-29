export class EmptyField {
  type: string
  label: string
  options: string // Opciones para radio/checkbox/select
  valor:string
  placeholder:string
  required: boolean
  orientacion:boolean

  constructor() {
  this.type= 'text'
  this.label= ''
  this.options= '' // Opciones para radio/checkbox/select
  this.valor= ''
  this.placeholder= ''
  this.required= false
  this.orientacion= true

  }

}
