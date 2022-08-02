import {Hidratable} from "./hidratable"

export class Entidad extends Hidratable {
  id: number | null

  constructor() {
    super()
    this.id = null
  }
}
