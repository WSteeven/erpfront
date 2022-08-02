// Dependencias
import {computed, ref, UnwrapRef} from "vue"
// Componentes
import {Modal} from "bootstrap/dist/js/bootstrap.js"
// Logica y controladores
import {ComponenteModal} from "../domain/ComponenteModal.domain"
import {ModalesEntidad} from "../domain/modalesEntidad.domain"

export class ComportamientoModales<T extends ModalesEntidad<T>> {
  protected refModalEntidades = ref()
  protected modales: T

  protected componenteActual = ref<ComponenteModal>()

  private modal: UnwrapRef<any>

  constructor(modales: T) {
    this.modales = modales
  }

  useModal(): any {
    const componente = computed(() => this.componenteActual.value?.component)
    const titulo = computed(() => this.componenteActual.value?.titulo)
    // const propiedades = computed(() => this.componenteActual.value?.propiedades)

    return {
      componente,
      titulo,
      // propiedades,
      refModalEntidades: this.refModalEntidades,
    }
  }

  abrirModalEntidad(id: keyof T): void {
    const componente = this.obtenerModal(id)
    if (componente) {
      this.componenteActual.value = componente
      this.modal = new Modal(this.refModalEntidades.value)
      this.modal.show()
    }
  }

  cerrarModalEntidad(): void {
    this.modal.hide()
  }

  private obtenerModal(id: keyof T): ComponenteModal {
    return this.modales[id]
  }
}
