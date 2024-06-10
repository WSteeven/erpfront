import { ref } from 'vue'

export class VisibleModal {
  constructor() {
    //
  }

  private abierto = ref(false)

  abrir() {
    this.abierto.value = true
  }

  cerrar() {
    this.abierto.value = false
  }

  estadoAbierto() {
    return { abierto: this.abierto }
  }
}
