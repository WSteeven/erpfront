// Dependencias
import { computed, ref, UnwrapRef } from 'vue'

// Logica y controladores
import { ComponenteModal } from '../domain/ComponenteModal.domain'
import { ModalesEntidad } from '../domain/modalesEntidad.domain'

export class ComportamientoModales<T extends ModalesEntidad<T>> {
  protected refModalEntidades = ref()
  protected modales: T

  protected componenteActual = ref<ComponenteModal>()

  private modal: UnwrapRef<any>

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
      set: (valor) => (this.abierto.value = valor),
      get: () => this.abierto.value,
    })

    return {
      componente,
      titulo,
      abierto,
      // propiedades,
      refModalEntidades: this.refModalEntidades,
    }
  }

  abrirModalEntidad(id: keyof T): void {
    const componente = this.obtenerModal(id)

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
