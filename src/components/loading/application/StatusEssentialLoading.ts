import { useCargandoStore } from 'stores/cargando'
import { computed, ComputedRef, Ref } from 'vue'

export class StatusEssentialLoading {
  public estaCargando: ComputedRef<boolean>
  store = useCargandoStore()
  // mensaje: Ref<string> = 'Cargando'

  constructor() {
    this.estaCargando = computed(() => this.store.cargando)
    // this.mensaje.value = 'Cargando...'
  }

  activar(): void {
    this.store.activarCargando()
  }

  establecerMensaje(mensaje: string): void {
    // this.mensaje.value = mensaje
  }

  desactivar(): void {
    this.store.desactivarCargando()
  }
}
