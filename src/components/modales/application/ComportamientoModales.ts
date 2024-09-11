// Dependencias
import { computed, reactive, ref } from 'vue'

// Logica y controladores
import { ComponenteModal } from '../domain/ComponenteModal.domain'
import { ModalesEntidad } from '../domain/modalesEntidad.domain'

export class ComportamientoModales<T extends ModalesEntidad<T>> {
  protected refModalEntidades = ref()
  protected modales: T

  protected componenteActual = ref<ComponenteModal>()
  public abierto = ref(false)
  public propsData = ref()

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

    return {
      componente,
      titulo,
      abierto,
      propsData: this.propsData,
      componenteActual: this.componenteActual,
      refModalEntidades: this.refModalEntidades,
    }
  }

  abrirModalEntidad<N>(id: keyof T, datos?: Record<keyof N, any>): void {
    const componente = this.obtenerModal(id)
    this.propsData.value = datos

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
