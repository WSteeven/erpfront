import { Validador } from './Validador'

export class ValidadorMultiple<T extends Validador> implements Validador {
  protected validadores: T[] = []

  async validar() {
    const result = await Promise.all(this.validadores.map(e => e.validar()))
    return result.every(e => e)
  }

  agregarValidadores(...validador: T[]) {
    this.validadores.push(...validador)
  }

  removerValidadores(index: number) {
    this.validadores.splice(index, 1)
  }
}
