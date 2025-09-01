export class EnvioValija {
  courier: string | null
  fotografia_guia: string | null
  anulado: boolean

  constructor() {
    this.courier = null
    this.fotografia_guia = null
    this.anulado = false
  }
}
