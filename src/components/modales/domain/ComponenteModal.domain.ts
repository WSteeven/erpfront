import { Component } from 'vue'

export class ComponenteModal {
  component: Component
  titulo: string
  datos: any

  constructor(titulo: string, component: Component, datos?: any) {
    this.titulo = titulo
    this.datos = datos
    this.component = component
  }

  public getComponent(): Component {
    return this.component
  }
}
