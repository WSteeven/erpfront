// Dependencias
import { computed, ref } from 'vue'

// Logica y controladores
import { ComponenteModal } from '../domain/ComponenteModal.domain'
import { ModalesEntidad } from '../domain/modalesEntidad.domain'

export class ComportamientoModales<T extends ModalesEntidad<T>> {
  protected refModalEntidades = ref()
  protected modales: T

  protected componenteActual = ref<ComponenteModal>()
  public abierto = ref(false)

  constructor(modales: T) {
    this.modales = modales
  }

  getModales() {
    return this.modales
  }

  useModal(): any {
    const componente = computed(() => this.componenteActual.value?.component)
    const titulo = computed(() => this.componenteActual.value?.titulo)
    const abierto = computed({
      set: valor => (this.abierto.value = valor),
      get: () => this.abierto.value
    })
    const datos = computed(() => this.componenteActual.value?.datos)

    return {
      componente,
      titulo,
      abierto,
      datos,
      refModalEntidades: this.refModalEntidades,
    }
  }

  abrirModalEntidad<N>(id: keyof T, datos?: Record<keyof N, any>): void {
    const componente = this.obtenerModal(id)
    componente.datos = datos

    if (componente) {
      this.componenteActual.value = componente
      this.abierto.value = true
    }
  }

  cerrarModalEntidad(): void {
    this.abierto.value = false
  }

  private obtenerModal(id: keyof T): ComponenteModal {
    return this.modales[id]
  }
}
