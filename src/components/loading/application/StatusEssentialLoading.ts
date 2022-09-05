import { useCargandoStore } from 'stores/cargando'
import { computed, ComputedRef } from 'vue'

export class StatusEssentialLoading {
  public estaCargando: ComputedRef<boolean>
  store = useCargandoStore()

  constructor() {
    this.estaCargando = computed(() => this.store.cargando)
  }

  activar(): void {
    console.log('activando')
    this.store.activarCargando()
  }

  desactivar(): void {
    console.log('desactivando')
    this.store.desactivarCargando()
  }
}
