/* eslint-disable @typescript-eslint/no-explicit-any */
export class Hidratable {
  hydrate(data: any): any {
    // entidad para obtener atributos por defecto
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    const defValues = new this.constructor() // Dejar ()
    for (const key in this) {
      const value: any = this[key]
      // console.log(value)
      if (value instanceof Hidratable) {
        console.log('Es hidratable')
        if (data[key]) {
          console.log('La clave es: ' + key)
          console.log('Y tiene valor que es: ' + value)
          console.log('Y tiene valor que es: ' + typeof value)
          console.log(data[key])
          value.hydrate(data[key])
        }
      }
      // si existe algun dato que coincida, se ocupara dicho valor
      else if (data.hasOwnProperty(key)) this[key] = data[key]
      // de otra forma, ocupara un atributo por defecto para esa clave
      else this[key] = defValues[key] // dejar
    }
    return this
  }

  createCopy(): any {
    const copy = this.constructor()
    copy.hydrate(this)
    return copy
  }
}
