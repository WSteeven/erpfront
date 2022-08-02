import {computed, ComputedRef} from "vue"
import {useStore} from "vuex"

export class Cargando {
  public estaCargando: ComputedRef<boolean>
  store = useStore()

  constructor() {
    this.estaCargando = computed(() => this.store.state.cargando.cargando)
  }

  activar(): void {
    this.store.dispatch("cargando/activarCargando")
  }

  desactivar(): void {
    this.store.dispatch("cargando/desactivarCargando")
  }
}
