import {Component} from "vue"

export class ComponenteModal {
  component: Component
  titulo: string
  // propiedades: any

  constructor(titulo: string, component: Component) {
    //, propiedades?: any) {
    this.titulo = titulo
    // this.propiedades = propiedades
    this.component = component
  }

  public getComponent(): Component {
    return this.component
  }
}
