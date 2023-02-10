import { ref } from 'vue'

export class EstadoPrevisualizarTablaPDF {
  constructor() {
    //
  }

  private abierto = ref(false)

  abrirVistaPrevia() {
    this.abierto.value = true
  }

  cerrarVistaPrevia() {
    this.abierto.value = false
  }

  estadoAbierto() {
    return { abierto: this.abierto }
  }
}
